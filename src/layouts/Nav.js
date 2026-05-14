import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  BellIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  FolderIcon,
  UserGroupIcon,
  BeakerIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

export const SidebarNav = [
  {
    id: 'general',
    title: 'Admin',
    icon: HomeIcon,
    items: [
      {
        label: 'Gestion usuarios',
        to: '/login',
        icon: UsersIcon,
      },
      {
        label: 'Gestion de socios',
        to: '/cliente/socios',
        icon: FolderIcon,
      },
      {
        label: 'Gestion acciones',
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
      },
      {
        label: 'Reportes',
        to: '/admin/reportes',
        icon: ChartBarIcon,
      },
    ],
  },
];
