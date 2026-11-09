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
  PresentationChartLineIcon,
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
        icon: Squares2X2Icon,
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
        icon: IdentificationIcon,
        permission: ['socio.ver', 'socios.ver', 'socios.socio.ver'],
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
        icon: RectangleStackIcon,
        permission: ['acciones.accion.ver', 'accion.ver', 'acciones.ver'],
      },
      {
        label: 'Cambio de nombre',
        to: '/admin/cambio-nombre',
        icon: PencilSquareIcon,
        permission: ['acciones.accion.ver', 'accion.ver', 'acciones.ver'],
      },
      // {
      //   label: 'Adelanto de pagos',
      //   to: '/admin/acciones/adelantos',
      //   icon: BanknotesIcon,
      //   permission: ['acciones.accion.ver', 'accion.ver', 'acciones.ver'],
      // },
      // {
      //   label: 'Cobros Generales',
      //   to: '/admin/cobros',
      //   icon: CreditCardIcon,
      //   permission: ['cobro.ver', 'cobros.ver', 'pago.ver', 'pagos.ver'],
      // },
      // {
      //   label: 'Cuenta por cobrar',
      //   to: '/admin/recibo-universal',
      //   icon: CreditCardIcon,
      //   permission: ['cobro.ver', 'cobros.ver', 'pago.ver', 'pagos.ver'],
      // },
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
        permission: ['acciones.accion.ver', 'accion.ver', 'acciones.ver'],
      },
      {
        label: 'Alcantarillado',
        to: '/admin/alcantarillado',
        icon: WrenchIcon,
        permission: ['acciones.accion.ver', 'accion.ver', 'acciones.ver'],
      },
      // {
      //   label: 'Cobros',
      //   to: '/admin/alcantarillado-cobros',
      //   icon: WrenchScrewdriverIcon,
      //   permission: ['acciones.accion.ver', 'accion.ver', 'acciones.ver'],
      // },
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
        permission: ['cobro.ver', 'cobros.ver', 'pago.ver', 'pagos.ver'],
      },
      // {
      //   label: 'Cobros universales',
      //   to: '/admin/cobros-universales',
      //   icon: BanknotesIcon,
      //   permission: ['cobro.ver', 'cobros.ver', 'pago.ver', 'pagos.ver'],
      // },

      {
        label: 'Recibo universal',
        to: '/admin/recibo-universal',
        icon: ReceiptPercentIcon,
        permission: ['cobro.ver', 'cobros.ver', 'pago.ver', 'pagos.ver'],
      },
      {
        label: 'Cobro universal',
        to: '/admin/cobro-universal-dos',
        icon: CurrencyDollarIcon,
        permission: ['cobro.ver', 'cobros.ver', 'pago.ver', 'pagos.ver'],
      },
      // {
      //   label: 'Cobros de agua',
      //   to: '/admin/cobros-agua',
      //   icon: ReceiptPercentIcon,
      //   permission: [
      //     'pago_agua.ver',
      //     'pago-agua.ver',
      //     'cobro_agua.ver',
      //     'cobros_agua.ver',
      //     'agua.cobro.ver',
      //   ],
      // },

      // {
      //   label: 'Lecturas',
      //   to: '/admin/lecturas',
      //   icon: DocumentTextIcon,
      //   permission: ['lectura.ver', 'lecturas.ver', 'agua.lectura.ver'],
      // },
      // {
      //   label: 'Mora',
      //   to: '/admin/lectura-mora',
      //   icon: DocumentTextIcon,
      //   permission: ['lectura.ver', 'lecturas.ver', 'agua.lectura.ver'],
      // },
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
        permission: ['lectura.ver', 'lecturas.ver', 'agua.lectura.ver'],
      },
      {
        label: 'Mora',
        to: '/admin/lectura-mora',
        icon: ExclamationTriangleIcon,
        permission: ['lectura.ver', 'lecturas.ver', 'agua.lectura.ver'],
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
        permission: ['usuario.ver', 'usuarios.ver', 'auth.usuario.ver'],
      },
      {
        label: 'Gestión de recibos por accion',
        to: '/admin/reportes-recibo-accion',
        icon: ClipboardDocumentCheckIcon,
        permission: ['usuario.ver', 'usuarios.ver', 'auth.usuario.ver'],
      },
      {
        label: 'Gestión de recibos por socio',
        to: '/admin/reportes-recibo-socio',
        icon: UserCircleIcon,
        permission: ['usuario.ver', 'usuarios.ver', 'auth.usuario.ver'],
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
        permission: ['gestion.ver', 'gestiones.ver'],
      },
      {
        label: 'Periodos',
        to: '/admin/periodos',
        icon: ClockIcon,
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
        icon: KeyIcon,
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
    title: 'Reportes y Multas',
    icon: ScaleIcon,
    items: [
      {
        label: 'Multas',
        to: '/admin/asambleas',
        icon: ExclamationTriangleIcon,
        permission: [
          'asamblea.ver',
          'asambleas.ver',
          'reunion.ver',
          'reuniones.ver',
        ],
      },
      {
        label: 'Otras multas',
        to: '/admin/multas',
        icon: ReceiptPercentIcon,
        permission: ['multa.ver', 'multas.ver', 'agua.multa.ver'],
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
    id: 'egresos',
    title: 'Egresos',
    icon: ArrowTrendingDownIcon,
    items: [
      {
        label: 'Gestión de egresos',
        to: '/admin/egresos',
        icon: WalletIcon,
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
        permission: ['inventario.ver'],
      },
    ],
  },
];
