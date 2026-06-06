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
} from '@heroicons/react/24/outline';

export const SidebarNav = [
  {
    id: 'cliente',
    title: 'Cliente',
    icon: HomeIcon,
    items: [
      {
        label: 'Gestión de socios',
        to: '/cliente/socios',
        icon: FolderIcon,
      },
      {
        label: 'Gestión acciones',
        to: '/cliente/gestion-acciones',
        icon: CurrencyDollarIcon,
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
];