/*
import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  FolderIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  DocumentTextIcon, 

} from '@heroicons/react/24/outline';

export const SidebarNav = [
  {
    id: 'cliente',
    title: 'Usuario',
    icon: HomeIcon,
    items: [
      {
        label: 'Inicio',
        to: '/cliente/dashboard',
        icon: HomeIcon,
      },
      {
        label: 'Mi información',
        to: '/cliente/perfil',
        icon: UsersIcon,
      },
    ],
  },
];

export const AdminNav = [
  {
    id: 'admin',
    title: 'Administración',
    icon: HomeIcon,
    items: [
      {
        label: 'Dashboard',
        to: '/admin/dashboard',
        icon: HomeIcon,
      },
      {
        label: 'Gestión de usuarios',
        to: '/admin/usuarios',
        icon: UsersIcon,
        permission: ['usuario.ver', 'usuarios.ver', 'auth.usuario.ver'],
      },
      {
        label: 'Roles y permisos',
        to: '/admin/roles',
        icon: UserGroupIcon,
        permission: ['rol.ver', 'roles.ver', 'auth.rol.ver'],
      },
      {
        label: 'Gestiones',
        to: '/admin/gestiones',
        icon: CalendarDaysIcon,
        permission: ['gestion.ver', 'gestiones.ver'],
      },
      {
        label: 'Periodos',
        to: '/admin/periodos',
        icon: CalendarDaysIcon,
        permission: ['periodo.ver', 'periodos.ver', 'gestion.ver'],
      },
      {
        label: 'Acciones',
        to: '/admin/acciones',
        icon: ClipboardDocumentListIcon,
        permission: ['acciones.accion.ver', 'accion.ver', 'acciones.ver'],
      },
      {
  label: 'Lecturas',
  to: '/admin/lecturas',
  icon: DocumentTextIcon,
  permission: ['lectura.ver', 'lecturas.ver', 'agua.lectura.ver'],
},
    ],
  },
  {
    id: 'configuracion',
    title: 'Configuración',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Calles',
        to: '/admin/calles',
        icon: BuildingOffice2Icon,
        permission: ['calle.ver', 'calles.ver', 'acciones.calles.ver'],
      },
      {
        label: 'Tarifas',
        to: '/admin/tarifas',
        icon: CurrencyDollarIcon,
        permission: ['tarifa.ver', 'tarifas.ver'],
      },
      {
        label: 'Detalle pago acción',
        to: '/admin/detalle-pago-accion',
        icon: ClipboardDocumentListIcon,
        permission: [
          'acciones.detalle.ver',
          'acciones.detalles.ver',
          'detalle_accion.ver',
          'detalle_pago_accion.ver',
        ],
      },
    ],
  },
  {
    id: 'socios',
    title: 'Socios',
    icon: FolderIcon,
    items: [
      {
        label: 'Socios',
        to: '/admin/socios',
        icon: UsersIcon,
        permission: ['socio.ver', 'socios.ver', 'socios.socio.ver'],
      },
      {
        label: 'Cobros de Accion',
        to: '/admin/cobros',
        icon: BanknotesIcon,
        permission: ['cobro.ver', 'cobros.ver', 'pago.ver', 'pagos.ver'],
      },
      {
  label: 'Cobros de agua',
  to: '/admin/cobros-agua',
  icon: CurrencyDollarIcon,
  permission: [
    'pago_agua.ver',
    'pago-agua.ver',
    'cobro_agua.ver',
    'cobros_agua.ver',
    'agua.cobro.ver',
  ],
},
    ],
  },
  {
    id: 'reportes',
    title: 'Reportes',
    icon: ClipboardDocumentListIcon,
    items: [
      {
        label: 'Reportes',
        to: '/admin/reportes',
        icon: ClipboardDocumentListIcon,
        permission: ['reporte.ver', 'reportes.ver'],
      },
    ],
  },
  {
  id: 'asambleas',
  title: 'Asambleas',
  icon: UserGroupIcon,
  items: [
    {
      label: 'Reuniones',
      to: '/admin/asambleas',
      icon: CalendarDaysIcon,
      permission: [
        'asamblea.ver',
        'asambleas.ver',
        'reunion.ver',
        'reuniones.ver',
      ],
    },
  ],
},
];

*/

