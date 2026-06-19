import { useEffect, useMemo, useState } from 'react';
import {
  MagnifyingGlassIcon,
  BanknotesIcon,
  UserIcon,
  CreditCardIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

import { CobrosServices } from '../services/cobros.services';
import { validatePagoCobro } from '../schema/cobros.schema';

const formatMoney = (value) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(Number(value || 0));

const getSocioId = (socio) => socio?.id || socio?.socio_id;

const getSocioName = (socio) =>
  socio?.nombre_completo ||
  [socio?.nombres, socio?.primer_apellido, socio?.segundo_apellido]
    .filter(Boolean)
    .join(' ') ||
  'Sin nombre';

const getCobroId = (cobro) => Number(cobro?.id);

const getCobroSaldo = (cobro) => Number(cobro?.saldo || 0);

const getCodigoAccion = (cobro) => {
  const texto = cobro?.descripcion || '';
  const match = texto.match(/codigo\s+(\d+)/i);
  return match?.[1] || 'Sin código';
};

const groupCobrosByAccion = (cobros = []) => {
  const groups = {};

  cobros.forEach((cobro) => {
    const codigo = getCodigoAccion(cobro);

    if (!groups[codigo]) {
      groups[codigo] = {
        codigo,
        titulo: `Acción código ${codigo}`,
        cobros: [],
        total: 0,
      };
    }

    groups[codigo].cobros.push(cobro);
    groups[codigo].total += getCobroSaldo(cobro);
  });

  return Object.values(groups);
};

export default function CobrosPage() {
  const [socios, setSocios] = useState([]);
  const [selectedSocio, setSelectedSocio] = useState(null);
  const [cobros, setCobros] = useState([]);

  const [search, setSearch] = useState('');
  const [openGroups, setOpenGroups] = useState({});

  const [loadingSocios, setLoadingSocios] = useState(false);
  const [loadingCobros, setLoadingCobros] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    socio_id: '',
    monto: '',
    cobros: [],
    metodo_pago: 'QR',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const fetchSocios = async () => {
    setLoadingSocios(true);

    const res = await CobrosServices.getSocios(search);

    setLoadingSocios(false);

    if (!res.ok) {
      setMessage(res.message || 'Error al cargar socios');
      setSocios([]);
      return;
    }

    setSocios(res.data || []);
  };

  useEffect(() => {
    fetchSocios();
  }, [search]);

  const openSocio = async (socio) => {
    const socioId = getSocioId(socio);

    setSelectedSocio(socio);
    setCobros([]);
    setErrors({});
    setMessage('');
    setOpenGroups({});

    setForm({
      socio_id: socioId,
      monto: '',
      cobros: [],
      metodo_pago: 'QR',
    });

    setLoadingCobros(true);

    const res = await CobrosServices.getSocioCobros(socioId);

    setLoadingCobros(false);

    if (!res.ok) {
      setMessage(res.message || 'Error al cargar cobros');
      return;
    }

    const data = res.data || {};
    const cobrosSocio = data.cobrosSocio || [];

    setSelectedSocio({
      ...socio,
      ...data,
      id: socioId,
    });

    setCobros(cobrosSocio);

    const grouped = groupCobrosByAccion(cobrosSocio);
    const initialOpen = {};

    grouped.forEach((group) => {
      initialOpen[group.codigo] = true;
    });

    setOpenGroups(initialOpen);
  };

  const cobrosAgrupados = useMemo(() => {
    return groupCobrosByAccion(cobros);
  }, [cobros]);

  const selectedCobros = useMemo(() => {
    return cobros.filter((cobro) => form.cobros.includes(getCobroId(cobro)));
  }, [cobros, form.cobros]);

  const totalSeleccionado = useMemo(() => {
    return selectedCobros.reduce((sum, cobro) => sum + getCobroSaldo(cobro), 0);
  }, [selectedCobros]);

  const toggleGroup = (codigo) => {
    setOpenGroups((prev) => ({
      ...prev,
      [codigo]: !prev[codigo],
    }));
  };

  const toggleCobro = (cobro) => {
    const id = getCobroId(cobro);
    if (!id) return;

    setForm((prev) => {
      const exists = prev.cobros.includes(id);

      const newCobros = exists
        ? prev.cobros.filter((item) => item !== id)
        : [...prev.cobros, id];

      const total = cobros
        .filter((item) => newCobros.includes(getCobroId(item)))
        .reduce((sum, item) => sum + getCobroSaldo(item), 0);

      return {
        ...prev,
        cobros: newCobros,
        monto: String(total),
      };
    });

    setErrors({});
    setMessage('');
  };

  const toggleCobrosAccion = (group) => {
    const ids = group.cobros.map((cobro) => getCobroId(cobro));
    const allSelected = ids.every((id) => form.cobros.includes(id));

    setForm((prev) => {
      const newCobros = allSelected
        ? prev.cobros.filter((id) => !ids.includes(id))
        : Array.from(new Set([...prev.cobros, ...ids]));

      const total = cobros
        .filter((item) => newCobros.includes(getCobroId(item)))
        .reduce((sum, item) => sum + getCobroSaldo(item), 0);

      return {
        ...prev,
        cobros: newCobros,
        monto: String(total),
      };
    });

    setErrors({});
    setMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setMessage('');
  };

  const handlePagar = async (e) => {
    e.preventDefault();

    const validation = validatePagoCobro({
      ...form,
      totalSeleccionado,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const confirmPay = window.confirm(
      `¿Confirmar pago por ${formatMoney(totalSeleccionado)}?`,
    );

    if (!confirmPay) return;

    setSaving(true);

    const res = await CobrosServices.pagar(validation.data);

    setSaving(false);

    if (!res.ok) {
      setMessage(res.message || 'Error al registrar pago');
      return;
    }

    setMessage(res.message || 'Pago registrado correctamente');

    if (selectedSocio) {
      openSocio(selectedSocio);
    }

    fetchSocios();
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-800">
            <BanknotesIcon className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">Cobros</h1>
            <p className="mt-1 text-sm text-slate-500">
              Selecciona un socio, despliega sus acciones y registra el pago de
              sus detalles pendientes.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          {message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.5fr]">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="relative mb-5">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o CI..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-3">
            {loadingSocios ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Cargando socios...
              </p>
            ) : socios.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No hay socios para cobrar
              </p>
            ) : (
              socios.map((socio) => {
                const socioId = getSocioId(socio);
                const active =
                  String(getSocioId(selectedSocio)) === String(socioId);

                return (
                  <button
                    key={socioId}
                    type="button"
                    onClick={() => openSocio(socio)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? 'border-blue-700 bg-blue-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                        <UserIcon className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-bold text-slate-800">
                          {getSocioName(socio)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          CI: {socio.ci_socio || socio.ci || '-'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          {!selectedSocio ? (
            <div className="flex min-h-96 items-center justify-center rounded-3xl border border-dashed border-slate-200">
              <p className="text-sm text-slate-500">
                Selecciona un socio para ver sus acciones pendientes.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePagar} className="space-y-5">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {getSocioName(selectedSocio)}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    CI: {selectedSocio.ci_socio || selectedSocio.ci || '-'}
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-50 px-4 py-3 text-right">
                  <p className="text-xs font-bold text-blue-700">
                    Total seleccionado
                  </p>
                  <p className="text-xl font-black text-blue-900">
                    {formatMoney(totalSeleccionado)}
                  </p>
                </div>
              </div>

              {loadingCobros ? (
                <p className="py-10 text-center text-sm text-slate-500">
                  Cargando cobros...
                </p>
              ) : cobrosAgrupados.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  Este socio no tiene cobros pendientes.
                </div>
              ) : (
                <div className="space-y-4">
                  {cobrosAgrupados.map((group) => {
                    const isOpen = openGroups[group.codigo];
                    const ids = group.cobros.map((cobro) => getCobroId(cobro));
                    const selectedCount = ids.filter((id) =>
                      form.cobros.includes(id),
                    ).length;

                    return (
                      <div
                        key={group.codigo}
                        className="overflow-hidden rounded-3xl border border-slate-200"
                      >
                        <div className="flex items-center justify-between gap-3 bg-slate-50 p-4">
                          <button
                            type="button"
                            onClick={() => toggleGroup(group.codigo)}
                            className="flex items-center gap-2 text-left"
                          >
                            {isOpen ? (
                              <ChevronDownIcon className="h-5 w-5 text-slate-500" />
                            ) : (
                              <ChevronRightIcon className="h-5 w-5 text-slate-500" />
                            )}

                            <div>
                              <p className="font-bold text-slate-800">
                                {group.titulo}
                              </p>
                              <p className="text-xs text-slate-500">
                                {group.cobros.length} detalles pendientes
                              </p>
                            </div>
                          </button>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Total</p>
                              <p className="font-black text-slate-900">
                                {formatMoney(group.total)}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleCobrosAccion(group)}
                              className="rounded-2xl border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                            >
                              {selectedCount === group.cobros.length
                                ? 'Quitar todos'
                                : 'Seleccionar acción'}
                            </button>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="grid gap-3 p-4 md:grid-cols-2">
                            {group.cobros.map((cobro) => {
                              const id = getCobroId(cobro);
                              const checked = form.cobros.includes(id);

                              return (
                                <label
                                  key={id}
                                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                                    checked
                                      ? 'border-blue-700 bg-blue-50'
                                      : 'border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleCobro(cobro)}
                                      className="mt-1 h-4 w-4 accent-blue-800"
                                    />

                                    <div>
                                      <p className="font-bold text-slate-800">
                                        {cobro.concepto}
                                      </p>
                                      <p className="mt-1 text-xs text-slate-500">
                                        {cobro.descripcion}
                                      </p>
                                      <p className="mt-2 text-sm text-slate-500">
                                        Pagado:{' '}
                                        {formatMoney(cobro.monto_pagado)}
                                      </p>
                                      <p className="mt-2 text-lg font-black text-slate-900">
                                        Saldo: {formatMoney(cobro.saldo)}
                                      </p>
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {errors.cobros && (
                <p className="text-sm text-red-600">{errors.cobros}</p>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Método de pago
                  </label>
                  <select
                    name="metodo_pago"
                    value={form.metodo_pago}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="QR">QR</option>
                    <option value="EFECTIVO">EFECTIVO</option>
                    <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                  </select>
                  {errors.metodo_pago && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.metodo_pago}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Monto a pagar
                  </label>
                  <input
                    name="monto"
                    value={form.monto}
                    onChange={handleChange}
                    placeholder="Monto automático"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  />
                  {errors.monto && (
                    <p className="mt-1 text-sm text-red-600">{errors.monto}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || form.cobros.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CreditCardIcon className="h-5 w-5" />
                {saving ? 'Registrando pago...' : 'Confirmar y registrar pago'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}