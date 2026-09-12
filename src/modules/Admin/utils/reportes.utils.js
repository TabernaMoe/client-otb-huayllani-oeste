export const money = (value) => `Bs ${Number(value).toFixed(2)}`;

export const date = (value) =>
  new Date(value).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
