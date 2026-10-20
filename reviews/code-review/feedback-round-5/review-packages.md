# Package audit - Asset 360

Audit and outdated metadata refreshed on 2026-10-20 for round 5; installed versions come from the current lockfile.

## Dependencies

| Package | Used version | Latest | Deprecated | CVEs | Health |
| --- | --- | --- | --- | --- | --- |
| @cognite/app-sdk | 0.9.0 | 0.11.46884 | None reported at install | none | Warn: multiple minor releases; review compatibility |
| @cognite/aura | 0.3.5 | 1.47181.0 | None reported at install | low | Warn: compatibility/update plan |
| @cognite/sdk | 10.15.0 | 10.16.0 | None reported at install | none | Pass |
| @tabler/icons-react | 3.49.0 | 3.49.0 | None reported at install | none | Pass |
| @tanstack/react-query | 5.104.4 | 5.104.5 | None reported at install | none | Pass |
| @tanstack/react-table | 8.21.3 | 9.3.1 | None reported at install | none | Warn: compatibility/update plan |
| @tanstack/react-virtual | 3.10.8 | 3.14.21 | None reported at install | none | Warn: multiple minor releases; review compatibility |
| clsx | 2.1.1 | 2.1.1 | None reported at install | none | Pass |
| react | 18.3.1 | 19.3.1 | None reported at install | none | Warn: compatibility/update plan |
| react-dom | 18.3.1 | 19.3.1 | None reported at install | none | Warn: compatibility/update plan |
| recharts | 3.7.0 | 3.10.1 | None reported at install | none | Warn: multiple minor releases; review compatibility |
| tailwind-merge | 3.7.0 | 3.7.0 | None reported at install | none | Pass |

## Security audit

| Severity | Count |
| --- | ---: |
| critical | 0 |
| high | 0 |
| moderate | 0 |
| low | 4 |

## Vulnerabilities

| Package | Severity | Title | Patched in | Advisory |
| --- | --- | --- | --- | --- |
| @cognite/aura | low | Inherited dependency advisory | See compatibility note | @streamdown/mermaid |
| @streamdown/mermaid | low | Inherited dependency advisory | See compatibility note | mermaid |
| katex | low | KaTeX: Existing prototype pollution can bypass trust restrictions | See compatibility note | [Advisory](https://github.com/advisories/GHSA-238p-pmpm-9mq7) |
| mermaid | low | Inherited dependency advisory | See compatibility note | katex |

The four low findings are inherited through Aura -> streamdown/mermaid -> KaTeX. Those optional renderers are not imported by this app; no force downgrade of Aura was performed. Vitest, its UI and coverage adapter were updated together to 4.1.12, removing the moderate mocker advisory.

Compatibility plan: keep the official scaffold's React 18, Aura 0.3.5 and app-sdk 0.9.0 API family for this exercise. Migrate those together with the next scaffold upgrade, including React/Table peers. Major toolchain upgrades are separate from this feature. ESLint 9 is a scaffold development dependency with a vendor support notice; track its migration with the toolchain.

Aura deprecation spot-check earlier on 2026-10-20 returned no notice. The installed dependency family is unchanged.
