import {
  BanknotesIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  HomeIcon,
  ReceiptPercentIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export const SocioNav = [
  { label: 'Inicio', to: '/socio/inicio', icon: HomeIcon },
  { label: 'Mis acciones', to: '/socio/acciones', icon: ClipboardDocumentListIcon },
  { label: 'Mis lecturas', to: '/socio/lecturas', icon: DocumentTextIcon },
  { label: 'Mis cobros', to: '/socio/cobros', icon: BanknotesIcon },
  { label: 'Mis recibos', to: '/socio/recibos', icon: ReceiptPercentIcon },
  { label: 'Mi perfil', to: '/socio/perfil', icon: UserIcon },
];
