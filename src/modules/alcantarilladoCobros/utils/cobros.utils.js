export const formatMoney = (value) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(Number(value));

export const formatDate = (value) => new Date(value).toLocaleDateString('es-BO');

export const getSocioInitials = (nombreCompleto) =>
  nombreCompleto
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

export const getQrImageSrc = (qrImage) =>
  qrImage.startsWith('data:image') ? qrImage : `data:image/png;base64,${qrImage}`;
