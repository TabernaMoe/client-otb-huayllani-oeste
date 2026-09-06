import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MinusCircleIcon,
  PlusIcon,
  UserGroupIcon,
  UserIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import { asistenciasMock, reunionesMock } from '../data/asambleas.mock';

import { services } from '../services/asambleas.services';

const estadoStyles = {
  ASISTIO: {
    label: 'Asistió',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  FALTA: {
    label: 'Faltó',
    badge: 'border-red-200 bg-red-50 text-red-700',
    dot: 'bg-red-500',
  },
  SIN_EFECTO: {
    label: 'Sin efecto',
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
};

const meetingStatusStyles = {
  PROGRAMADA: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  FINALIZADA: 'border-blue-200 bg-blue-50 text-blue-700',
  CANCELADA: 'border-red-200 bg-red-50 text-red-700',
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join('')
    .toUpperCase();

const formatDate = (value) => {
  if (!value) return '-';

  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
};

const formatDateTime = (value) => {
  if (!value) return '-';

  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50';

export default function AsambleasPage() {
  const [reuniones, setReuniones] = useState(reunionesMock);
  const [selectedReunion, setSelectedReunion] = useState(reunionesMock[0]);
  const [asistencias, setAsistencias] = useState(asistenciasMock);

  const [searchReunion, setSearchReunion] = useState('');
  const [searchSocio, setSearchSocio] = useState('');
  const [filterEstado, setFilterEstado] = useState('TODOS');

  const [activeTab, setActiveTab] = useState('ASISTENCIAS');
  const [selectedAsistencia, setSelectedAsistencia] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const loadData = useCallback(async () => {
    try {
      const response = await services.getAll();
      //console.log(response);
      setReuniones(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      //console.error('Error cargando reuniones:', error);
      setReuniones([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  const [attendanceForm, setAttendanceForm] = useState({
    estado: 'ASISTIO',
    observacion: '',
    justificado: false,
  });

  const [meetingForm, setMeetingForm] = useState({
    titulo: '',
    fecha: '',
    hora_inicio: '',
    lugar: '',
    monto_multa: '',
  });

  const reunionesFiltradas = useMemo(() => {
    const text = searchReunion.trim().toLowerCase();

    if (!text) return reuniones;

    return reuniones.filter((reunion) =>
      `${reunion.titulo} ${reunion.mes} ${reunion.lugar}`
        .toLowerCase()
        .includes(text),
    );
  }, [reuniones, searchReunion]);

  const asistenciasFiltradas = useMemo(() => {
    const text = searchSocio.trim().toLowerCase();

    return asistencias.filter((asistencia) => {
      const matchSearch =
        !text ||
        `${asistencia.nombre_completo} ${asistencia.codigo}`
          .toLowerCase()
          .includes(text);

      const matchEstado =
        filterEstado === 'TODOS' || asistencia.estado === filterEstado;

      return matchSearch && matchEstado;
    });
  }, [asistencias, searchSocio, filterEstado]);

  const resumen = useMemo(() => {
    const asistieron = asistencias.filter(
      (item) => item.estado === 'ASISTIO',
    ).length;

    const faltaron = asistencias.filter(
      (item) => item.estado === 'FALTA',
    ).length;

    const sinEfecto = asistencias.filter(
      (item) => item.estado === 'SIN_EFECTO',
    ).length;

    const total = asistencias.length;

    return {
      total,
      asistieron,
      faltaron,
      sinEfecto,
      porcentaje: total > 0 ? ((asistieron / total) * 100).toFixed(1) : '0.0',
    };
  }, [asistencias]);

  const openAttendanceDrawer = (asistencia) => {
    setSelectedAsistencia(asistencia);
    setAttendanceForm({
      estado: asistencia.estado,
      observacion: asistencia.observacion || '',
      justificado: Boolean(asistencia.justificado),
    });
    setShowDrawer(true);
  };

  const saveAttendance = async () => {
    if (!selectedAsistencia) return;

    console.log(selectedAsistencia);

    try {
      const response = await services.updateAcciones(
        selectedAsistencia.id,
        selectedAsistencia,
      );
      if (!response.ok) {
        throw new Error(response.message || 'No se pudo crear');
      }
      setShowDrawer(false);
      setSelectedAsistencia(null);

      loadData();
      toast.success('Se creo correctamente a asamblea');
    } catch (e) {
      toast.error(e);
    }

    // setAsistencias((previous) =>
    //   previous.map((item) =>
    //     item.id === selectedAsistencia.id
    //       ? {
    //           ...item,
    //           ...attendanceForm,
    //           registrado_por: 'Administrador',
    //           fecha_registro: new Date().toISOString(),
    //         }
    //       : item,
    //   ),
    // );

    // setShowDrawer(false);
    // setSelectedAsistencia(null);
  };

  const createMeeting = async (event) => {
    event.preventDefault();
    try {
      const response = await services.create(meetingForm);
      if (!response.ok) {
        throw new Error(response.message || 'No se pudo crear');
      }
      setShowCreateModal(false);
      loadData();
      toast.success('Se creo correctamente a asamblea');
    } catch (e) {
      toast.error(e);
    }

    // const newMeeting = {
    //   id: Date.now(),
    //   titulo: meetingForm.titulo,
    //   mes: new Intl.DateTimeFormat('es-BO', {
    //     month: 'long',
    //     year: 'numeric',
    //   }).format(new Date(`${meetingForm.fecha}T00:00:00`)),
    //   fecha: meetingForm.fecha,
    //   hora_inicio: meetingForm.hora_inicio,
    //   hora_final: meetingForm.hora_final,
    //   lugar: meetingForm.lugar,
    //   estado: 'PROGRAMADA',
    //   convocados: asistencias.length,
    //   monto_multa: Number(meetingForm.monto_multa || 0),
    // };

    // setReuniones((previous) => [newMeeting, ...previous]);
    // setSelectedReunion(newMeeting);

    // setMeetingForm({
    //   titulo: '',
    //   fecha: '',
    //   hora_inicio: '',
    //   hora_final: '',
    //   lugar: '',
    //   monto_multa: '',
    // });
  };

  const seleccionarReunico = async (payload) => {
    try {
      setSelectedReunion(payload);
      const response = await services.getAcciones(payload.id);
      if (!response.ok) {
        throw new Error('No se pudar cargar la lista');
      }
      setAsistencias(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      toast.error('No se pudo cargar la reunios');
    }
  };

  const clearAttendanceFilters = () => {
    setSearchSocio('');
    setFilterEstado('TODOS');
  };

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="space-y-5">
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Inicio</span>
              <span>/</span>
              <span>Asambleas</span>
              <span>/</span>
              <span className="text-emerald-700">Gestión de reuniones</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Asambleas y reuniones
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Organiza reuniones, controla convocados y registra la asistencia
              de los socios.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva reunión
          </button>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryMetric
            label="Total reuniones"
            value={reuniones.length}
            icon={CalendarDaysIcon}
            iconClass="bg-slate-100 text-slate-700"
          />

          <SummaryMetric
            label="Socios convocados"
            value={selectedReunion?.convocados || 0}
            icon={UserGroupIcon}
            iconClass="bg-blue-50 text-blue-700"
          />

          <SummaryMetric
            label="Asistencia"
            value={`${resumen.porcentaje}%`}
            icon={CheckCircleIcon}
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <SummaryMetric
            label="Faltas registradas"
            value={resumen.faltaron}
            icon={ExclamationTriangleIcon}
            iconClass="bg-amber-50 text-amber-700"
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                  1
                </span>
                <div>
                  <h2 className="font-bold text-slate-900">Reuniones</h2>
                  <p className="text-xs text-slate-500">
                    Seleccione una reunión para ver su información.
                  </p>
                </div>
              </div>

              <div className="relative mt-4">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchReunion}
                  onChange={(event) => setSearchReunion(event.target.value)}
                  placeholder="Buscar reunión..."
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div className="max-h-180 space-y-2 overflow-y-auto p-3">
              {reunionesFiltradas.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                  <CalendarDaysIcon className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-3 text-sm font-medium text-slate-500">
                    No se encontraron reuniones
                  </p>
                </div>
              ) : (
                reunionesFiltradas.map((reunion) => {
                  const active = selectedReunion?.id === reunion.id;
                  const date = new Date(`${reunion.fecha}T00:00:00`);
                  const day = date.getDate();
                  const month = new Intl.DateTimeFormat('es-BO', {
                    month: 'short',
                  })
                    .format(date)
                    .toUpperCase();

                  return (
                    <button
                      key={reunion.id}
                      type="button"
                      onClick={() => seleccionarReunico(reunion)}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        active
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg ${
                            active
                              ? 'bg-white text-emerald-700 shadow-sm'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="text-xl font-bold leading-none">
                            {day}
                          </span>
                          <span className="mt-1 text-[10px] font-bold">
                            {month}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {reunion.titulo}
                            </p>
                            <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-400" />
                          </div>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {reunion.lugar}
                          </p>

                          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <ClockIcon className="h-3.5 w-3.5" />
                              {reunion.hora_inicio}
                            </span>
                            <span className="flex items-center gap-1">
                              <UserGroupIcon className="h-3.5 w-3.5" />
                              {reunion.convocados}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <main className="space-y-5">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5 lg:px-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                        2
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {selectedReunion?.titulo || 'Seleccione una reunión'}
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {selectedReunion?.mes || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex h-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                      meetingStatusStyles[selectedReunion?.estado] ||
                      meetingStatusStyles.PROGRAMADA
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {selectedReunion?.estado || 'PROGRAMADA'}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoItem
                    icon={CalendarDaysIcon}
                    label="Fecha"
                    value={formatDate(selectedReunion?.fecha)}
                  />
                  <InfoItem
                    icon={ClockIcon}
                    label="Horario"
                    value={`${selectedReunion?.hora_inicio || '-'} - ${
                      selectedReunion?.hora_final || '-'
                    }`}
                  />
                  <InfoItem
                    icon={MapPinIcon}
                    label="Lugar"
                    value={selectedReunion?.lugar}
                  />
                  <InfoItem
                    icon={UserGroupIcon}
                    label="Convocados"
                    value={`${selectedReunion?.convocados || 0} socios`}
                  />
                </div>
              </div>

              <div className="flex gap-6 overflow-x-auto border-b border-slate-200 px-5 lg:px-6">
                {[
                  ['DETALLES', 'Detalles'],
                  ['CONVOCADOS', `Convocados (${resumen.total})`],
                  ['ASISTENCIAS', `Asistencias (${resumen.asistieron})`],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setActiveTab(value)}
                    className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-semibold transition ${
                      activeTab === value
                        ? 'border-emerald-700 text-emerald-700'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-5 lg:p-6">
                {activeTab === 'DETALLES' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <DetailCard
                      icon={DocumentTextIcon}
                      label="Monto de multa"
                      value={`Bs. ${selectedReunion?.monto_multa || 0}`}
                    />
                    <DetailCard
                      icon={CheckCircleIcon}
                      label="Estado"
                      value={selectedReunion?.estado}
                    />
                    <DetailCard
                      icon={ClockIcon}
                      label="Hora de finalización"
                      value={selectedReunion?.hora_final}
                    />
                    <DetailCard
                      icon={UserGroupIcon}
                      label="Total convocados"
                      value={selectedReunion?.convocados}
                    />
                  </div>
                )}

                {activeTab === 'CONVOCADOS' && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-white p-2 text-blue-700">
                        <UserGroupIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-900">
                          Lista de convocados
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-blue-800/80">
                          Esta sección puede conectarse con el endpoint de
                          socios para mostrar todos los convocados de la reunión
                          seleccionada.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'ASISTENCIAS' && (
                  <div className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-3">
                      <AttendanceSummaryCard
                        title="Asistieron"
                        value={resumen.asistieron}
                        percentage={`${resumen.porcentaje}%`}
                        icon={CheckCircleIcon}
                        className="border-emerald-100 bg-emerald-50 text-emerald-700"
                      />
                      <AttendanceSummaryCard
                        title="Faltaron"
                        value={resumen.faltaron}
                        percentage={
                          resumen.total
                            ? `${((resumen.faltaron / resumen.total) * 100).toFixed(1)}%`
                            : '0%'
                        }
                        icon={XCircleIcon}
                        className="border-red-100 bg-red-50 text-red-700"
                      />
                      <AttendanceSummaryCard
                        title="Sin efecto"
                        value={resumen.sinEfecto}
                        percentage={
                          resumen.total
                            ? `${((resumen.sinEfecto / resumen.total) * 100).toFixed(1)}%`
                            : '0%'
                        }
                        icon={MinusCircleIcon}
                        className="border-amber-100 bg-amber-50 text-amber-700"
                      />
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row">
                      <div className="relative flex-1">
                        <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="search"
                          value={searchSocio}
                          onChange={(event) =>
                            setSearchSocio(event.target.value)
                          }
                          placeholder="Buscar socio por nombre o código"
                          className={`${inputClass} pl-11`}
                        />
                      </div>

                      <select
                        value={filterEstado}
                        onChange={(event) =>
                          setFilterEstado(event.target.value)
                        }
                        className="min-w-44 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                      >
                        <option value="TODOS">Todos los estados</option>
                        <option value="ASISTIO">Asistieron</option>
                        <option value="FALTA">Faltaron</option>
                        <option value="SIN_EFECTO">Sin efecto</option>
                      </select>

                      <button
                        type="button"
                        onClick={clearAttendanceFilters}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                        Limpiar
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="min-w-212.5 w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50">
                          <tr>
                            <TableHead>Socio</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Observación</TableHead>
                            <TableHead>Registrado por</TableHead>
                            <TableHead />
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 bg-white">
                          {asistenciasFiltradas.length === 0 ? (
                            <tr>
                              <td
                                colSpan="5"
                                className="px-6 py-14 text-center"
                              >
                                <UserGroupIcon className="mx-auto h-8 w-8 text-slate-300" />
                                <p className="mt-3 text-sm font-medium text-slate-500">
                                  No se encontraron asistencias
                                </p>
                              </td>
                            </tr>
                          ) : (
                            asistenciasFiltradas.map((asistencia) => {
                              const estado =
                                estadoStyles[asistencia.asistio] ||
                                estadoStyles.SIN_EFECTO;

                              return (
                                <tr
                                  key={asistencia.id}
                                  className="transition hover:bg-slate-50/80"
                                >
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                                        {getInitials(
                                          asistencia.nombre_completo,
                                        )}
                                      </div>
                                      <div>
                                        <p className="font-bold text-slate-900">
                                          {asistencia.nombre_completo}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                          {asistencia.codigo_interno}
                                        </p>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-4 py-4">
                                    <span
                                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${estado.badge}`}
                                    >
                                      <span
                                        className={`h-2 w-2 rounded-full ${estado.dot}`}
                                      />
                                      {estado.label}
                                    </span>
                                  </td>

                                  <td className="max-w-64 px-4 py-4 text-sm text-slate-500">
                                    <p className="line-clamp-2">
                                      {asistencia.observacion ||
                                        'Sin observación'}
                                    </p>
                                  </td>

                                  <td className="px-4 py-4">
                                    <p className="text-sm font-semibold text-slate-700">
                                      {asistencia.registrado_por ||
                                        'Sin registrar'}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                      {formatDateTime(
                                        asistencia.fecha_registro,
                                      )}
                                    </p>
                                  </td>

                                  <td className="px-4 py-4 text-right">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openAttendanceDrawer(asistencia)
                                      }
                                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                    >
                                      Editar
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>
                        Mostrando{' '}
                        <strong className="text-slate-700">
                          {asistenciasFiltradas.length}
                        </strong>{' '}
                        de {asistencias.length} socios
                      </span>
                      <span className="font-medium text-emerald-700">
                        {resumen.asistieron} asistencias confirmadas
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {showDrawer && selectedAsistencia && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[2px]">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span>Asistencias</span>
                  <span>/</span>
                  <span className="text-emerald-700">Editar</span>
                </div>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Editar asistencia
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Actualice el estado y la observación del socio.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-lg font-bold text-emerald-700">
                    {getInitials(selectedAsistencia.nombre_completo)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      {selectedAsistencia.nombre_completo}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedAsistencia.codigo}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-semibold text-slate-700">
                  Estado de asistencia
                </label>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <AttendanceOption
                    label="Asistió"
                    selected={attendanceForm.estado === 'ASISTIO'}
                    icon={CheckCircleIcon}
                    selectedClass="border-emerald-600 bg-emerald-50 text-emerald-700"
                    onClick={() =>
                      setAttendanceForm((previous) => ({
                        ...previous,
                        estado: 'ASISTIO',
                      }))
                    }
                  />

                  <AttendanceOption
                    label="Faltó"
                    selected={attendanceForm.estado === 'FALTA'}
                    icon={XCircleIcon}
                    selectedClass="border-red-500 bg-red-50 text-red-700"
                    onClick={() =>
                      setAttendanceForm((previous) => ({
                        ...previous,
                        estado: 'FALTA',
                      }))
                    }
                  />

                  <AttendanceOption
                    label="Sin efecto"
                    selected={attendanceForm.estado === 'SIN EFECTO'}
                    icon={MinusCircleIcon}
                    selectedClass="border-amber-500 bg-amber-50 text-amber-700"
                    onClick={() =>
                      setAttendanceForm((previous) => ({
                        ...previous,
                        estado: 'SIN_EFECTO',
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Observación
                </label>
                <textarea
                  rows={5}
                  value={attendanceForm.observacion}
                  onChange={(event) =>
                    setAttendanceForm((previous) => ({
                      ...previous,
                      observacion: event.target.value,
                    }))
                  }
                  placeholder="Ingrese una observación"
                  className={`${inputClass} resize-none`}
                />
              </div>
              {/* 
              <label className="mt-6 flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50">
                <div>
                  <span className="block text-sm font-semibold text-slate-700">
                    Falta justificada
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Marque esta opción si existe un respaldo.
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={attendanceForm.justificado}
                  onChange={(event) =>
                    setAttendanceForm((previous) => ({
                      ...previous,
                      justificado: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-emerald-700"
                />
              </label> */}
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-200 p-6">
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={saveAttendance}
                className="rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]">
          <form
            onSubmit={createMeeting}
            className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">
                  <CalendarDaysIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span>Asambleas</span>
                    <span>/</span>
                    <span className="text-emerald-700">Nueva reunión</span>
                  </div>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Registrar nueva reunión
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Complete los datos generales de la reunión.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    1
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Información general
                    </h3>
                    <p className="text-sm text-slate-500">
                      Defina el nombre, fecha y lugar de la reunión.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="Título" className="md:col-span-2">
                    <div className="relative">
                      <DocumentTextIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        value={meetingForm.titulo}
                        onChange={(event) =>
                          setMeetingForm((previous) => ({
                            ...previous,
                            titulo: event.target.value,
                          }))
                        }
                        placeholder="Ej. Asamblea ordinaria de junio"
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </FormField>

                  <FormField label="Fecha">
                    <div className="relative">
                      <CalendarDaysIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        type="date"
                        value={meetingForm.fecha}
                        onChange={(event) =>
                          setMeetingForm((previous) => ({
                            ...previous,
                            fecha: event.target.value,
                          }))
                        }
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </FormField>

                  <FormField label="Lugar">
                    <div className="relative">
                      <MapPinIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        value={meetingForm.lugar}
                        onChange={(event) =>
                          setMeetingForm((previous) => ({
                            ...previous,
                            lugar: event.target.value,
                          }))
                        }
                        placeholder="Ej. Sede principal"
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </FormField>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    2
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Horario y multa
                    </h3>
                    <p className="text-sm text-slate-500">
                      Establezca el horario y el monto aplicable por
                      inasistencia.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField label="Hora de inicio">
                    <div className="relative">
                      <ClockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        type="time"
                        value={meetingForm.hora_inicio}
                        onChange={(event) =>
                          setMeetingForm((previous) => ({
                            ...previous,
                            hora_inicio: event.target.value,
                          }))
                        }
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </FormField>

                  <FormField label="Monto de multa">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={meetingForm.monto_multa}
                      onChange={(event) =>
                        setMeetingForm((previous) => ({
                          ...previous,
                          monto_multa: event.target.value,
                        }))
                      }
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                <CheckCircleIcon className="h-5 w-5" />
                Crear reunión
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function SummaryMetric({ label, value, icon: Icon, iconClass }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
      <div className="rounded-full bg-white p-2 text-emerald-700 shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-1 truncate text-sm font-bold text-slate-800">
          {value || '-'}
        </p>
      </div>
    </div>
  );
}

function AttendanceSummaryCard({
  title,
  value,
  percentage,
  icon: Icon,
  className,
}) {
  return (
    <div className={`rounded-xl border p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="mt-1 text-xs font-semibold opacity-80">{percentage}</p>
        </div>
        <Icon className="h-9 w-9 opacity-80" />
      </div>
    </div>
  );
}

function AttendanceOption({
  label,
  selected,
  icon: Icon,
  selectedClass,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-3 text-center transition ${
        selected
          ? selectedClass
          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon className="mx-auto h-7 w-7" />
      <p className="mt-2 text-xs font-semibold">{label}</p>
    </button>
  );
}

function TableHead({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function DetailCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white p-2 text-emerald-700 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {value || '-'}
          </p>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children, className = '' }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
