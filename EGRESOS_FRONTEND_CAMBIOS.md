# Módulo de Egresos - Frontend

## Integración con backend existente

Endpoints utilizados:
- GET /api/admin/egresos
- POST /api/admin/egresos
- GET /api/admin/egresos/categoria-gastos
- POST /api/admin/egresos/categoria-gastos

Campos de categoría:
- nombre_gasto
- descripcion

Campos de egreso:
- categoria_egreso_id
- fecha
- concepto
- monto
- beneficiario
- observaciones

## Interfaz

Se añadió al menú administrativo un grupo "Egresos" con acceso a `/admin/egresos`.

La pantalla contiene dos pestañas:
1. Tipos de egreso: creación y listado de categorías.
2. Registrar egreso: formulario de egreso e historial de egresos registrados.

Se respetó el estilo visual existente de la OTB: tarjetas blancas, bordes slate y acciones principales en emerald.

## Nota

No se agregó "método de pago" al formulario porque el schema actual del backend para egresos no contiene ese campo.
