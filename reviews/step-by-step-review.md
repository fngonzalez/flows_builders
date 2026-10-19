# Revisión por pasos — Asset 360

Fecha: 2026-10-19.

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

Faltan las cuatro comprobaciones manuales descritas más abajo.

## 6. Pulir la interfaz con Aura

**Implementado; revisión visual pendiente.** Hay componentes Aura para búsqueda, controles, tablas, mensajes y ventanas. Los paneles tienen estados independientes de carga, vacío, error, reintento y falta de acceso.

Las pruebas locales comprueban comportamiento con datos de prueba. Falta observar la interfaz real, recorrerla con teclado y revisar foco, legibilidad, tamaño de pantalla y claridad de los mensajes. No se asignó una puntuación de diseño sin esa evaluación.

## 7. Revisar código y diseño

**Revisión técnica actualizada; diseño pendiente.** La [segunda ronda técnica](code-review/feedback-round-2/code-review-report.md) registra cero Must Fix, dos Should Fix y cuatro Nice Fix para la instantánea actual. Es una revisión local, no una aprobación de Cognite.

Esta auditoría encontró después un defecto en la clasificación del visor: `application/pdf; charset=binary` podía entrar al renderizador de imágenes. Se agregó primero una prueba de regresión que falló; luego se corrigió la normalización de MIME en `InvestigationView.tsx` y se actualizó FR-010a en `SPEC.md`.

Se descargaron otra vez los criterios oficiales, se recorrieron todos los módulos de producción y se actualizaron el inventario, las búsquedas, el análisis de paquetes y el informe técnico. La primera ronda se conserva como historial. Falta completar la revisión de diseño con sus diez preguntas e identificar el commit de entrega. No existe un informe final de diseño ni una puntuación confirmada.

## Comprobaciones actuales

Después de la corrección del visor:

| Comprobación | Resultado |
| --- | --- |
| `npm.cmd test -- --coverage --reporter=dot` | 31 pruebas aprobadas, 9 archivos; ninguna fallida ni omitida. |
| Cobertura V8 | 82,81 % de sentencias; 71,31 % de ramas; 82,87 % de funciones; 85,71 % de líneas. |
| `npm.cmd run lint` | Aprobado. |
| `npm.cmd run build` | TypeScript y compilación de producción aprobados. |

Los avisos del entorno de pruebas sobre iframes sin carga de red y dimensiones de Recharts no son comprobaciones de un navegador real. El build mantiene avisos de tamaño de chunk y anotaciones de Zod; finaliza correctamente.

La instantánea actual de los archivos de producción `src/**/*.ts(x)`, excluyendo pruebas y `__mocks__`, tiene SHA-256 `b749062abdbaad3aa9a3081657ea6c228930bb8888cdd3713b3fe21683bb761c`. La implementación sigue sin commit y sin remoto configurado; el hash identifica esta auditoría, no un commit de entrega.

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
