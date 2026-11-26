import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTableLocal from '../../../components/DataTableLocal';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import StatusBadge from '../../../components/StatusBadge';
import LecturaModal from '../components/LecturaModal';
import { LecturasServices } from '../services/lecturas.services';

export default function LecturasPage() {
  const [acciones, setAcciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ open: false, accion: null });

  const loadLecturas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await LecturasServices.getAll();
      if (!response.ok) {
        toast.error(response.message || 'No se pudieron cargar las lecturas');
        return;
      }
      setAcciones(Array.isArray(response.data) ? response.data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLecturas();
  }, [loadLecturas]);

  const filtradas = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return acciones;
    return acciones.filter((row) =>
      [
        row.codigo_interno,
        row.nombre_completo,
        row.nro_medidor,
        row.nombre_calle,
        row.nombre_tarifa,
      ]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(term)),
    );
  }, [acciones, search]);

  const columns = useMemo(
    () => [
      {
        header: 'Acción',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-900">
              #{row.original.codigo_interno}
            </p>
            <StatusBadge value={row.original.estado} />
          </div>
        ),
      },
      {
        accessorKey: 'nombre_completo',
        header: 'Socio',
      },
      {
        accessorKey: 'nro_medidor',
        header: 'Medidor',
        cell: ({ getValue }) => getValue() || 'S/N',
      },
      {
        accessorKey: 'nombre_calle',
        header: 'Calle',
      },
      {
        accessorKey: 'nombre_tarifa',
        header: 'Tarifa',
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        header: 'Última lectura',
        cell: ({ row }) => {
          const lectura = row.original.lecturas?.[0];
          if (!lectura) return 'Pendiente';
          return (
            <div>
              <p className="font-semibold text-slate-800">
                {lectura.lectura_actual} m³
              </p>
              <p className="text-xs text-slate-500">{lectura.periodo}</p>
            </div>
          );
        },
      },
      {
        header: 'Consumo / Precio',
        cell: ({ row }) => {
          const lectura = row.original.lecturas?.[0];
          if (!lectura) return '-';
          return (
            <div>
              <p className="font-medium text-slate-800">
                {lectura.consumo_m3} m³
              </p>
              <p className="text-xs text-emerald-700">
                Bs {Number(lectura.precio || 0).toFixed(2)}
              </p>
            </div>
          );
        },
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => setModal({ open: true, accion: row.original })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
          >
            <PlusIcon className="h-4 w-4 shrink-0" />
            Registrar lectura
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Lecturas de agua"
        description="Consulta la última lectura de cada acción y registra la lectura del periodo activo."
        action={
          <button
            type="button"
            onClick={loadLecturas}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowPathIcon
              className={`h-4 w-4 shrink-0 ${loading ? 'animate-spin' : ''}`}
            />
            Actualizar
          </button>
        }
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Buscar socio, medidor, calle o acción..."
      />

      <DataTableLocal
        data={filtradas}
        columns={columns}
        loading={loading}
      />

      <LecturaModal
        open={modal.open}
        accion={modal.accion}
        onClose={() => setModal({ open: false, accion: null })}
        onSaved={loadLecturas}
      />
    </section>
  );
}
