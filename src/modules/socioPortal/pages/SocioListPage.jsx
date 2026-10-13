import { useEffect, useMemo, useState } from 'react';

export default function SocioListPage({
  title,
  description,
  loader,
  columns,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const response = await loader();

        const payload = response?.data ?? response ?? [];

        const data = Array.isArray(payload)
          ? payload
          : payload?.data ?? [];

        if (isMounted) {
          setRows(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              'No se pudo cargar la información'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [loader]);

  const safeRows = useMemo(
    () => (Array.isArray(rows) ? rows : []),
    [rows]
  );

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-5 py-3 text-left font-bold text-slate-600"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    Cargando...
                  </td>
                </tr>
              ) : safeRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No hay registros
                  </td>
                </tr>
              ) : (
                safeRows.map((row, index) => (
                  <tr
                    key={row.id ?? index}
                    className="transition hover:bg-slate-50"
                  >
                    {columns.map((column) => {
                      const value = row[column.key];

                      return (
                        <td
                          key={column.key}
                          className="px-5 py-4 text-slate-700"
                        >
                          {column.render
                            ? column.render(value, row)
                            : value ?? '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}