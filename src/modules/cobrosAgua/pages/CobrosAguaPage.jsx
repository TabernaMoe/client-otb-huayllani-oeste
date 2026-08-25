import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  BanknotesIcon,
  ClockIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { CobrosAguaServices } from '../services/cobrosAgua.services';
import { cobrosAguaParamsSchema } from '../schema/cobrosAgua.schema';

/**
 * Estado inicial del formulario.
 *
 * saldo solo se utiliza en el frontend para validar que el pago
 * corresponda al total pendiente. No se envía al backend.
 */
const EMPTY_FORM = {
  accion_id: '',
  cobro_agua_id: '',
  monto: '',
  metodo_pago: 'QR',
  observacion: '',
  saldo: 0,
};

/**
 * Nombres que el backend podría utilizar para devolver cobros.
 *
 * El detalle actual devuelve:
 * data.cobrosAccionAgua
 */
const COBROS_KEYS = [
  'cobrosAccionAgua',
  'cobrosAccion',
  'cobrosAgua',
  'cobros_agua',
  'cobros',
  'lecturas',
];

const HISTORIAL_KEYS = [
  'historial',
  'cobrosAccionAgua',
  'cobrosAccion',
  'cobrosAgua',
  'cobros_agua',
  'cobros',
  'lecturas',
];

const formatMoney = (value) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(Number(value || 0));

const toPositiveInteger = (value) => {
  const numericValue = Number(value);

  return Number.isInteger(numericValue) &&
    numericValue > 0
    ? numericValue
    : 0;
};

const getAccionId = (accion) =>
  toPositiveInteger(
    accion?.accion_id ??
      accion?.id_accion ??
      accion?.id,
  );

const getCobroId = (cobro) =>
  toPositiveInteger(
    cobro?.cobro_agua_id ??
      cobro?.id_cobro_agua ??
      cobro?.id,
  );

const getNombreCompleto = (accion) => {
  if (accion?.nombre_completo) {
    return accion.nombre_completo;
  }

  const nombreCompleto = [
    accion?.nombres,
    accion?.primer_apellido,
    accion?.segundo_apellido,
  ]
    .filter(Boolean)
    .join(' ');

  return nombreCompleto || 'Socio sin nombre';
};

/**
 * Obtiene el objeto data enviado por el backend.
 */
const getResponseData = (response) => {
  const data =
    response?.data ??
    response?.dato ??
    response ??
    {};

  return data;
};

/**
 * Busca el primer arreglo disponible dentro del objeto recibido.
 */
const findFirstArray = (source, keys) => {
  if (Array.isArray(source)) {
    return source;
  }

  for (const key of keys) {
    if (Array.isArray(source?.[key])) {
      return source[key];
    }
  }

  return [];
};

/**
 * Lista principal:
 *
 * {
 *   ok: true,
 *   data: [...]
 * }
 */
const getAccionesFromResponse = (response) =>
  findFirstArray(response, [
    'data',
    'rows',
    'items',
  ]);

/**
 * Detalle de una acción:
 *
 * {
 *   ok: true,
 *   data: {
 *     ...,
 *     cobrosAccionAgua: [...]
 *   }
 * }
 */
const getCobrosFromResponse = (response) =>
  findFirstArray(
    getResponseData(response),
    COBROS_KEYS,
  );

/**
 * Historial de una acción.
 */
const getHistorialFromResponse = (response) =>
  findFirstArray(
    getResponseData(response),
    HISTORIAL_KEYS,
  );

const getDetalleFromResponse = (response) => {
  const data = getResponseData(response);

  if (
    data &&
    typeof data === 'object' &&
    !Array.isArray(data)
  ) {
    return data;
  }

  return {};
};

const getMontoTotal = (cobro) =>
  Number(
    cobro?.monto_total ??
      cobro?.precio ??
      cobro?.monto ??
      0,
  );

const getMontoPagado = (cobro) =>
  Number(
    cobro?.monto_pagado ??
      cobro?.pagado ??
      0,
  );

const getSaldo = (cobro) => {
  if (
    cobro?.saldo !== undefined &&
    cobro?.saldo !== null
  ) {
    return Math.max(
      0,
      Number(cobro.saldo || 0),
    );
  }

  if (
    cobro?.saldo_pendiente !== undefined &&
    cobro?.saldo_pendiente !== null
  ) {
    return Math.max(
      0,
      Number(cobro.saldo_pendiente || 0),
    );
  }

  return Math.max(
    0,
    getMontoTotal(cobro) -
      getMontoPagado(cobro),
  );
};

