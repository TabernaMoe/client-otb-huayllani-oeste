export const formatMoney = (value) => {
  const numeric = Number(value ?? 0);
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(Number.isFinite(numeric) ? numeric : 0);
};

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('es-BO') : '—';

export const getSocioDisplayName = (socio) => {
  if (!socio) return '';
  if (socio.nombre_completo) return String(socio.nombre_completo).trim();
  const fullName = [
    socio.nombres,
    socio.primer_apellido,
    socio.segundo_apellido,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
  return fullName || 'Sin nombre';
};

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
