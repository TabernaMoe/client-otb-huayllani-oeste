export function formatDate(dateString) {
  if (!dateString) return '—';
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return '—';

  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed);
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return '—';

  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

export function formatCurrency(value) {
  const numeric = Number(value ?? 0);
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(Number.isFinite(numeric) ? numeric : 0);
}

export function formatFullName(person) {
  if (!person) return 'Sin nombre';
  if (person.nombre_completo) return String(person.nombre_completo).trim();
  const full = [
    person.nombres ?? person.nombre,
    person.primer_apellido ?? person.apellido_paterno,
    person.segundo_apellido ?? person.apellido_materno,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
  return full || 'Sin nombre';
}