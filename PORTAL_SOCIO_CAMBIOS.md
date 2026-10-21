# Portal Socio - interfaz modular por acción

Cambios principales:

- `Mis acciones` continúa usando tarjetas y ahora muestra el tipo real de acción y sus detalles asociados.
- `Mis lecturas`:
  - Selector reutilizable de acción.
  - Carga `/socio/me/lecturas?accion_id=ID`.
  - Lecturas mostradas en tarjetas.
- `Mis cobros`:
  - Selector reutilizable de acción.
  - Carga `/socio/me/cobros?accion_id=ID`.
  - Cobros mostrados en tarjetas y resumen de la acción.
- Componentes nuevos:
  - `components/AccionSelector.jsx`
  - `components/LecturaCard.jsx`
  - `components/CobroCard.jsx`
  - `components/PortalFeedback.jsx`
- Hook reutilizable:
  - `hooks/useSocioAcciones.js`
- El service acepta `accionId` opcional para lecturas y cobros.
