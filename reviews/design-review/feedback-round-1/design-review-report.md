# Design Review — Asset 360 Investigation Workspace — round 1

Fecha: 2026-10-20 (America/Buenos_Aires).

**Estado: en curso; recorrido registrado y siete puntuaciones confirmadas; tres pendientes de confirmación.** Este archivo registra la evidencia reunida. Todavía no es un informe de diseño final ni acredita el umbral de presentación.

## User and tasks

- **Primary user:** Operations Analyst o Reliability Engineer, investigando anomalías de equipos desde un desktop o laptop, según el caso y contexto de App-Brief.md confirmados por el usuario el 2026-10-19.
- **Tasks evaluated:**
  1. Buscar un equipo por tag y abrir su identidad y contexto.
  2. Elegir una señal y un rango para investigar su historial en el gráfico.
  3. Encontrar y abrir un documento relacionado sin abandonar la investigación.
- **Context:** aplicación de consulta en publicdata/publicdatacdm, dentro de Fusion; escritorio como dispositivo objetivo. Encontrar un equipo en menos de 30 segundos e investigar en menos de 15 minutos son metas sin medir. La experiencia previa del usuario y el uso de una sesión limpia no están registrados.
- **Technical prerequisite:** diseño comenzó tras código round 3 con cero Must Fix. El defecto de tabla descubierto durante diseño se corrigió y pasó después la [revisión de código round 4](../../code-review/feedback-round-4/code-review-report.md), también con Must Fix open: 0, antes de continuar esta ronda de diseño.
- **Revision:** HEAD 63fb85b6b3abc4af839062731e51ab5d4484e172 más la corrección local de tablas y pruebas; hash de fuentes 9b59bf7ac114c43bbfde50cfd1ee3cdd09be8aff09e7b2091748bd0624747e83. SPEC FR-015a describe el nuevo comportamiento.
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
| Q9 Performance | Build aprobado en esta revisión; JS+CSS suman 340.793 bytes gzip; gráfico separado por lazy import; cuatro llamadas instances.list, todas con límite; TanStack Query cachea resultados. Aura DataGrid usa useVirtualizer en su implementación. Criterio técnico 2.3: 4/5. | Velocidad percibida y esfuerzo para completar las tareas; no se midió latencia de CDF ni renderizado real. |
| Q10 Accessibility | Una imagen con alt y un iframe con title; cero botones sin nombre detectados y cero tabIndex negativos. Trece líneas con aria-label. Estilos de foco/hover proporcionados por Aura, sin duplicación local. | Tab/Enter/Escape, orden de foco, contraste, tamaños y lectura con ayudas técnicas. No hay axe-core ni eslint-plugin-jsx-a11y instalados. |

`cua.getState()` devolvió `apps: []` y `browsers: []` durante esta revisión. No se realizaron capturas ni inspección de DOM en Fusion. La regresión de geometría en Edge corresponde a una página local de prueba separada. Los probes son evidencia de código, no una comprobación WCAG ni una evaluación visual completa.

## Scores

Las siguientes son propuestas basadas en los probes y el recorrido acumulado. Q1, Q2, Q3, Q5, Q6, Q7 y Q9 tienen aceptación explícita; las otras siguen siendo propuestas. Las respuestas de incomprensión no se interpretaron como aprobaciones. Las carencias de verificación visual se indican expresamente, sin afirmar que exista un defecto visual o un incumplimiento WCAG demostrado.

| Question | Score | Rationale | Improvement note |
| --- | --- | --- | --- |
| Q1 Aura consistency | 4/5 confirmado | Cuatro módulos usan Aura, sin colores fijos ni avisos de estilos. La dimensión de 280px es una excepción de layout de escritorio; la evaluación visual completa no está registrada. | Revisar espaciado y excepciones de layout en pantalla real. |
| Q2 Navigation & hierarchy | 4/5 confirmado | Se encontró y abrió el activo y se llegó al gráfico. Hay identidad, grupos y regreso al inicio; falta validar todo el regreso y el historial. | Comprobar retorno al inicio, historial y restauración del contexto. |
| Q3 Labels & language | 4/5 confirmado | No se detectaron etiquetas genéricas o entradas sin nombre. El usuario antes necesitó aclaraciones para descubrir activos con señales; es una posible ambigüedad puntual, no una confusión general demostrada. | Aclarar el propósito de las acciones de descubrimiento si el usuario confirma esa dificultad. |
| Q4 Feedback & validation | Propuesta 4/5; sin confirmar | En la respuesta más reciente el usuario confirmó las fechas y aclaró que no identificó los avisos de error o falta de datos. Los estados y reintentos tienen evidencia de código y pruebas; falta su valoración numérica. | Mantener diferenciada la evidencia automatizada de la observación real de mensajes. |
| Q5 Clickability | 4/5 confirmado | Quince declaraciones de botones con nombre y ninguna acción nativa no semántica. El usuario seleccionó señales; las acciones de tablas y sus estados de foco aún requieren observación. | Validar que se reconozcan las acciones de actividades y archivos. |
| Q6 Error prevention | 4/5 confirmado | CDF es de solo lectura y el contexto se sincroniza con el host. Clear history elimina únicamente historial local, sin deshacer; no se afirma riesgo de escritura de datos industriales. | Valorar recuperación del historial si su borrado resulta inesperado durante el uso. |
| Q7 Responsive | 4/5 confirmado | Se reprodujo y corrigió la superposición de actividades; prueba de geometría en navegador a tres anchos y confirmación explícita del usuario en la notebook. | Revisar otros tamaños y el recorrido completo; el defecto reportado está resuelto. |
| Q8 Empty states | Propuesta revisada 3/5; sin confirmar | Los vacíos se explican, pero el usuario sigue sin completar la búsqueda de documentos. No se obtuvo un ejemplo relacionado de la muestra consultada. | Conseguir del instructor/administrador un activo y archivo cargado relacionados; validar apertura real. |
| Q9 Performance | 4/5 confirmado | JS+CSS gzip de 340.793 bytes, gráfico lazy, caché, tablas virtualizadas y cuatro lecturas de listas con límite. El usuario ve el gráfico real; no se midieron latencia y esfuerzo y falta debounce temporal. | Medir carga real y revisar debounce de búsqueda. |
| Q10 Accessibility | Propuesta revisada 4/5; sin confirmar | El usuario confirmó que la navegación con teclado funciona. Los controles tienen nombres y las imágenes descripción. No hay auditoría completa de foco, contraste ni ayudas técnicas. | Confirmar la nota y completar las comprobaciones de foco y contraste. |

## Summary

- Assessment status: seven scores confirmed, three pending; task walkthrough recorded from cumulative user reports.
- Average: not computed.
- Quality level: not assigned.
- Submission gate: not evaluated; no passing design score is claimed.

## Must Fix (any score < 3)

Pendiente de puntuación. No se clasifica una limitación de evidencia como un defecto de UI confirmado.

## Should Fix (any score 3 – 3.7)

Pendiente de puntuación y observaciones del recorrido.

## Nice to Fix (any score 3.8 – 4.4)

Pendiente de puntuación y observaciones del recorrido.
