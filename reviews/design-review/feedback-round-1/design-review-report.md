# Design Review — Asset 360 Investigation Workspace — round 1

Fecha: 2026-10-20 (America/Buenos_Aires).

**Estado: revisión completada con diez notas confirmadas. Promedio 3,7/5; nivel Average. No alcanza el umbral de presentación de 3,8.**

## User and tasks

- **Primary user:** Operations Analyst o Reliability Engineer, investigando anomalías de equipos desde un desktop o laptop, según el caso y contexto de App-Brief.md confirmados por el usuario el 2026-10-19.
- **Tasks evaluated:**
  1. Buscar un equipo por tag y abrir su identidad y contexto.
  2. Elegir una señal y un rango para investigar su historial en el gráfico.
  3. Encontrar y abrir un documento relacionado sin abandonar la investigación.
- **Context:** aplicación de consulta en publicdata/publicdatacdm, dentro de Fusion; escritorio como dispositivo objetivo. Encontrar un equipo en menos de 30 segundos e investigar en menos de 15 minutos son metas sin medir. La experiencia previa del usuario y el uso de una sesión limpia no están registrados.
- **Technical prerequisite:** diseño comenzó tras código round 3 con cero Must Fix. El defecto de tabla descubierto durante diseño pasó después la revisión de código round 4; el ajuste posterior de contraste pasó la [revisión de código round 5](../../code-review/feedback-round-5/code-review-report.md), también con cero Must Fix, antes de cerrar este informe.
- **Revision:** HEAD b46e8dfc37ea1793e1f6913b87e9abd532422aef con las correcciones de tablas, pruebas y contraste incluidas en ese commit; hash de fuentes 9b59bf7ac114c43bbfde50cfd1ee3cdd09be8aff09e7b2091748bd0624747e83. SPEC FR-015a describe las tablas y FR-015b el contraste. El CSS tiene SHA-256 7e57d0554301c92d9b772ba0b5b96bcbb7ae2bd04c6face106ed5236c8752a99.
- **Rubric:** [Cognite quality guidelines](https://docs.cognite.com/cdf/flows/guides/quality-guidelines), consultadas el 2026-10-20. Se aplicó la habilidad local flows-design-review; las diez notas requieren confirmación del usuario.

## Task walkthrough findings

Recorrido registrado a partir de los resultados explícitos que el usuario compartió durante la conversación. Se conserva el intento de documentos ya reportado; la nueva respuesta confirma de nuevo gráfico y actividades, sin añadir una apertura de archivo:

- **Task 1 — Buscar y abrir un activo.** El usuario abrió `valhall-assets` / `WMT:23-PC-9109-M01`, con identidad, descripción, dos sensores y dieciséis actividades. No se inventó estado de orden de trabajo cuando el modelo no lo proporciona.
- **Task 2 — Investigar una señal.** El 2026-10-20 el usuario volvió a confirmar que puede abrir series y ver el gráfico. Copió el encabezado `3/7/2026, 11:30:35 AM – 3/14/2026, 11:30:35 AM · Average / 30m. Window ends at the latest selected datapoint.`, coherente con el rango 7d. También confirmó la lista de 16 actividades. No se registró una prueba de todos los rangos ni un tiempo de carga medido.
- **Task 3 — Abrir un documento.** El usuario intentó encontrar candidatos repetidamente. Hay registros accesibles de archivos, pero la muestra consultada no devolvió activos relacionados. La apertura de contenido real no se pudo completar. Esto registra un bloqueo de datos de ejemplo; no prueba que falten relaciones en todo el proyecto ni que el visor funcione con un archivo real.
- **Pain point reported:** el usuario indicó que no entendía la instrucción de descubrimiento de activos con señales y encontró el ejemplo por su cuenta. Este antecedente debe considerarse al evaluar navegación, etiquetas y clickabilidad; no se asigna una nota automáticamente a partir de él.

El detalle de una actividad, el enlace compartido y el historial tras recargar siguen pendientes de comprobación manual, como figura en CERTIFICATION-CHECKLIST.md.

## Comentarios del usuario y corrección de la notebook

El usuario encontró además WMT:23-KA-9101-M01 en valhall-assets: 43 series, 368 actividades, dos gráficos con 102 y 121 muestras y cero documentos. Informó que no observó demoras. Indicó que los valores de Work orders & activities se superponían en la notebook.

Antes de cambiar la UI, una prueba con los componentes reales de React y Aura reprodujo un botón de 801,8px dentro de una celda de 150px. La corrección limita y recorta los nombres, conserva el nombre accesible completo, distribuye las columnas y limita cada tabla a una zona de 384px con desplazamiento interno. La regresión pasó a anchos internos de 1000, 1256 y 1416px. El usuario recargó Fusion y confirmó: «Sí, ahora se lee bien». Ver [evidencia de regresión](../../code-review/feedback-round-4/layout-regression.json).

La prueba de navegador usa datos de prueba inyectados en una página local separada; no usa autenticación de Fusion ni datos de producción. Las capturas generadas quedaron en blanco y no se usaron como evidencia visual. La aceptación de la notebook procede de la respuesta del usuario.

Las primeras preguntas técnicas resultaron confusas. Se conservaron sus comentarios como evidencia y se reformularon las preguntas con acciones y observaciones concretas. No se interpretó «no sé» como aceptación de una nota.

El usuario confirmó después: «Anda bien la navegación con teclado». La observación es general y no sustituye una comprobación detallada de foco o contraste. También aceptó 4/5 en adaptación a notebook y rapidez. Para mensajes sólo confirmó las fechas; en documentos pidió cambiar la nota sin indicar todavía un número.


## Corrección posterior de contraste

La revisión de los tokens instalados confirmó el comentario del usuario: el texto secundario claro tenía 3,71:1 sobre blanco. Una comprobación previa falló; después de usar el token secundario de Aura, la relación es 9,58:1. Los seis pares revisados de temas claro/oscuro superan 4,5:1. La prueba resuelve declaraciones CSS y no sustituye una auditoría visual completa. El usuario mantuvo Q10 en 3/5; la mejora no se toma como aprobación visual posterior.

## Pre-scan and probe evidence

El [registro completo de probes](probe-evidence.json) contiene coincidencias, archivos y líneas. Se excluyeron pruebas, fixtures y declaraciones del análisis de UI. Se usó además el AST de TypeScript para revisar atributos JSX multilínea y evitar falsos resultados de expresiones regulares de una sola línea.

| Pregunta | Evidencia reunida | Qué requiere observación manual |
| --- | --- | --- |
| Q1 Aura consistency | Aura 0.3.5; 17 líneas de importación en cuatro módulos; cero colores hex/RGB/HSL; lint con aura/no-overriding-styles habilitada sin avisos. Un ancho de 280px se limita a la grilla de escritorio. | Coherencia visual, espaciado y tamaño de componentes en Fusion. |
| Q2 Navigation & hierarchy | Una investigación gobernada por el host, títulos de inicio y activo, grupos de información y botón All investigations. Sin router adicional ni breadcrumbs. | Claridad de ubicación y regreso durante las tres tareas. |
| Q3 Labels & language | Cero etiquetas genéricas del probe; CommandInput tiene nombre accesible y placeholder complementario; sensores usan CheckboxItemLabel. Hay un antecedente de confusión con el descubrimiento de activos. | Comprensión de nombres y acciones sin explicación externa. |
| Q4 Feedback & validation | Estados de carga/error/vacío independientes, reintentos, mensajes de falta de acceso y cuatro instancias de ErrorBoundary. Cero mutaciones de CDF. La revisión técnica pasó. | Visibilidad y utilidad de mensajes y tiempos de respuesta reales. |
| Q5 Clickability | Quince declaraciones de Aura Button, todas con texto, expresión de nombre o aria-label; cero onClick nativos no semánticos. Aura incorpora hover, cursor y foco. | Obviedad de las acciones, incluidos nombres de actividades y archivos. |
| Q6 Error prevention | CDF es de solo lectura. Clear history borra el historial local y no tiene confirmación ni deshacer; cerrar ventanas permite cancelar la exploración. | Si borrar el historial local genera una pérdida inesperada o confusión. |
| Q7 Responsive | Viewport presente; cuatro líneas con breakpoints; sin w/h de píxeles fijos ni contenedores de scroll horizontal explícitos. Grilla con panel de 280px solo en lg. La regresión de tablas pasa a tres anchos y el usuario confirmó el arreglo en la notebook. | Revisar otros tamaños de escritorio y el recorrido completo. |
| Q8 Empty states | Ramas explícitas para búsqueda sin resultados, descubrimiento, historial vacío, series, actividades, documentos, ninguna señal elegida, ausencia de puntos y formatos no compatibles. No se identificó un panel de datos sin mensaje de vacío. | Claridad de los próximos pasos, especialmente ante la falta de documentos relacionados. |
| Q9 Performance | Build aprobado en esta revisión; JS+CSS suman 340.809 bytes gzip; gráfico separado por lazy import; cuatro llamadas instances.list, todas con límite; TanStack Query cachea resultados. Aura DataGrid usa useVirtualizer en su implementación. Criterio técnico 2.3: 4/5. | Velocidad percibida y esfuerzo para completar las tareas; no se midió latencia de CDF ni renderizado real. |
| Q10 Accessibility | Una imagen con alt y un iframe con title; cero botones sin nombre detectados y cero tabIndex negativos. Trece líneas con aria-label. Estilos de foco/hover proporcionados por Aura, sin duplicación local. | Tab/Enter/Escape, orden de foco, contraste, tamaños y lectura con ayudas técnicas. No hay axe-core ni eslint-plugin-jsx-a11y instalados. |

`cua.getState()` devolvió `apps: []` y `browsers: []` durante esta revisión. No se realizaron capturas ni inspección de DOM en Fusion. La regresión de geometría en Edge corresponde a una página local de prueba separada. Los probes son evidencia de código, no una comprobación WCAG ni una evaluación visual completa.

## Scores

Las diez notas de esta tabla fueron aceptadas o modificadas explícitamente por el usuario. Q8 conserva su valoración de 2/5 y Q10 su valoración de 3/5. La corrección técnica de contraste posterior se registra sin elevar automáticamente la nota del usuario.

| Question | Score | Rationale | Improvement note |
| --- | --- | --- | --- |
| Q1 Aura consistency | 4 | Aura y sus componentes se usan de forma consistente; la corrección de contraste reutiliza un token semántico existente. | Revisar espaciado y mantener documentada la excepción de contraste. |
| Q2 Navigation & hierarchy | 4 | El usuario encontró equipos, llegó a los gráficos y aceptó la claridad de navegación. | Validar regreso, historial y enlaces compartidos con la sesión real. |
| Q3 Labels & language | 4 | El usuario aceptó las etiquetas; el descubrimiento de equipos con sensores requirió una aclaración inicial. | Simplificar las instrucciones de descubrimiento. |
| Q4 Feedback & validation | 4 | El usuario encontró los mensajes, los consideró al grabar el video y aceptó 4/5; no se inspeccionó ese video. | Mantener mensajes específicos y recuperación por panel. |
| Q5 Clickability | 4 | El usuario aceptó que las acciones son reconocibles; los controles tienen nombres accesibles. | Comprobar apertura de actividades y archivos con ejemplos reales. |
| Q6 Error prevention | 4 | Aplicación de consulta; el usuario aceptó la descripción de Clear history y su efecto sobre el historial local. | Valorar deshacer si el borrado local resulta inesperado. |
| Q7 Responsive | 4 | La superposición fue reproducida, corregida y confirmada en la notebook; el usuario aceptó 4/5. | Revisar otros tamaños de escritorio. |
| Q8 Empty states | 2 | El usuario fijó 2/5: la ayuda no permite resolver la búsqueda de un documento relacionado. La apertura real sigue pendiente. | Conseguir un ejemplo accesible vinculado y probar la apertura; mejorar la orientación con ese caso. |
| Q9 Performance | 4 | El usuario no observó demoras y aceptó 4/5; consultas con límites, caché y gráfico diferido. | Medir tiempos reales y valorar debounce de búsqueda. |
| Q10 Accessibility | 3 | El teclado funciona según el usuario; informó contraste legible pero poco logrado y confirmó 3/5. El texto gris claro se reforzó después con una regresión de colores aprobada. | Validar en pantalla el contraste corregido, foco y ayudas técnicas; no se declara una auditoría WCAG completa. |

## Summary

- Average score: 3.7
- Quality level: Average
- Submission gate: NOT MET (requires average >= 3.8).
- All ten scores explicitly confirmed; task walkthrough recorded from user reports.

## Must Fix (any score < 3)

- D1 — Q8, 2/5: la orientación no permitió completar la tarea de documentos. Se necesita un activo y archivo cargado relacionados mediante CogniteFile.assets y accesibles para el usuario. Obtener del instructor o administrador ambos pares space/externalId, abrir el archivo desde Documents y comprobar su contenido. La muestra sin candidatos no demuestra ausencia global; los fixtures no sustituyen esta prueba.

## Should Fix (any score 3 – 3.7)

- D2 — Q10, 3/5: revisar el resultado de contraste, foco y accesibilidad en la sesión real. Se corrigió el texto secundario del tema claro: los seis pares de colores resueltos ahora pasan 4,5:1. Esto no cubre todos los estados o colores renderizados ni modifica por sí solo la nota confirmada. Ver [antes](../../code-review/feedback-round-5/contrast-before.json), [después](../../code-review/feedback-round-5/contrast-after.json) y [criterio W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

## Nice to Fix (any score 3.8 – 4.4)

- Q1/Q7: revisar espaciado y tamaños de escritorio restantes; mantener el uso de tokens Aura.
- Q2/Q3: comprobar restauración del contexto y simplificar las instrucciones de descubrimiento.
- Q4/Q5: mantener feedback específico y comprobar las acciones de las tablas con datos reales.
- Q6/Q9: considerar recuperación del historial borrado y medir rendimiento real antes de ajustar debounce.

## Video y siguiente paso

El usuario informó el 2026-10-20 que ya grabó el video considerando los mensajes, como pide la guía. El archivo o URL no se entregó y su contenido no se inspeccionó; no se asume que demuestre una apertura real de documentos ni las otras pruebas pendientes.

Resolver D1 y D2, conservar evidencia real y ejecutar una nueva ronda de flows-design-review antes de presentar. La revisión de código round 5 tiene cero Must Fix, pero el diseño de esta ronda no alcanza el objetivo.
