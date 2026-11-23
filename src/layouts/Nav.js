import {
  AdjustmentsHorizontalIcon,
  ArchiveBoxIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
  CircleStackIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  IdentificationIcon,
  KeyIcon,
  MapPinIcon,
  PencilSquareIcon,
  ReceiptPercentIcon,
  RectangleStackIcon,
  ScaleIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UsersIcon,
  WalletIcon,
  WrenchIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid';
import { PERMS } from '../routes/permissions';

export const AdminNav = [
  {
    id: 'principal',
    title: 'Panel principal',
    icon: HomeIcon,
    items: [
      { label: 'Dashboard', to: '/admin/dashboard', icon: Squares2X2Icon },
    ],
  },
  {
    id: 'administracion',
    title: 'Administración',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Gestión',
        to: '/admin/gestiones',
        icon: CalendarDaysIcon,
        permission: PERMS.GESTIONES,
      },
      {
        label: 'Periodos',
        to: '/admin/periodos',
        icon: ClockIcon,
        permission: PERMS.PERIODOS,
      },
      {
        label: 'Calles',
        to: '/admin/calles',
        icon: MapPinIcon,
        permission: PERMS.CALLES,
      },
      {
        label: 'Tarifas',
        to: '/admin/tarifas',
        icon: AdjustmentsHorizontalIcon,
        permission: PERMS.TARIFAS,
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
        permission: PERMS.USUARIOS,
      },
      {
        label: 'Roles y permisos',
        to: '/admin/roles',
        icon: KeyIcon,
        permission: PERMS.ROLES,
      },
    ],
  },
  {
    id: 'socios-acciones',
    title: 'Socios y Acciones',
    icon: UserGroupIcon,
    items: [
      {
        label: 'Gestión de socios',
        to: '/admin/socios',
        icon: IdentificationIcon,
        permission: PERMS.SOCIOS,
      },
      {
        label: 'Gestión de acciones',
        to: '/admin/acciones',
        icon: ClipboardDocumentListIcon,
        permission: PERMS.ACCIONES,
      },
      {
        label: 'Cambio de nombre',
        to: '/admin/cambio-nombre',
        icon: PencilSquareIcon,
        permission: PERMS.ACCIONES,
      },
    ],
  },
  {
    id: 'caja',
    title: 'Caja',
    icon: BanknotesIcon,
    items: [
      {
        label: 'Cobros generales',
        to: '/admin/cobros',
        icon: CreditCardIcon,
        permission: PERMS.COBROS,
      },
      {
        label: 'Cobro universal',
        to: '/admin/cobro-universal-dos',
        icon: CurrencyDollarIcon,
        permission: PERMS.COBROS,
      },
      {
        label: 'Recibo universal',
        to: '/admin/recibo-universal',
        icon: ReceiptPercentIcon,
        permission: PERMS.COBROS,
      },
    ],
  },
  {
    id: 'multas',
    title: 'Multas',
    icon: ExclamationTriangleIcon,
    items: [
      {
        label: 'Multas',
        to: '/admin/multas',
        icon: ReceiptPercentIcon,
        permission: PERMS.MULTAS,
      },
    ],
  },
  {
    id: 'lecturas-agua',
    title: 'Lecturas',
    icon: DocumentMagnifyingGlassIcon,
    items: [
      {
        label: 'Lecturas',
        to: '/admin/lecturas',
        icon: ClipboardDocumentListIcon,
        permission: PERMS.LECTURAS,
      },
      {
        label: 'Mora',
        to: '/admin/lectura-mora',
        icon: ExclamationTriangleIcon,
        permission: PERMS.LECTURAS,
      },
    ],
  },
  {
    id: 'asambleas',
    title: 'Asambleas',
    icon: ScaleIcon,
    items: [
      {
        label: 'Asambleas',
        to: '/admin/asambleas',
        icon: CalendarDaysIcon,
        permission: PERMS.ASAMBLEAS,
      },
    ],
  },
  {
    id: 'reportes',
    title: 'Reportes',
    icon: ChartBarIcon,
    items: [
      {
        label: 'Reportes generales',
        to: '/admin/reportes',
        icon: ChartBarSquareIcon,
        permission: PERMS.REPORTES,
      },
      {
        label: 'Recibos por acción',
        to: '/admin/reportes-recibo-accion',
        icon: ClipboardDocumentCheckIcon,
        permission: PERMS.REPORTES,
      },
    ],
  },
  {
    id: 'egresos',
    title: 'Egresos',
    icon: ArrowTrendingDownIcon,
    items: [
      {
        label: 'Egresos',
        to: '/admin/egresos',
        icon: WalletIcon,
        permission: PERMS.EGRESOS,
      },
    ],
  },
  {
    id: 'inventario',
    title: 'Inventario',
    icon: ArchiveBoxIcon,
    items: [
      {
        label: 'Inventario',
        to: '/admin/inventario',
        icon: ArchiveBoxIcon,
        permission: PERMS.INVENTARIO,
      },
    ],
  },
  {
    id: 'administracion-acciones',
    title: 'Administración de Acciones',
    icon: RectangleStackIcon,
    items: [
      {
        label: 'Tipo de acción',
        to: '/admin/tipo-accion',
        icon: RectangleStackIcon,
        permission: PERMS.ACCIONES,
      },
      {
        label: 'Detalle de acción',
        to: '/admin/detalle-pago-accion',
        icon: DocumentChartBarIcon,
        permission: PERMS.DETALLE_ACCION,
      },
    ],
  },
  {
    id: 'acciones-alcantarillado',
    title: 'Acciones de Alcantarillado',
    icon: WrenchScrewdriverIcon,
    items: [
      {
        label: 'Acción de alcantarillado',
        to: '/admin/alcantarillado/acciones',
        icon: CircleStackIcon,
        permission: PERMS.ACCIONES,
      },
      {
        label: 'Alcantarillado detalle',
        to: '/admin/alcantarillado',
        icon: WrenchIcon,
        permission: PERMS.ACCIONES,
      },
    ],
  },
];