const getEstadoClass = (estado) => {
  const normalized = String(
    estado || '',
  ).toUpperCase();

  switch (normalized) {
    case 'PAGADO':
      return 'bg-emerald-50 text-emerald-700';
    case 'ANULADO':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-blue-50 text-blue-700';
  }
};

const openPdfBlob = (
  blob,
  filename = 'recibo-agua.pdf',
) => {
  if (
    typeof Blob === 'undefined' ||
    !(blob instanceof Blob)
  ) {
    return;
  }

  const pdfUrl = URL.createObjectURL(blob);
  const newWindow = window.open(
    pdfUrl,
    '_blank',
    'noopener,noreferrer',
  );

  if (!newWindow) {
    const link = document.createElement('a');

    link.href = pdfUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  window.setTimeout(
    () => URL.revokeObjectURL(pdfUrl),
    60_000,
  );
};

function MessageBanner({
  message,
  messageType,
}) {
  if (!message) return null;

  const colorClass =
    messageType === 'error'
      ? 'bg-red-50 text-red-700'
      : 'bg-emerald-50 text-emerald-700';

  return (
    <div
      className={`rounded-2xl px-4 py-3 text-sm font-semibold ${colorClass}`}
    >
      {message}
    </div>
  );
}

function ActionCard({
  accion,
  selected,
  onSelect,
}) {
  const accionId = getAccionId(accion);

  return (
    <button
      type="button"
      onClick={() => onSelect(accion)}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        selected
          ? 'border-blue-700 bg-blue-50'
          : 'border-slate-200 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
          <UserIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="truncate font-bold text-slate-800">
            {getNombreCompleto(accion)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Acción:{' '}
            {accion.codigo_interno ||
              accionId ||
              '-'}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Medidor: {accion.nro_medidor || '-'}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {accion.direccion || 'Sin dirección'}
          </p>
        </div>
      </div>
    </button>
  );
}

function ActionsList({
  acciones,
  loading,
  selectedAccion,
  onSelect,
}) {
  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        Cargando acciones...
      </p>
    );
  }

  if (acciones.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        No se encontraron acciones con cobros de
        agua pendientes.
      </p>
    );
  }

  return acciones.map((accion, index) => {
    const accionId = getAccionId(accion);
    const selected =
      getAccionId(selectedAccion) === accionId;

    return (
      <ActionCard
        key={
          accionId ||
          `${accion.codigo_interno || 'accion'}-${index}`
        }
        accion={accion}
        selected={selected}
        onSelect={onSelect}
      />
    );
  });
}

function Pagination({
  page,
  totalPages,
  loading,
  onPrevious,
  onNext,
}) {
  return (
    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
      <button
        type="button"
        disabled={page <= 1 || loading}
        onClick={onPrevious}
        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Anterior
      </button>

      <span className="text-xs font-semibold text-slate-500">
        Página {page} de {totalPages}
      </span>

      <button
        type="button"
        disabled={page >= totalPages || loading}
        onClick={onNext}
        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Siguiente
      </button>
    </div>
  );
}

function MoneyRow({
  label,
  value,
  highlighted = false,
}) {
  return (
    <div
      className={`flex justify-between gap-4 ${
        highlighted
          ? 'border-t border-slate-100 pt-2'
          : ''
      }`}
    >
      <span
        className={
          highlighted
            ? 'font-bold text-slate-700'
            : 'text-slate-500'
        }
      >
        {label}
      </span>

      <strong
        className={
          highlighted
            ? 'text-lg text-blue-800'
            : 'text-slate-800'
        }
      >
        {formatMoney(value)}
      </strong>
    </div>
  );
}

