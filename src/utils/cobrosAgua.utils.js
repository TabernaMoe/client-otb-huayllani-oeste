export const formatMoney = (value) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(Number(value));

export const openPdf = (blob, filename = 'recibo-agua.pdf') => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.download = filename;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

const parseBlob = async (blob) => {
  const text = await blob.text();
  return text ? JSON.parse(text) : null;
};

const getFilename = (headers) => {
  const value = headers['content-disposition'] || '';
  const match = value.match(/filename="?([^";]+)"?/i);
  return match?.[1] || 'recibo-agua.pdf';
};

export async function normalizePaymentResponse(response) {
  const contentType = response.headers['content-type'] || '';

  if (contentType.includes('application/pdf')) {
    return {
      type: 'pdf',
      blob: response.data,
      filename: getFilename(response.headers),
    };
  }

  return {
    type: 'json',
    data: await parseBlob(response.data),
  };
}

export async function normalizeBlobError(error) {
  const data = error.response?.data;

  if (data instanceof Blob) {
    const payload = await parseBlob(data);
    return new Error(payload?.message || 'No se pudo registrar el pago');
  }

  return new Error(error.response?.data?.message || error.message);
}
