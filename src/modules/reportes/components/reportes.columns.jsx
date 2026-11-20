const formatFecha = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('es-BO');
};

const formatBs = (value) => `Bs ${Number(value || 0).toFixed(2)}`;

export const cobrosColumns = [
  {
    accessorKey: 'codigo_interno',
    header: 'Acción',
    cell: ({ getValue, row }) => (
      <div>
        <p className="font-semibold text-slate-800">#{getValue() ?? '—'}</p>
        <p className="text-xs text-slate-500">{row.original.tipo_servicio || '—'}</p>
      </div>
    ),
  },
  {
    accessorKey: 'nombre_socio',
    header: 'Socio',
    cell: ({ getValue, row }) => (
      <div>
        <p className="font-medium text-slate-800">{getValue() || '—'}</p>
        <p className="text-xs text-slate-500">CI: {row.original.ci_socio || '—'}</p>
      </div>
    ),
  },
  { accessorKey: 'nombre_calle', header: 'Calle' },
  {
    accessorKey: 'concepto',
    header: 'Concepto',
    cell: ({ getValue, row }) => (
      <div className="max-w-xs truncate">
        <p className="font-medium text-slate-800">{getValue()}</p>
        <p className="truncate text-xs text-slate-500">{row.original.descripcion}</p>
      </div>
    ),
  },
  {
    accessorKey: 'fecha_emision',
    header: 'Emisión',
    cell: ({ getValue }) => formatFecha(getValue()),
  },
  {
    accessorKey: 'monto_pagar',
    header: 'Monto',
    cell: ({ getValue }) => (
      <span className="font-semibold text-blue-800">{formatBs(getValue())}</span>
    ),
  },
];

export const recibosColumns = [
  {
    accessorKey: 'numero_recibo',
    header: 'N° Recibo',
    cell: ({ getValue }) => (
      <span className="font-bold text-slate-900">#{getValue() ?? '—'}</span>
    ),
  },
  {
    accessorKey: 'nombre_socio',
    header: 'Socio',
    cell: ({ getValue, row }) => (
      <div>
        <p className="font-medium text-slate-800">{getValue() || '—'}</p>
        <p className="text-xs text-slate-500">CI: {row.original.ci_socio || '—'}</p>
      </div>
    ),
  },
  {
    accessorKey: 'codigo_interno',
    header: 'Acción',
    cell: ({ getValue, row }) => `#${getValue() ?? '—'} (${row.original.tipo_servicio || '—'})`,
  },
  { accessorKey: 'concepto', header: 'Concepto' },
  {
    accessorKey: 'metodo_pago',
    header: 'Método',
    cell: ({ getValue }) => (
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
        {getValue() || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'fecha_emision',
    header: 'Fecha',
    cell: ({ getValue }) => formatFecha(getValue()),
  },
  {
    accessorKey: 'monto_pagado',
    header: 'Pagado',
    cell: ({ getValue }) => (
      <span className="font-semibold text-emerald-700">{formatBs(getValue())}</span>
    ),
  },
];