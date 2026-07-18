/*import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  FolderIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
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
        label: 'Gestión de usuarios',
        to: '/admin/usuarios',
        icon: UsersIcon,
        permission: 'USUARIOS_READ',
      },
      {
        label: 'Roles y permisos',
        to: '/admin/roles',
        icon: UserGroupIcon,
        permission: 'ROLES_READ',
      },
      {
        label: 'Gestiones',
        to: '/admin/gestiones',
        icon: CalendarDaysIcon,
        permission: 'GESTIONES_READ',
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
        permission: 'CALLES_READ',
      },
      {
        label: 'Tarifas',
        to: '/admin/tarifas',
        icon: CurrencyDollarIcon,
        permission: 'TARIFAS_READ',
      },
      {
        label: 'Detalle pago acción',
        to: '/admin/detalle-pago-accion',
        icon: ClipboardDocumentListIcon,
        permission: 'DETALLE_ACCION_READ',
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
        permission: 'SOCIOS_READ',
      },
    ],
  },
];*/
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
    DocumentTextIcon, // <-- agregar

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