# Estado del ejercicio de certificación

Actualizado: 2026-10-20. Este archivo no es una aprobación de Cognite.

## Revisión de los pasos de la guía

| Paso | Estado comprobado | Qué falta |
| --- | --- | --- |
| 1. Preparar el proyecto | Scaffold, entorno y configuración de Cognite Docs presentes. La app abrió en Fusion según la confirmación del usuario. | Sin pendiente de preparación identificado. |
| 2. App Brief | Caso y datos confirmados en App-Brief.md; las metas están identificadas como objetivos sin medir. | Sin pendiente del brief identificado. |
| 3. Especificación | SPEC.md contiene escenarios, requisitos, vistas CDM y relaciones verificadas con documentación oficial. | Sin pendiente documental identificado. |
| 4. Plan | PLAN.md cubre contratos, datos, estado, UI, pruebas y aceptación real. | El archivo permite revisar el plan; no prueba por sí solo qué modo del agente se usó al crearlo. |
| 5. Implementar y conectar datos | Búsqueda, activos, gráficos y actividades confirmados; último ejemplo: 43 series y 368 actividades. | Documento real, detalle de actividad, enlace compartido e historial en Fusion. |
| 6. Pulir con Aura | Componentes, controles y estados implementados; tabla corregida y confirmada en la notebook; contraste de texto secundario reforzado. | Validar foco, contraste corregido y otros tamaños en pantalla; el usuario confirma que el teclado funciona. |
| 7. Revisar código y diseño | Revisión técnica local actualizada en feedback-round-5: cero Must Fix, dos Should Fix y cuatro Nice Fix. Diseño round 1 completado: 10 notas confirmadas, promedio 3,7/5; no alcanza 3,8. | Resolver documentos y validación visual de accesibilidad; ejecutar una nueva ronda de diseño antes de presentar. |

La [revisión detallada](reviews/step-by-step-review.md) registra evidencias y límites. Las casillas de implementación no sustituyen las pruebas manuales pendientes.

La ejecución actual está en el [informe técnico round 5](reviews/code-review/feedback-round-5/code-review-report.md) y en el [informe de diseño round 1, completado con 3,7/5](reviews/design-review/feedback-round-1/design-review-report.md). La suite pasó 31 pruebas, con 85,71% de cobertura de líneas; lint y compilación pasan. La corrección de tablas y sus pruebas están incluidas en esta revisión.

## Completado

- [x] Scaffold oficial, org publicdata, proyecto publicdatacdm, Spec Kit desactivado.
- [x] Habilidades de Cognite instaladas y criterios actuales de revisión descargados.
- [x] Cognite Docs MCP consultado para comprobar vistas y relaciones.
- [x] App-Brief confirmado con el usuario; SPEC.md y PLAN.md completos.
- [x] Búsqueda, identidad, historial de 10 activos y estado compartible mediante el host.
- [x] Lectura paginada de series, actividades y archivos por relaciones CDM.
- [x] Selección explícita de sensores, gráficos históricos y actualización manual.
- [x] Aura, estados independientes y recuperación de errores.
- [x] Pruebas automáticas, cobertura, compilación y lint.
- [x] Revisión técnica local actualizada después de corregir el visor PDF, con cero Must Fix abiertos.
- [x] Validación humana de activos y gráficos reales; último equipo con 43 series y 368 actividades.
- [x] Corrección de columnas superpuestas en la notebook, reproducida en navegador y confirmada por el usuario.
- [x] El usuario informa que la navegación con teclado funciona; foco y contraste detallados siguen pendientes.

- [x] Diez notas de diseño confirmadas y reporte final generado: 3,7/5, por debajo del objetivo.
- [x] Video grabado según el usuario; archivo/URL y contenido aún sin inspeccionar.
- [x] Contraste de texto secundario claro reforzado con tokens Aura; seis pares CSS pasan la regresión.

## Pendiente antes de presentar

- [ ] Validar un documento real relacionado con un activo: los registros de archivos son accesibles, pero no se encontró un ejemplo vinculado dentro de la muestra consultada.
- [ ] Abrir el detalle de una actividad real y regresar al equipo.
- [ ] Abrir un enlace compartido en otra pestaña y comprobar que conserva el equipo, el sensor seleccionado y el rango de tiempo.
- [ ] Comprobar que el historial permite reabrir un equipo y se conserva después de recargar el inicio.
- [ ] Resolver los hallazgos de diseño y repetir la evaluación: la ronda 1 finalizó con 3,7/5, Q8=2 y Q10=3.
- [ ] Publicar el repositorio en el destino elegido por el usuario y registrar su URL.
- [ ] Desplegar en Cognite con permisos apropiados y registrar la URL de despliegue.
- [ ] Registrar el archivo o URL del video y comprobar el contenido exigido por la guía. El usuario ya informó que lo grabó.
- [ ] Presentar la solicitud por el proceso interno correspondiente y atender la revisión.

