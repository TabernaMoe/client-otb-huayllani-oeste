import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

export default function DataTable({
  data = [],
  columns = [],
  loading = false,
  page = 1,
  limit = 5,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  onLimitChange,
}) {
  const pageSizeOptions = [5, 10, 15, 20];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="min-w-max w-full table-auto border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="divide-x divide-slate-200" key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => {
                  const isFirst = i === 0;
                  const isLast = i === headerGroup.headers.length - 1;

                  return (
                    <th
                      key={header.id}
                      className={[
                        'border-b px-4 py-3 text-left font-semibold whitespace-nowrap',

                        // primera columna
                        isFirst ? 'sticky left-0 z-20 bg-slate-50' : '',

                        // última columna
                        isLast ? 'sticky right-0 z-20 bg-slate-50' : '',
                      ].join(' ')}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-slate-600"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                    Cargando datos...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-slate-500"
                >
                  No hay registros
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="divide-x divide-slate-200 transition-colors hover:bg-slate-100/60"
                >
                  {row.getVisibleCells().map((cell, i) => {
                    const isFirst = i === 0;
                    const isLast = i === row.getVisibleCells().length - 1;

                    return (
                      <td
                        key={cell.id}
                        className={[
                          'px-4 py-3 whitespace-nowrap',

                          // primera columna
                          isFirst ? 'sticky left-0 z-10 bg-white' : '',

                          // última columna
                          isLast ? 'sticky right-0 z-10 bg-white' : '',
                        ].join(' ')}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <div>{totalItems} registros existentes</div>

          <span>Filas:</span>

          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1 || loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="text-sm font-medium text-slate-700">
            Página {page} de {totalPages}
          </span>

          <button
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= totalPages || loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
