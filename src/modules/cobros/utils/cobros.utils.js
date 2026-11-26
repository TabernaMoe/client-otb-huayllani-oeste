import {
  formatCurrency,
  formatDate as sharedFormatDate,
  formatFullName,
} from '../../../utils/formatters';

export const formatMoney = formatCurrency;
export const formatDate = sharedFormatDate;
export const getSocioDisplayName = (socio) => (socio ? formatFullName(socio) : '');

export const getSocioInitials = (nombreCompleto = '') => {
  const initials = String(nombreCompleto || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
  return initials || 'S';
};

export const getQrImageSrc = (qrImage = '') => {
  if (!qrImage) return '';
  return String(qrImage).startsWith('data:image')
    ? qrImage
    : `data:image/png;base64,${qrImage}`;
};