function CobroCard({
  cobro,
  selected,
  onSelect,
}) {
  const cobroId = getCobroId(cobro);
  const estado = cobro.estado || 'PENDIENTE';

  return (
    <button
      type="button"
      onClick={() => onSelect(cobro)}
      className={`rounded-3xl border p-5 text-left transition ${
        selected
          ? 'border-blue-700 bg-blue-50'
          : 'border-slate-200 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-800">
            {cobro.concepto ||
              cobro.descripcion ||
              `Cobro de agua #${cobroId}`}
          </p>

          {cobro.concepto &&
            cobro.descripcion && (
              <p className="mt-1 text-xs text-slate-500">
                {cobro.descripcion}
              </p>
            )}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${getEstadoClass(
            estado,
          )}`}
        >
          {estado}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <MoneyRow
          label="Monto total"
          value={getMontoTotal(cobro)}
        />

        <MoneyRow
          label="Pagado"
          value={getMontoPagado(cobro)}
        />

        <MoneyRow
          label="Saldo a pagar"
          value={getSaldo(cobro)}
          highlighted
        />
      </div>
    </button>
  );
}

function CobrosList({
  cobros,
  loading,
  selectedCobro,
  onSelect,
}) {
  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        Cargando cobros...
      </p>
    );
  }

  if (cobros.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
        Esta acción no tiene cobros pendientes.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cobros.map((cobro, index) => {
        const cobroId = getCobroId(cobro);
        const selected =
          getCobroId(selectedCobro) === cobroId;

        return (
          <CobroCard
            key={
              cobroId ||
              `${cobro.concepto || 'cobro'}-${index}`
            }
            cobro={cobro}
            selected={selected}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}

function PagoForm({
  form,
  errors,
  selectedCobro,
  saving,
  onChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-3xl bg-slate-50 p-5"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          Registrar pago completo
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Selecciona una deuda. El monto se cargará
          automáticamente con el saldo completo.
        </p>
      </div>

      {errors.cobro_agua_id && (
        <p className="text-sm font-semibold text-red-600">
          {errors.cobro_agua_id}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Método de pago
          </label>

          <select
            name="metodo_pago"
            value={form.metodo_pago}
            onChange={onChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            <option value="QR">QR</option>
            <option value="EFECTIVO">
              EFECTIVO
            </option>
            <option value="TRANSFERENCIA">
              TRANSFERENCIA
            </option>
          </select>

          {errors.metodo_pago && (
            <p className="mt-1 text-sm text-red-600">
              {errors.metodo_pago}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Monto total a pagar 
          </label>

          <input
            type="number"
            name="monto"
            value={form.monto}
            readOnly
            placeholder="Seleccione una deuda"
            className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none"
          />

          <p className="mt-1 text-xs text-slate-500">
            El cobro de agua debe pagarse por el
            saldo completo.
          </p>

          {errors.monto && (
            <p className="mt-1 text-sm text-red-600">
              {errors.monto}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Observación
        </label>

        <textarea
          name="observacion"
          value={form.observacion}
          onChange={onChange}
          rows={3}
          maxLength={250}
          placeholder="Observación opcional..."
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
        />

        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-red-600">
            {errors.observacion || ''}
          </span>

          <span className="text-xs text-slate-400">
            {form.observacion.length}/250
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={
          saving || !selectedCobro || !form.monto
        }
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CreditCardIcon className="h-5 w-5" />

        {saving
          ? 'Registrando pago...'
          : 'Confirmar pago completo y generar recibo'}
      </button>
    </form>
  );
}

function DetailHeader({
  accion,
  totalPendiente,
  onHistorial,
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          {getNombreCompleto(accion)}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Medidor: {accion.nro_medidor || '-'}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Calle: {accion.nombre_calle || '-'}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Tarifa: {accion.nombre_tarifa || '-'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-right">
          <p className="text-xs font-bold text-blue-700">
            Total pendiente
          </p>

          <p className="text-xl font-black text-blue-900">
            {formatMoney(totalPendiente)}
          </p>
        </div>

        <button
          type="button"
          onClick={onHistorial}
          className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
        >
          <ClockIcon className="h-5 w-5" />
          Historial
        </button>
      </div>
    </div>
  );
}

function ActionDetail({
  accion,
  cobros,
  selectedCobro,
  loading,
  totalPendiente,
  form,
  errors,
  saving,
  onSelectCobro,
  onChange,
  onSubmit,
  onHistorial,
}) {
  if (!accion) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-3xl border border-dashed border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-500">
          Selecciona una acción para revisar sus
          cobros de agua pendientes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        accion={accion}
        totalPendiente={totalPendiente}
        onHistorial={onHistorial}
      />

      <CobrosList
        cobros={cobros}
        loading={loading}
        selectedCobro={selectedCobro}
        onSelect={onSelectCobro}
      />

      <PagoForm
        form={form}
        errors={errors}
        selectedCobro={selectedCobro}
        saving={saving}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function HistoryAmount({
  label,
  value,
  highlighted = false,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 font-bold ${
          highlighted
            ? 'text-blue-800'
            : 'text-slate-800'
        }`}
      >
        {formatMoney(value)}
      </p>
    </div>
  );
}

