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
        to: '/cliente/login',
        icon: UsersIcon,
      },
      {
        label: 'Gestion de socios',
        to: '/cliente/socios',
        icon: FolderIcon,
      },
     {
        label: 'Pagos',
        to: '/cliente/pagos',
        icon: CurrencyDollarIcon,
      },
    ],
  },
];