## Cómo validar estos puntos

Mantener el servidor local de desarrollo encendido y abrir la aplicación dentro de Fusion, con la sesión habitual. Las casillas se marcan después de observar el resultado en vivo; las pruebas automatizadas no reemplazan esta comprobación.

### Documento real relacionado con un activo

La sesión anterior confirmó que hay registros de documentos accesibles, pero la búsqueda limitada no encontró equipos relacionados entre los archivos revisados. Esto no demuestra que no existan relaciones en todo el proyecto.

1. Pedir al instructor o administrador un ejemplo conocido: el `space` y `externalId` del activo y del archivo. El archivo debe estar relacionado con el activo mediante `cdf_cdm.CogniteFile:v1.assets`, tener contenido cargado (`isUploaded = true`) y ser accesible para el usuario.
2. Buscar ese activo en Asset 360 y abrirlo. Si no aparece al buscar el ID completo, probar el tag o nombre que indique el instructor.
3. En **Documents**, comprobar que aparece el archivo esperado y pulsar su nombre.
4. Si es PDF, PNG, JPEG, GIF o WEBP, comprobar que el contenido se ve dentro de la ventana. Para otro formato, comprobar **Open / download**; para completar además la prueba de vista previa, usar un PDF o imagen.
5. Cerrar la ventana y comprobar que se sigue en el mismo equipo.

Si el archivo no aparece, revisar con el instructor la relación exacta y los espacios de ambos objetos. Si aparece **Content not uploaded**, falta cargar el contenido. Si aparece **No access** o un error al abrirlo, copiar el mensaje para revisar acceso o descarga. Que Documents muestre cero archivos no valida esta prueba de apertura.

Texto listo para pedir el ejemplo (no se envió):

> Estoy validando Asset 360 en publicdata / publicdatacdm. Ya veo activos, sensores, gráficos y actividades. Necesito el space y externalId de un activo y de un PDF o imagen cargado relacionado mediante CogniteFile.assets, accesibles con mi usuario, para probar la apertura desde Documents. ¿Me pasás un ejemplo conocido?

### Detalle de una actividad

1. Buscar `23-PC-9109-M01` y abrir el equipo cuyo externalId es `WMT:23-PC-9109-M01`, en `valhall-assets`.
2. En **Work orders & activities**, pulsar el nombre de una actividad; por ejemplo, la fila cuyo identificador sea `FAO-141088`, si sigue disponible.
3. Comprobar que se abre una ventana con los detalles y que corresponden a la actividad elegida. **Not available** en el estado es esperable: el modelo básico no proporciona ese campo.
4. Cerrar la ventana. Debe quedar abierto el mismo equipo, con los demás paneles disponibles.

### Enlace compartido

1. En ese equipo, seleccionar un sensor y elegir **7d**.
2. Esperar a que aparezca el gráfico y copiar la URL completa de la barra del navegador de **Fusion**.
3. Pegar la URL en otra pestaña del mismo navegador, con la sesión iniciada y el servidor local todavía encendido.
4. Comprobar que se abre el mismo equipo, que el mismo sensor sigue marcado y que **7d** sigue seleccionado. También comprobarlo con una recarga de esa pestaña.

Si abre el inicio o pierde la selección, dejar la casilla pendiente y registrar qué parte del estado no se restauró.

### Historial

1. Abrir un equipo y pulsar **All investigations**.
2. Comprobar que aparece en **Recently investigated** y que al pulsarlo se vuelve al mismo equipo.
3. Volver otra vez al inicio y recargar la página. El equipo debe seguir en el historial.
4. No pulsar **Clear history** durante esta prueba. Usar la misma sesión y perfil de navegador, con almacenamiento local habilitado.

### Registro de resultados

| Prueba | Fecha | Activo / archivo / actividad usados | Resultado observado |
| --- | --- | --- | --- |
| Documento real | Pendiente | Pendiente | Pendiente |
| Detalle de actividad | Pendiente | Pendiente | Pendiente |
| Enlace compartido | Pendiente | Pendiente | Pendiente |
| Historial tras recarga | Pendiente | Pendiente | Pendiente |

## Límites de la verificación

La sesión del agente no tenía navegador conectado para inspeccionar capturas o DOM de Fusion. La verificación en vivo de esta sesión se basa en las confirmaciones y el contenido que el usuario copió desde su navegador. Las pruebas de previsualización verifican el contrato y el destino del visor con fixtures; no prueban un PDF real de CDF. No se ha realizado una presentación ni se ha otorgado una certificación.
