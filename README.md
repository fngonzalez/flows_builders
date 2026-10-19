# Asset 360 - investigación de equipos

Aplicación de Cognite Flows construida para el ejercicio de certificación. Busca un activo y reúne sus sensores, actividades y documentos relacionados, con datos de CDF y acceso de solo lectura.

## Abrir la aplicación

Desde PowerShell, en esta carpeta:

```powershell
npm.cmd install
npm.cmd run dev
```

La plantilla abre Fusion. Si es necesario, usar:

[Abrir Asset 360 en Fusion](https://publicdata.fusion.cognite.com/publicdatacdm/custom-apps/development/asset-360/3001?cluster=api.cognitedata.com&workspace=flows)

El servidor HTTPS local debe seguir ejecutándose. Abrir solamente localhost no proporciona la autenticación del host de Cognite.

## Uso

1. Buscar por tag, nombre o descripción y seleccionar un resultado.
2. En **Time series**, marcar un sensor para ver su historial. Inicialmente no se grafica ninguno. La ventana termina en el último dato disponible, aunque sea antiguo. **Refresh** actualiza manualmente.
3. En **Work orders & activities**, elegir una actividad para abrir sus detalles. El modelo básico no tiene un campo de estado de orden; por eso aparece **Not available**.
4. En **Documents**, elegir un archivo. PDF e imágenes se abren dentro de la app; otros formatos ofrecen apertura/descarga externa.
5. **All investigations** vuelve al inicio y muestra los últimos 10 equipos visitados en este navegador.

Los botones **Find an asset with signals/documents** buscan ejemplos desde relaciones reales. Son búsquedas limitadas y no representan un inventario completo.

## Validación realizada

El 19 de octubre de 2026, el usuario confirmó en su sesión de Fusion:

- Búsqueda y apertura de activos reales de publicdatacdm.
- `WMT:23-PC-9109-M01`, espacio `valhall-assets`: 2 sensores y 16 actividades.
- Selección de un sensor y visualización de un gráfico con datos.
- Hay registros CogniteFile accesibles; la búsqueda limitada no encontró equipos relacionados con los archivos revisados.

**Pendiente:** abrir un archivo real relacionado con un activo. Se necesita un ejemplo verificable de `CogniteFile.assets` que apunte a un activo accesible y cuyo contenido esté cargado. No se puede concluir que no existan relaciones en todo el proyecto a partir de la muestra revisada.

Texto sugerido para pedir un ejemplo al instructor o administrador (no se envió):

> Estoy haciendo Asset 360 en publicdata / publicdatacdm. Ya validé activos, sensores, gráficos y actividades. ¿Podés indicarme el espacio y externalId de un activo con un archivo cargado relacionado mediante CogniteFile.assets, y confirmar que mi usuario puede leerlo?

## Archivos y controles

- [App-Brief.md](App-Brief.md): usuario, problema y alcance confirmados.
- [SPEC.md](SPEC.md): requisitos, aceptación y modelo verificado con Cognite Docs MCP.
- [PLAN.md](PLAN.md): plan de implementación.
- [CERTIFICATION-CHECKLIST.md](CERTIFICATION-CHECKLIST.md): estado real del ejercicio y lo que falta para presentar.

```powershell
npm.cmd test -- --coverage
npm.cmd run lint
npm.cmd run build
```

Las pruebas usan fixtures exclusivamente de prueba. La app no tiene un modo de datos simulados. Los SDK y el host proporcionan la sesión; no se necesitan tokens pegados en el código.
