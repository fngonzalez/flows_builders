import fs from 'node:fs';

import postcss from 'postcss';

// Check actual theme declarations, without hard-coded app colors or a guessed WCAG pass.
const sources = ['node_modules/@cognite/aura/dist/colors.css', 'src/styles.css'];
function themeVariables(theme) {
  const variables = new Map();
  for (const file of sources) postcss.parse(fs.readFileSync(file, 'utf8')).walkRules((rule) => {
    if (![':root', theme === 'light' ? ':root:not(.dark)' : '.dark'].includes(rule.selector)) return;
    rule.walkDecls((decl) => variables.set(decl.prop, decl.value));
  });
  return variables;
}
function rgb(variables, name, seen = new Set()) {
  if (seen.has(name)) throw new Error('Circular color token: ' + name);
  seen.add(name);
  const value = variables.get(name);
  const reference = /^var\((--[^)]+)\)$/.exec(value ?? '');
  if (reference) return rgb(variables, reference[1], seen);
  const match = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(value ?? '');
  if (!match) throw new Error('Unresolved color token: ' + name + ' = ' + value);
  return match.slice(1).map(Number);
}
function luminance(color) {
  return color.map((v) => v / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
}
const results = ['light', 'dark'].flatMap((theme) => {
  const variables = themeVariables(theme);
  return ['--background', '--card-background', '--muted-background'].map((background) => {
    const foregroundRgb = rgb(variables, '--muted-foreground');
    const backgroundRgb = rgb(variables, background);
    const a = luminance(foregroundRgb), b = luminance(backgroundRgb);
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    return { theme, foreground: '--muted-foreground', background, foregroundRgb, backgroundRgb, ratio, minimum: 4.5, pass: ratio >= 4.5 };
  });
});
console.log(JSON.stringify({ scope: 'Static resolved Aura/CSS token pairs, not a full rendered accessibility audit', source: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html', results }, null, 2));
if (results.some((item) => !item.pass)) process.exitCode = 1;
