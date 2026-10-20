# Revisión por pasos — Asset 360

Actualizado: 2026-10-20.

Alcance: contrastar los siete pasos de la guía con los archivos, las comprobaciones locales y las confirmaciones del usuario. Esta auditoría de estado no reemplaza las revisiones formales de código y diseño ni otorga la certificación.

## 1. Preparar el proyecto

**Verificado.** `app.json` identifica `asset-360`, infraestructura `appsApi`, organización `publicdata`, proyecto `publicdatacdm` y API `https://api.cognitedata.com`. `.mcp.json` configura Cognite Docs. El adaptador `scripts/cognite-docs.mjs` permitió consultar su documentación oficial. El usuario confirmó que la app abre dentro de Fusion.

El cliente de despliegue todavía no está configurado. Esto corresponde al despliegue pendiente; no impide el desarrollo local que ya se probó.

## 2. Completar el App Brief

**Verificado.** `App-Brief.md` contiene nombre, cliente, Tier 1 y responsable confirmados por el usuario, además de persona, problema, historia, criterios y evidencia del caso propuesto en la guía.

Los tiempos de investigación son objetivos del ejercicio. El archivo aclara que no se realizaron entrevistas independientes ni se midieron esas mejoras. `repoUrl`, cantidad de usuarios e hitos siguen sin información; no se presentan como hechos confirmados.

## 3. Escribir la especificación y comprobar el modelo

**Verificado documentalmente y por pruebas de contratos.** `SPEC.md` contiene escenarios, FR-001 a FR-016, criterios medibles y la sección de integración con CDF. El servicio conserva `(space, externalId)` y usa vistas `cdf_cdm` versión `v1`.

- Los espacios de instancias provienen de CDF; no se confunden con el espacio de las vistas.
- Las relaciones se consultan desde las vistas propietarias mediante `assets`, con paginación.
- El historial del gráfico se ancla al último dato seleccionado y se actualiza manualmente.
- Las actividades no inventan un estado que el modelo básico no ofrece.
- Las URLs de archivo se resuelven a demanda y no se guardan en el historial.

La documentación y las pruebas no acreditan por sí solas la apertura de un archivo real del proyecto.

## 4. Preparar y revisar el plan

**Plan presente y coherente con la implementación.** `PLAN.md` cubre contratos, consultas, estado compartido, UI, pruebas y aceptación en Fusion. La estructura del código separa servicio, estado, ViewModel y presentación como se planificó.

Este resultado comprueba el artefacto y su correspondencia con el código. El archivo por sí solo no acredita el modo del agente utilizado durante la planificación.

## 5. Implementar y conectar datos reales

**Implementado; aceptación real parcial.** La aplicación usa el SDK autenticado del host y CDF para los datos de producción. Los fixtures están en pruebas.

El usuario confirmó para `valhall-assets` / `WMT:23-PC-9109-M01`:

- Identidad y descripción del equipo.
- Dos sensores relacionados.
- Dieciséis actividades relacionadas.
- Un gráfico con datos al seleccionar un sensor.

La comprobación de documentos confirmó registros accesibles y ningún candidato relacionado dentro de la muestra consultada. No demuestra que no haya relaciones en todo el proyecto.

El usuario confirmó después `WMT:23-KA-9101-M01`, también en `valhall-assets`: 43 series, 368 actividades, dos gráficos con muestras y cero documentos. Informó que no observaba demoras.

Faltan las cuatro comprobaciones manuales descritas más abajo.

## 6. Pulir la interfaz con Aura

**Implementado; defecto de notebook corregido y confirmado.** Hay componentes Aura para búsqueda, controles, tablas, mensajes y ventanas. Los paneles tienen estados independientes de carga, vacío, error, reintento y falta de acceso.

Los nombres largos de actividades se superponían con las otras columnas. Una regresión de geometría en Edge reprodujo el problema antes del arreglo y pasó después a tres anchos. Las tablas conservan los nombres accesibles y permiten desplazamiento interno. El usuario recargó Fusion en la notebook y confirmó: «Sí, ahora se lee bien».

