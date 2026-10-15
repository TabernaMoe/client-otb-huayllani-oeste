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
    <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="min-w-max w-full border-separate border-spacing-0 text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-slate-50"
              >
                {headerGroup.headers.map((header, index) => {
                  const isFirst = index === 0;
                  const isLast =
                    index === headerGroup.headers.length - 1;

                  return (
                    <th
                      key={header.id}
                      className={[
                        'border-b border-slate-200 px-5 py-4',
                        'text-left text-xs font-bold uppercase tracking-wide text-slate-500',
                        'whitespace-nowrap',

                        isFirst
                          ? 'sticky left-0 z-20 bg-slate-50'
                          : '',

                        isLast
                          ? 'sticky right-0 z-20 bg-slate-50'
                          : '',
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

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

                    <span className="text-sm font-medium">
                      Cargando datos...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                      📄
                    </div>

                    <p className="font-semibold text-slate-700">
                      No hay registros
                    </p>

                    <p className="text-sm text-slate-400">
                      No se encontraron datos para mostrar.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group transition-colors hover:bg-emerald-50/40"
                >
                  {row.getVisibleCells().map((cell, index) => {
                    const isFirst = index === 0;
                    const isLast =
                      index === row.getVisibleCells().length - 1;

                    return (
                      <td
                        key={cell.id}
                        className={[
                          'border-b border-slate-100 px-5 py-4',
                          'text-slate-700 whitespace-nowrap',

                          isFirst
                            ? 'sticky left-0 z-10 bg-white font-medium group-hover:bg-emerald-50/40'
                            : '',

                          isLast
                            ? 'sticky right-0 z-10 bg-white group-hover:bg-emerald-50/40'
                            : '',
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

      <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-medium text-slate-600">
            {totalItems} registros
          </span>

          <span className="hidden h-4 w-px bg-slate-300 sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-slate-500">
              Mostrar
            </span>

            <select
              value={limit}
              onChange={(e) =>
                onLimitChange?.(Number(e.target.value))
              }
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <span className="text-slate-500">
              filas
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1 || loading}
            className="
              rounded-xl border border-slate-300 bg-white
              px-4 py-2 text-sm font-semibold text-slate-700
              shadow-sm transition
              hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700
              disabled:cursor-not-allowed disabled:opacity-40
            "
          >
            Anterior
          </button>

          <div className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
            Página{' '}
            <span className="text-slate-900">
              {page}
            </span>{' '}
            de{' '}
            <span className="text-slate-900">
              {totalPages}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= totalPages || loading}
            className="
              rounded-xl border border-emerald-600 bg-emerald-600
              px-4 py-2 text-sm font-semibold text-white
              shadow-sm transition
              hover:bg-emerald-700
              disabled:cursor-not-allowed disabled:border-slate-300
              disabled:bg-slate-200 disabled:text-slate-400
            "
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}