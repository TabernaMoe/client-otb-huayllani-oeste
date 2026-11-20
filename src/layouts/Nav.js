import {
  AdjustmentsHorizontalIcon,
  ArchiveBoxIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  BeakerIcon,
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
  DocumentTextIcon,
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
  UserCircleIcon,
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
    id: 'socios',
    title: 'Socios',
    icon: UserGroupIcon,
    items: [
      {
        label: 'Administrar socios',
        to: '/admin/socios',
        icon: IdentificationIcon,
        permission: PERMS.SOCIOS,
      },
    ],
  },
  {
    id: 'acciones-agua',
    title: 'Acciones de agua',
    icon: BeakerIcon,
    items: [
      {
        label: 'Acciones',
        to: '/admin/acciones',
        icon: ClipboardDocumentListIcon,
        permission: PERMS.ACCIONES,
      },
      {
        label: 'Detalle de acción',
        to: '/admin/detalle-pago-accion',
        icon: DocumentChartBarIcon,
        permission: PERMS.DETALLE_ACCION,
      },
      {
        label: 'Tipo Acción',
        to: '/admin/tipo-accion',
        icon: RectangleStackIcon,
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
    id: 'acciones-alcantarillado',
    title: 'Acciones de alcantarillado',
    icon: WrenchScrewdriverIcon,
    items: [
      {
        label: 'Acciones Alcantarillado',
        to: '/admin/alcantarillado/acciones',
        icon: CircleStackIcon,
        permission: PERMS.ACCIONES,
      },
      {
        label: 'Alcantarillado',
        to: '/admin/alcantarillado',
        icon: WrenchIcon,
        permission: PERMS.ACCIONES,
      },
    ],
  },
  {
    id: 'cobros',
    title: 'Cobros y pagos',
    icon: BanknotesIcon,
    items: [
      {
        label: 'Cobros Generales',
        to: '/admin/cobros',
        icon: CreditCardIcon,
        permission: PERMS.COBROS,
      },
      {
        label: 'Recibo universal',
        to: '/admin/recibo-universal',
        icon: ReceiptPercentIcon,
        permission: PERMS.COBROS,
      },
      {
        label: 'Cobro universal',
        to: '/admin/cobro-universal-dos',
        icon: CurrencyDollarIcon,
        permission: PERMS.COBROS,
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
    id: 'reportes',
    title: 'Reportes',
    icon: ChartBarIcon,
    items: [
      {
        label: 'Gestión de recibos',
        to: '/admin/reportes-recibo',
        icon: DocumentTextIcon,
        permission: PERMS.REPORTES,
      },
      {
        label: 'Recibos por acción',
        to: '/admin/reportes-recibo-accion',
        icon: ClipboardDocumentCheckIcon,
        permission: PERMS.REPORTES,
      },
      {
        label: 'Recibos por socio',
        to: '/admin/reportes-recibo-socio',
        icon: UserCircleIcon,
        permission: PERMS.REPORTES,
      },
    ],
  },
  {
    id: 'operaciones',
    title: 'Administración',
    icon: Cog6ToothIcon,
    items: [
      {
        label: 'Gestiones',
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
    id: 'asambleas',
    title: 'Asambleas y Multas',
    icon: ScaleIcon,
    items: [
      {
        label: 'Asambleas',
        to: '/admin/asambleas',
        icon: ExclamationTriangleIcon,
        permission: PERMS.ASAMBLEAS,
      },
      {
        label: 'Otras multas',
        to: '/admin/multas',
        icon: ReceiptPercentIcon,
        permission: PERMS.MULTAS,
      },
      {
        label: 'Reportes generales',
        to: '/admin/reportes',
        icon: ChartBarSquareIcon,
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
        label: 'Gestión de egresos',
        to: '/admin/egresos',
        icon: WalletIcon,
        permission: PERMS.EGRESOS,
      },
    ],
  },
  {
    id: 'funciones_extras',
    title: 'Funciones',
    icon: Squares2X2Icon,
    items: [
      {
        label: 'Inventario',
        to: '/admin/inventario',
        icon: ArchiveBoxIcon,
        permission: PERMS.INVENTARIO,
      },
    ],
  },
];