Las pruebas locales usan datos de prueba. La evidencia de la interfaz real procede de los comentarios del usuario, que ahora confirma que la navegación con teclado funciona. Sigue pendiente la comprobación detallada de foco y contraste; otros tamaños no se han comprobado en Fusion.

## 7. Revisar código y diseño

**Revisión técnica actualizada; diseño en curso.** La [ronda técnica 4](code-review/feedback-round-4/code-review-report.md) registra cero Must Fix, dos Should Fix y cuatro Nice Fix para la instantánea actual. Es una revisión local, no una aprobación de Cognite.

Esta auditoría encontró después un defecto en la clasificación del visor: `application/pdf; charset=binary` podía entrar al renderizador de imágenes. Se agregó primero una prueba de regresión que falló; luego se corrigió la normalización de MIME en `InvestigationView.tsx` y se actualizó FR-010a en `SPEC.md`.

Tras corregir la tabla se descargaron otra vez los criterios oficiales, se revisaron los módulos y se actualizaron el inventario, las búsquedas, los paquetes y el informe técnico. Las rondas anteriores se conservan como historial. El [informe de diseño](design-review/feedback-round-1/design-review-report.md) registra el recorrido y las respuestas; su estado y notas confirmadas se conservan en [review-state.json](design-review/feedback-round-1/review-state.json). Falta identificar el commit de entrega.

## Comprobaciones actuales

Después de las correcciones del visor y las tablas:

| Comprobación | Resultado |
| --- | --- |
| `npm.cmd test -- --coverage --reporter=dot` | 31 pruebas aprobadas, 9 archivos; ninguna fallida ni omitida. |
| Cobertura V8 | 82,81 % de sentencias; 71,31 % de ramas; 82,87 % de funciones; 85,71 % de líneas. |
| `npm.cmd run lint` | Aprobado. |
| `npm.cmd run build` | TypeScript y compilación de producción aprobados. |

Los avisos del entorno de pruebas sobre iframes sin carga de red y dimensiones de Recharts no son comprobaciones de un navegador real. El build mantiene avisos de tamaño de chunk y anotaciones de Zod; finaliza correctamente.

La instantánea actual de producción `src/**/*.ts(x)`, excluyendo pruebas y `__mocks__`, tiene SHA-256 `9b59bf7ac114c43bbfde50cfd1ee3cdd09be8aff09e7b2091748bd0624747e83`. Parte de HEAD `63fb85b6b3abc4af839062731e51ab5d4484e172` y contiene la corrección local de tablas y pruebas aún sin commit. El hash identifica el resultado revisado; HEAD por sí solo no incluye ese arreglo.

## Pruebas manuales pendientes, paso a paso

Las instrucciones completas están en [CERTIFICATION-CHECKLIST.md](../CERTIFICATION-CHECKLIST.md). Mantener el servidor local encendido y la sesión de Fusion iniciada.

| Prueba | Acción | Resultado necesario para marcarla |
| --- | --- | --- |
| Documento real | Obtener del instructor un activo y un PDF o imagen cargado relacionados mediante `CogniteFile.assets`; buscar el activo y abrir el archivo desde Documents. | El archivo esperado aparece y su contenido se ve; al cerrar se conserva el equipo. |
| Detalle de actividad | Abrir `23-PC-9109-M01`, pulsar una actividad y cerrar su ventana. | Los detalles corresponden a la fila elegida y se vuelve al mismo equipo. |
| Enlace compartido | Seleccionar un sensor y `7d`; copiar la URL completa de Fusion, abrirla en otra pestaña y recargarla. | Se conservan el mismo equipo, sensor y rango. |
| Historial | Volver con All investigations, reabrir el equipo desde Recently investigated; regresar al inicio y recargar. | El equipo sigue disponible en el historial y se puede abrir. |

Ninguna de estas cuatro casillas se marcó como realizada. Esta sesión no tiene un navegador conectado para ejecutar las comprobaciones en Fusion; la evidencia real disponible proviene de las confirmaciones del usuario.

## Entrega y certificación

Todavía faltan repositorio remoto, despliegue, demo y presentación formal. El éxito de las pruebas locales no completa esos pasos ni acredita una certificación.