function HistoryItem({ item, index }) {
  return (
    <article className="rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="font-bold text-slate-800">
            {item.concepto ||
              item.descripcion ||
              `Registro #${index + 1}`}
          </p>

          {item.periodo && (
            <p className="mt-1 text-sm text-slate-500">
              Periodo: {item.periodo}
            </p>
          )}

          {item.observacion && (
            <p className="mt-1 text-sm text-slate-500">
              {item.observacion}
            </p>
          )}
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${getEstadoClass(
            item.estado,
          )}`}
        >
          {item.estado || 'PENDIENTE'}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <HistoryAmount
          label="Total"
          value={getMontoTotal(item)}
        />

        <HistoryAmount
          label="Pagado"
          value={getMontoPagado(item)}
        />

        <HistoryAmount
          label="Saldo"
          value={getSaldo(item)}
          highlighted
        />
      </div>
    </article>
  );
}

function HistoryContent({
  loading,
  historial,
}) {
  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        Cargando historial...
      </p>
    );
  }

  if (historial.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        No existen registros en el historial.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {historial.map((item, index) => (
        <HistoryItem
          key={
            getCobroId(item) ||
            `${item.periodo_id || 'historial'}-${index}`
          }
          item={item}
          index={index}
        />
      ))}
    </div>
  );
}

function HistoryModal({
  open,
  loading,
  historial,
  accion,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Historial de cobros de agua
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {getNombreCompleto(accion)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Cerrar historial"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          <HistoryContent
            loading={loading}
            historial={historial}
          />
        </div>

        <div className="flex justify-end border-t border-slate-100 p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-900"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CobrosAguaPage() {
  const [acciones, setAcciones] = useState([]);
  const [selectedAccion, setSelectedAccion] =
    useState(null);
  const [cobrosAgua, setCobrosAgua] = useState([]);
  const [selectedCobro, setSelectedCobro] =
    useState(null);

  const [historial, setHistorial] = useState([]);
  const [showHistorial, setShowHistorial] =
    useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] =
    useState('');

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [loadingAcciones, setLoadingAcciones] =
    useState(false);
  const [loadingDetalle, setLoadingDetalle] =
    useState(false);
  const [loadingHistorial, setLoadingHistorial] =
    useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] =
    useState('success');
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(EMPTY_FORM);

  const showError = useCallback((text) => {
    setMessage(text);
    setMessageType('error');
  }, []);

  const fetchAcciones = useCallback(async () => {
    setLoadingAcciones(true);

    const response =
      await CobrosAguaServices.getAll(
        page,
        limit,
        debouncedSearch,
      );

    setLoadingAcciones(false);

    if (!response?.ok) {
      setAcciones([]);
      setTotalPages(1);

      showError(
        response?.message ||
          'No se pudieron cargar los cobros de agua',
      );

      return;
    }

    setAcciones(
      getAccionesFromResponse(response),
    );

    setTotalPages(
      Math.max(
        1,
        Number(response?.totalPages) || 1,
      ),
    );
  }, [
    debouncedSearch,
    page,
    showError,
  ]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search]);

  useEffect(() => {
    fetchAcciones();
  }, [fetchAcciones]);

  const selectAccion = async (
    accion,
    preserveMessage = false,
  ) => {
    const accionId = getAccionId(accion);

    if (!accionId) {
      showError(
        'La acción seleccionada no tiene un identificador válido',
      );

      return;
    }

    setSelectedAccion(accion);
    setCobrosAgua([]);
    setSelectedCobro(null);
    setErrors({});

    setForm({
      ...EMPTY_FORM,
      accion_id: accionId,
    });

    if (!preserveMessage) {
      setMessage('');
    }

    setLoadingDetalle(true);

    const response =
      await CobrosAguaServices.getByAccionId(
        accionId,
      );

    setLoadingDetalle(false);

    if (!response?.ok) {
      showError(
        response?.message ||
          'No se pudieron cargar los cobros de esta acción',
      );

      return;
    }

    const detalle =
      getDetalleFromResponse(response);

    setSelectedAccion({
      ...accion,
      ...detalle,
      id: accionId,
      accion_id: accionId,
    });

    /**
     * Corrección importante:
     * el backend devuelve data.cobrosAccionAgua.
     */
    setCobrosAgua(
      getCobrosFromResponse(response),
    );
  };

  const selectCobro = (cobro) => {
    const cobroId = getCobroId(cobro);
    const saldo = getSaldo(cobro);

    if (!cobroId) {
      showError(
        'El cobro seleccionado no tiene un ID válido',
      );

      return;
    }

    if (
      !Number.isFinite(saldo) ||
      saldo <= 0
    ) {
      showError(
        'El cobro seleccionado no tiene saldo pendiente',
      );

      return;
    }

    setSelectedCobro(cobro);

    setForm((previous) => ({
      ...previous,
      cobro_agua_id: cobroId,
      monto: String(saldo),
      saldo,
    }));

    setErrors({});
    setMessage('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }));

    setMessage('');
  };

  const totalPendiente = useMemo(
    () =>
      cobrosAgua.reduce(
        (total, cobro) =>
          total + getSaldo(cobro),
        0,
      ),
    [cobrosAgua],
  );

  const handlePagar = async (event) => {
    event.preventDefault();
    setMessage('');

    const validation =
      validatePagoAgua(form);

    if (!validation.isValid) {
      setErrors(validation.errors);

      return;
    }

    const confirmed = window.confirm(
      `¿Confirmar el pago completo de ${formatMoney(
        validation.data.monto,
      )}?`,
    );

    if (!confirmed) return;

    setSaving(true);

    const response =
      await CobrosAguaServices.pagar(
        validation.data.accion_id,
        validation.data,
      );

    setSaving(false);

    if (!response?.ok) {
      showError(
        response?.message ||
          'No se pudo registrar el pago de agua',
      );

      return;
    }

    setMessage(
      response?.message ||
        'Pago de agua registrado correctamente',
    );

    setMessageType('success');
    setErrors({});

    if (response?.pdfBlob) {
      openPdfBlob(
        response.pdfBlob,
        response.filename,
      );
    }

    const currentAccion = selectedAccion;

    setSelectedCobro(null);

    setForm((previous) => ({
      ...previous,
      cobro_agua_id: '',
      monto: '',
      observacion: '',
      saldo: 0,
    }));

    if (currentAccion) {
      await selectAccion(
        currentAccion,
        true,
      );
    }

    await fetchAcciones();
  };

  const handleHistorial = async () => {
    const accionId =
      getAccionId(selectedAccion);

    if (!accionId) {
      showError(
        'No se pudo identificar la acción seleccionada',
      );

      return;
    }

    setShowHistorial(true);
    setHistorial([]);
    setLoadingHistorial(true);

    const response =
      await CobrosAguaServices.getHistorial(
        accionId,
      );

    setLoadingHistorial(false);

    if (!response?.ok) {
      showError(
        response?.message ||
          'No se pudo cargar el historial de agua',
      );

      return;
    }

    setHistorial(
      getHistorialFromResponse(response),
    );
  };

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-800">
            <BanknotesIcon className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Cobros de agua
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Busca una acción, selecciona una deuda
              pendiente y registra el pago completo.
            </p>
          </div>
        </div>
      </header>

      <MessageBanner
        message={message}
        messageType={messageType}
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.5fr]">
        <aside className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="relative mb-5">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar por socio, medidor o dirección..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-3">
            <ActionsList
              acciones={acciones}
              loading={loadingAcciones}
              selectedAccion={selectedAccion}
              onSelect={selectAccion}
            />
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            loading={loadingAcciones}
            onPrevious={() =>
              setPage((previous) =>
                Math.max(1, previous - 1),
              )
            }
            onNext={() =>
              setPage((previous) =>
                Math.min(
                  totalPages,
                  previous + 1,
                ),
              )
            }
          />
        </aside>

        <main className="rounded-3xl bg-white p-5 shadow-sm">
          <ActionDetail
            accion={selectedAccion}
            cobros={cobrosAgua}
            selectedCobro={selectedCobro}
            loading={loadingDetalle}
            totalPendiente={totalPendiente}
            form={form}
            errors={errors}
            saving={saving}
            onSelectCobro={selectCobro}
            onChange={handleChange}
            onSubmit={handlePagar}
            onHistorial={handleHistorial}
          />
        </main>
      </div>

      <HistoryModal
        open={showHistorial}
        loading={loadingHistorial}
        historial={historial}
        accion={selectedAccion}
        onClose={() =>
          setShowHistorial(false)
        }
      />
    </section>
  );
}