import {
  AdjustmentsHorizontalIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ChartBarSquareIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  DocumentTextIcon,
  HomeIcon,
  MapPinIcon,
  PresentationChartLineIcon,
  ReceiptPercentIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

/**
 * Navegación del portal del cliente.
 *
 * Cada grupo representa una sección principal del sidebar.
 * Los iconos fueron elegidos según el significado de cada opción
 * para mantener una experiencia visual consistente.
 */
export const SidebarNav = [
  {
    id: 'cliente',
    title: 'Portal del socio',
    icon: HomeIcon,
    items: [
      {
        label: 'Inicio',
        to: '/cliente/dashboard',
        icon: HomeIcon,
      },
      {
        label: 'Mi información',
        to: '/cliente/perfil',
        icon: UsersIcon,
      },
    ],
  },
];

/**
 * Navegación principal del panel administrativo.
 *
 * Orden recomendado:
 * 1. Resumen y operación diaria.
 * 2. Gestión comercial y cobros.
 * 3. Socios.
 * 4. Configuración.
 * 5. Asambleas.
 * 6. Reportes.
 */
export const AdminNav = [
  {
    id: 'principal',
    title: 'Panel principal',
    icon: HomeIcon,
    items: [
      {
        label: 'Dashboard',
        to: '/admin/dashboard',
        icon: PresentationChartLineIcon,
      },
    ],
  },

  {
    id: 'socios',
    title: 'Socios',
    icon: UserGroupIcon,
    items: [
      {
        label: 'Administrar socios',
        to: '/admin/socios',
        icon: UsersIcon,
        permission: ['socio.ver', 'socios.ver', 'socios.socio.ver'],
      },
      {
        label: 'Acciones',
        to: '/admin/acciones',
        icon: ClipboardDocumentListIcon,
        permission: ['acciones.accion.ver', 'accion.ver', 'acciones.ver'],
      },
      {
        label: 'Detalle de acción',
        to: '/admin/detalle-pago-accion',
        icon: DocumentChartBarIcon,
        permission: [
          'acciones.detalle.ver',
          'acciones.detalles.ver',
          'detalle_accion.ver',
          'detalle_pago_accion.ver',
        ],
      },
      //Añadido por Becas
      {
        label: 'Tipo Accion',
        to: '/admin/tipo-accion',
        icon: ClipboardDocumentListIcon,
        permission: ['acciones.accion.ver', 'accion.ver', 'acciones.ver'],
      },
    ],
  },

  {
    id: 'cobros',
    title: 'Cobros y pagos',
    icon: BanknotesIcon,
    items: [
      {
        label: 'Cobros de acción',
        to: '/admin/cobros',
        icon: CreditCardIcon,
        permission: ['cobro.ver', 'cobros.ver', 'pago.ver', 'pagos.ver'],
      },
      {
        label: 'Historial cobros',
        to: '/admin/historial-cobros',
        icon: CreditCardIcon,
        permission: ['cobro.ver', 'cobros.ver', 'pago.ver', 'pagos.ver'],
      },
      {
        label: 'Cobros de agua',
        to: '/admin/cobros-agua',
        icon: ReceiptPercentIcon,
        permission: [
          'pago_agua.ver',
          'pago-agua.ver',
          'cobro_agua.ver',
          'cobros_agua.ver',
          'agua.cobro.ver',
        ],
      },

      {
        label: 'Lecturas',
        to: '/admin/lecturas',
        icon: DocumentTextIcon,
        permission: ['lectura.ver', 'lecturas.ver', 'agua.lectura.ver'],
      },
    ],
  },
  {
    id: 'operaciones',
    title: 'Administración',
    icon: WrenchScrewdriverIcon,
    items: [
      {
        label: 'Gestiones',
        to: '/admin/gestiones',
        icon: CalendarDaysIcon,
        permission: ['gestion.ver', 'gestiones.ver'],
      },
      {
        label: 'Periodos',
        to: '/admin/periodos',
        icon: ClipboardDocumentCheckIcon,
        permission: ['periodo.ver', 'periodos.ver', 'gestion.ver'],
      },

      {
        label: 'Calles',
        to: '/admin/calles',
        icon: MapPinIcon,
        permission: ['calle.ver', 'calles.ver', 'acciones.calles.ver'],
      },
      {
        label: 'Tarifas',
        to: '/admin/tarifas',
        icon: AdjustmentsHorizontalIcon,
        permission: ['tarifa.ver', 'tarifas.ver'],
      },
    ],
  },

  {
    id: 'seguridad',
    title: 'Usuarios y Roles',
    icon: ShieldCheckIcon,
    items: [
      {
        label: 'Gestión de usuarios',
        to: '/admin/usuarios',
        icon: UsersIcon,
        permission: ['usuario.ver', 'usuarios.ver', 'auth.usuario.ver'],
      },
      {
        label: 'Roles y permisos',
        to: '/admin/roles',
        icon: ShieldCheckIcon,
        permission: ['rol.ver', 'roles.ver', 'auth.rol.ver'],
      },
    ],
  },

  {
    id: 'configuracion',
    title: 'Configuración',
    icon: Cog6ToothIcon,
    items: [],
  },

  {
    id: 'asambleas',
    title: 'Reportes y Asambleas',
    icon: UserGroupIcon,
    items: [
      {
        label: 'Reuniones',
        to: '/admin/asambleas',
        icon: CalendarDaysIcon,
        permission: [
          'asamblea.ver',
          'asambleas.ver',
          'reunion.ver',
          'reuniones.ver',
        ],
      },
      {
        label: 'Reportes generales',
        to: '/admin/reportes',
        icon: ChartBarSquareIcon,
        permission: ['reporte.ver', 'reportes.ver'],
      },
    ],
  },

  {
    id: 'funciones_extras',
    title: 'Funciones',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Inventario',
        to: '/admin/inventario',
        icon: ChartBarSquareIcon,
        permission: ['inventario.ver', 'inventario.ver'],
      },
    ],
  },
];
