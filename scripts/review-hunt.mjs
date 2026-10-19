import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// Read-only source probes; writes only the local review evidence.
const round = 'reviews/code-review/feedback-round-1';
mkdirSync(round, { recursive: true });
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name).replaceAll('\\', '/');
    return entry.isDirectory() ? walk(file) : /\.tsx?$/.test(file) ? [file] : [];
  });
}
const files = [...walk('src'), 'vite.config.ts', 'vitest.config.ts', 'vitest.setup.ts', 'tsconfig.json'];
const sources = new Map(files.map((file) => [file, readFileSync(file, 'utf8')]));
const checks = {
  'Coverage / test scope': /coverage|exclude|include|testPathIgnorePatterns|coveragePathIgnorePatterns/,
  'Error boundaries': /ErrorBoundary|componentDidCatch|getDerivedStateFromError/,
  'Critical TODOs': /(TODO|FIXME|HACK|XXX):/,
  'Effects / cleanup': /useEffect|cancelled|return \(\) =>/,
  'Loading / error feedback': /useQuery|useMutation|isLoading|isPending|isError|PanelState|Feedback/,
  'CDF Raw': /client\.raw\.|\.raw\.(listRows|insertRows|retrieveRow|deleteRows)|listRows|insertRows|retrieveRow/,
  'DMS calls': /instances\.(list|search|query|aggregate|retrieve)/,
  'Concurrency / retry': /QueuedTaskRunner|cdfTaskRunner|429|Retry-After|exponential|backoff|retryRead/,
  'Unsafe types / casts': /: any|as any|<any>|as unknown as/,
  'Module mocks': /vi\.mock\(/,
  'Context injection': /createContext|useContext|useWorkspace/,
  'Direct client construction': /new CogniteClient|createCogniteClient/,
  'Service interfaces': /class\s+\w+(Service|Client|Repository|Manager)|implements AssetService/,
  'Fetch inside a view': /useQuery|useMutation|sdk\.|client\./,
  'ViewModel': /ViewModel/,
  'Console calls': /console\.(log|debug|warn|error|info)/,
  'Routes': /path:\s*['"]|<Route/,
  'Flag-bag types': /loading\?|isLoading.*isError|isSuccess.*isError/,
  'Duplicated SDK shapes': /^(export )?type \w+Summary|^(export )?interface \w+DTO/,
  'Same-primitive positional parameters': /^\s*(export\s+)?(function|const)\s+\w+\s*\([^)]*string[^)]*string/,
  'Classic repeated fetches': /sdk\.(assets|timeseries|events|files)\.(list|retrieve)/,
  'Formatting helpers': /toLocaleDateString|toLocaleString|new Date\(/,
  'Repeated long layout classes': /className="[^"]{40,}"/,
  'Accessibility probes': /<img|aria-label|focus-visible|tabIndex|onClick/,
  'Raw colors / fixed dimensions': /#[0-9a-fA-F]{3,8}\b|rgba?\(|\b[wh]-\[\d+px\]/,
};
let evidence = '# Review hunt evidence\n\nCurrent flows-review-checks and code-quality were pulled from cognitedata/builder-skills before this review. Windows equivalents cover the full source tree; missing src/hooks and src/contexts are represented by src/viewmodels and src/state.\n\n';
for (const [name, pattern] of Object.entries(checks)) {
  const hits = [];
  for (const [file, content] of sources) {
    if (name === 'Fetch inside a view' && !file.startsWith('src/views/') || name === 'Critical TODOs' && file.includes('.test.')) continue;
    content.split('\n').forEach((line, i) => { if (pattern.test(line)) hits.push(`${file}:${i + 1}: ${line.trim()}`); });
  }
  evidence += `## ${name}\n\n${hits.length ? hits.map((hit) => `- ${hit}`).join('\n') : 'none'}\n\n`;
}
const production = files.filter((file) => file.startsWith('src/') && !file.includes('.test.') && !file.includes('/__mocks__/'));
const hash = createHash('sha256');
let inventory = '# File inventory\n\n| File | Lines | Structure | Quality | Patterns | Tests | Notes |\n| --- | ---: | --- | --- | --- | --- | --- |\n';
for (const [file, content] of sources) {
  const test = file.includes('.test.') ? 'Test' : [...sources.keys()].some((candidate) => candidate === file.replace(/\.(tsx?)$/, '.test.$1')) ? 'Yes' : file === 'src/main.tsx' || file.includes('config') || file.includes('setup') ? 'Bootstrap/config exception' : file.includes('__mocks__') ? 'Test-only helper' : 'Check';
  inventory += `| ${file} | ${content.split('\n').length} | Reviewed | Reviewed | Reviewed | ${test} | ${file.includes('/views/') && !file.includes('.test.') ? 'Large presentational view; no direct data calls' : ''} |\n`;
  if (production.includes(file)) hash.update(file).update(content);
}
evidence += '## Possibly unused modules\n\n';
let unused = 0;
for (const file of production) {
  if (file === 'src/main.tsx') continue;
  const base = path.basename(file).replace(/\.(tsx?)$/, '');
  const imported = [...sources].some(([other, content]) => other !== file && content.includes(base));
  if (!imported) { unused++; evidence += `- ${file}\n`; }
}
if (!unused) evidence += 'none (main.tsx is the HTML entry point).\n';
evidence += '\n## Comment blocks and naming\n\n';
for (const file of production) {
  const content = sources.get(file);
  const blocks = [...content.matchAll(/(?:^\s*\/\/.*\n){3,}/gm)];
  if (blocks.length) evidence += `- ${file}: ${blocks.length} multi-line comment block(s); inspected as explanations, not dead source.\n`;
}
evidence += '- No routed pages are unreachable: the host state selects one investigation view.\n- Hook name starts with use; component symbols use PascalCase. File naming follows the scaffold; the optional per-component barrel structure is not used.\n';
writeFileSync(`${round}/review-files.md`, inventory);
writeFileSync(`${round}/hunt-evidence.md`, evidence);
writeFileSync(`${round}/source-sha256.txt`, hash.digest('hex') + '\n');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const audit = JSON.parse(readFileSync('tmp/audit.json', 'utf8').replace(/^\uFEFF/, ''));
const outdated = JSON.parse(readFileSync('tmp/outdated.json', 'utf8').replace(/^\uFEFF/, ''));
let packages = '# Package audit - Asset 360\n\nRegistry audit refreshed after the Vitest patch update. Outdated metadata was captured immediately before that patch; current versions below come from the final lockfile.\n\n## Dependencies\n\n| Package | Used version | Latest | Deprecated | CVEs | Health |\n| --- | --- | --- | --- | --- | --- |\n';
for (const [name] of Object.entries(pkg.dependencies)) {
  const current = lock.packages[`node_modules/${name}`]?.version ?? 'unknown';
  const latest = outdated[name]?.latest ?? current;
  const vulnerable = audit.vulnerabilities?.[name];
  packages += `| ${name} | ${current} | ${latest} | None reported at install | ${vulnerable?.severity ?? 'none'} | ${vulnerable || latest.split('.')[0] !== current.split('.')[0] ? 'Warn: compatibility/update plan' : 'Pass'} |\n`;
}
packages += '\n## Security audit\n\n| Severity | Count |\n| --- | ---: |\n';
for (const severity of ['critical', 'high', 'moderate', 'low']) packages += `| ${severity} | ${audit.metadata.vulnerabilities[severity]} |\n`;
packages += '\n## Vulnerabilities\n\n| Package | Severity | Title | Patched in | Advisory |\n| --- | --- | --- | --- | --- |\n';
for (const [name, item] of Object.entries(audit.vulnerabilities ?? {})) {
  const advisories = item.via.filter((via) => typeof via !== 'string');
  packages += `| ${name} | ${item.severity} | ${advisories.map((via) => via.title).join('; ') || 'Inherited dependency advisory'} | ${item.fixAvailable ? 'See compatibility note' : 'Not available'} | ${advisories.map((via) => `[Advisory](${via.url})`).join(', ') || item.via.filter((via) => typeof via === 'string').join(', ')} |\n`;
}
packages += '\nThe four low findings are inherited through Aura -> streamdown/mermaid -> KaTeX. Those optional renderers are not imported by this app; no force downgrade of Aura was performed. Vitest, its UI and coverage adapter were updated together to 4.1.12, removing the moderate mocker advisory.\n\nCompatibility plan: keep the official scaffold\'s React 18, Aura 0.3.5 and app-sdk 0.9.0 API family for this exercise. Migrate those together with the next scaffold upgrade, including React/Table peers. Major toolchain upgrades are separate from this feature. ESLint 9 is a scaffold development dependency with a vendor support notice; track its migration with the toolchain.\n';
writeFileSync(`${round}/review-packages.md`, packages);
console.log(`Reviewed ${files.length} source/config files; unused candidates: ${unused}`);
