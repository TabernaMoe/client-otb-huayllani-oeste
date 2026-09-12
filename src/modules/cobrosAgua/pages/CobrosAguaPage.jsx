import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/PageHeader';
import ConfirmModal from '../../../components/ConfirmModal';
import AccionesAguaList from '../components/AccionesAguaList';
import CobrosAguaDetalle from '../components/CobrosAguaDetalle';
import HistorialAguaModal from '../components/HistorialAguaModal';
import { CobrosAguaServices } from '../services/cobrosAgua.services';
import {
  validateAccionId,
  validateCobrosAguaParams,
  validatePagoAgua,
} from '../schema/cobrosAgua.schema';
import { formatMoney, openPdf } from '../../../utils/cobrosAgua.utils';

const LIMIT = 10;
const INITIAL_FORM = { metodo_pago: 'EFECTIVO', observacion: '' };

export default function CobrosAguaPage() {
  const [acciones, setAcciones] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [cobros, setCobros] = useState([]);
  const [selectedCobro, setSelectedCobro] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pago, setPago] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadAcciones = useCallback(async () => {
    const params = validateCobrosAguaParams({ page, limit: LIMIT, search: query });
    if (!params.success) return;

    try {
      setLoading(true);
      const response = await CobrosAguaServices.getAll(params.data);
      setAcciones(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    loadAcciones();
  }, [loadAcciones]);

  const selectAccion = async (accion) => {
    const id = validateAccionId(accion.accion_id);
    if (!id.success) return;

    try {
      setLoadingDetalle(true);
      const response = await CobrosAguaServices.getByAccionId(id.data);
      setDetalle(response.data);
      setCobros(response.data.cobrosAccionAgua);
      setSelectedCobro(null);
      setForm(INITIAL_FORM);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const handleChange = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
    setErrors((current) => ({ ...current, [target.name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validation = validatePagoAgua({
      cobro_agua_id: selectedCobro?.cobro_agua_id,
      monto: selectedCobro?.saldo,
      ...form,
    });

    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setPago(validation.data);
    setConfirmOpen(true);
  };

  const pagar = async () => {
    try {
      setSaving(true);
      const response = await CobrosAguaServices.pagar(detalle.accion_id, pago);

      if (response.type === 'pdf') openPdf(response.blob, response.filename);

      toast.success(response.data?.message || 'Pago de agua registrado correctamente');
      setConfirmOpen(false);
      setPago(null);
      await selectAccion(detalle);
      await loadAcciones();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const abrirHistorial = async () => {
    try {
      setShowHistorial(true);
      setLoadingHistorial(true);
      const response = await CobrosAguaServices.getHistorial(detalle.accion_id);
      setHistorial(response.data.historial);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingHistorial(false);
    }
  };

  return (
    <section className="space-y-5">
      <PageHeader
        title="Cobros de agua"
        description="Selecciona una acción, revisa sus deudas y registra el pago."
      />

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <AccionesAguaList
          acciones={acciones}
          selectedId={detalle?.accion_id}
          search={search}
          page={page}
          totalPages={totalPages}
          loading={loading}
          onSearch={setSearch}
          onSelect={selectAccion}
          onPageChange={setPage}
        />

        <CobrosAguaDetalle
          detalle={detalle}
          cobros={cobros}
          selectedCobro={selectedCobro}
          loading={loadingDetalle}
          form={form}
          errors={errors}
          saving={saving}
          onSelectCobro={setSelectedCobro}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onHistorial={abrirHistorial}
        />
      </div>

      <HistorialAguaModal
        open={showHistorial}
        historial={historial}
        loading={loadingHistorial}
        onClose={() => setShowHistorial(false)}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Confirmar pago de agua"
        message={`Se registrará un pago de ${formatMoney(pago?.monto || 0)}.`}
        confirmText="Confirmar pago"
        loading={saving}
        onConfirm={pagar}
        onClose={() => setConfirmOpen(false)}
      />
    </section>
  );
}
