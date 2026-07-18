import { useMemo, useState } from 'react';
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MinusCircleIcon,
  PlusIcon,
  UserGroupIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  asistenciasMock,
  reunionesMock,
} from '../data/asambleas.mock';

const estadoStyles = {
  ASISTIO: {
    label: 'Asistió',
    className: 'bg-emerald-50 text-emerald-700',
  },
  FALTA: {
    label: 'Faltó',
    className: 'bg-red-50 text-red-700',
  },
  SIN_EFECTO: {
    label: 'Sin efecto',
    className: 'bg-amber-50 text-amber-700',
  },
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

  const [attendanceForm, setAttendanceForm] = useState({
    estado: 'ASISTIO',
    observacion: '',
    justificado: false,
  });

  const [meetingForm, setMeetingForm] = useState({
    titulo: '',
    fecha: '',
    hora_inicio: '',
    hora_final: '',
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
        filterEstado === 'TODOS' ||
        asistencia.estado === filterEstado;

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
      porcentaje:
        total > 0 ? ((asistieron / total) * 100).toFixed(1) : '0.0',
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

  const saveAttendance = () => {
    if (!selectedAsistencia) return;

    setAsistencias((previous) =>
      previous.map((item) =>
        item.id === selectedAsistencia.id
          ? {
              ...item,
              ...attendanceForm,
              registrado_por: 'Administrador',
              fecha_registro: new Date().toISOString(),
            }
          : item,
      ),
    );

    setShowDrawer(false);
    setSelectedAsistencia(null);
  };

  const createMeeting = (event) => {
    event.preventDefault();

    const newMeeting = {
      id: Date.now(),
      titulo: meetingForm.titulo,
      mes: new Intl.DateTimeFormat('es-BO', {
        month: 'long',
        year: 'numeric',
      }).format(new Date(`${meetingForm.fecha}T00:00:00`)),
      fecha: meetingForm.fecha,
      hora_inicio: meetingForm.hora_inicio,
      hora_final: meetingForm.hora_final,
      lugar: meetingForm.lugar,
      estado: 'PROGRAMADA',
      convocados: asistencias.length,
      monto_multa: Number(meetingForm.monto_multa || 0),
    };

    setReuniones((previous) => [newMeeting, ...previous]);
    setSelectedReunion(newMeeting);

    setMeetingForm({
      titulo: '',
      fecha: '',
      hora_inicio: '',
      hora_final: '',
      lugar: '',
      monto_multa: '',
    });

    setShowCreateModal(false);
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Asambleas / Reuniones
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Organiza las reuniones y registra la asistencia de los socios.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
        >
          <PlusIcon className="h-5 w-5" />
          Nueva reunión
        </button>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.3fr]">
        <aside className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">
            Próximas reuniones
          </h2>

          <div className="relative mt-4">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={searchReunion}
              onChange={(event) => setSearchReunion(event.target.value)}
              placeholder="Buscar reunión..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="mt-5 space-y-3">
            {reunionesFiltradas.map((reunion) => {
              const active = selectedReunion?.id === reunion.id;
              const day = new Date(`${reunion.fecha}T00:00:00`).getDate();

              const month = new Intl.DateTimeFormat('es-BO', {
                month: 'short',
              })
                .format(new Date(`${reunion.fecha}T00:00:00`))
                .toUpperCase();

              return (
                <button
                  key={reunion.id}
                  type="button"
                  onClick={() => setSelectedReunion(reunion)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 rounded-2xl bg-slate-100 p-3 text-center">
                      <p className="text-2xl font-black text-slate-900">
                        {day}
                      </p>
                      <p className="text-xs font-bold text-slate-500">
                        {month}
                      </p>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900">
                            {reunion.titulo}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {reunion.mes}
                          </p>
                        </div>

                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">
                          Programada
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{reunion.hora_inicio}</span>
                        <span>{reunion.lugar}</span>
                        <span>{reunion.convocados} convocados</span>
                      </div>
                    </div>

                    <ChevronRightIcon className="h-5 w-5 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="space-y-5 rounded-3xl bg-white p-5 shadow-sm">
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedReunion?.titulo}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedReunion?.mes}
                </p>
              </div>

              <span className="h-fit rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
                Programada
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
                label="Hora"
                value={selectedReunion?.hora_inicio}
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

          <div className="flex gap-6 border-b border-slate-200">
            {[
              ['DETALLES', 'Detalles'],
              ['CONVOCADOS', `Convocados (${resumen.total})`],
              ['ASISTENCIAS', `Asistencias (${resumen.asistieron})`],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveTab(value)}
                className={`border-b-2 px-1 pb-3 text-sm font-bold transition ${
                  activeTab === value
                    ? 'border-emerald-700 text-emerald-700'
                    : 'border-transparent text-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'DETALLES' && (
            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard
                label="Monto de multa"
                value={`Bs. ${selectedReunion?.monto_multa || 0}`}
              />

              <DetailCard
                label="Estado"
                value={selectedReunion?.estado}
              />

              <DetailCard
                label="Hora de finalización"
                value={selectedReunion?.hora_final}
              />

              <DetailCard
                label="Total convocados"
                value={selectedReunion?.convocados}
              />
            </div>
          )}

          {activeTab === 'CONVOCADOS' && (
            <div className="rounded-2xl border border-slate-200 p-6 text-center text-sm text-slate-500">
              La lista de convocados se conectará con el endpoint de socios.
            </div>
          )}

          {activeTab === 'ASISTENCIAS' && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                  title="Asistieron"
                  value={resumen.asistieron}
                  percentage={`${resumen.porcentaje}%`}
                  icon={CheckCircleIcon}
                  className="bg-emerald-50 text-emerald-700"
                />

                <SummaryCard
                  title="Faltaron"
                  value={resumen.faltaron}
                  percentage={
                    resumen.total
                      ? `${(
                          (resumen.faltaron / resumen.total) *
                          100
                        ).toFixed(1)}%`
                      : '0%'
                  }
                  icon={XCircleIcon}
                  className="bg-red-50 text-red-700"
                />

                <SummaryCard
                  title="Sin efecto"
                  value={resumen.sinEfecto}
                  percentage={
                    resumen.total
                      ? `${(
                          (resumen.sinEfecto / resumen.total) *
                          100
                        ).toFixed(1)}%`
                      : '0%'
                  }
                  icon={MinusCircleIcon}
                  className="bg-amber-50 text-amber-700"
                />
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="search"
                    value={searchSocio}
                    onChange={(event) =>
                      setSearchSocio(event.target.value)
                    }
                    placeholder="Buscar socio..."
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <select
                  value={filterEstado}
                  onChange={(event) =>
                    setFilterEstado(event.target.value)
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                >
                  <option value="TODOS">Todos</option>
                  <option value="ASISTIO">Asistieron</option>
                  <option value="FALTA">Faltaron</option>
                  <option value="SIN_EFECTO">Sin efecto</option>
                </select>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <TableHead>Socio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Observación</TableHead>
                      <TableHead>Registrado por</TableHead>
                      <TableHead />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {asistenciasFiltradas.map((asistencia) => {
                      const estado = estadoStyles[asistencia.estado];

                      return (
                        <tr key={asistencia.id}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-black text-emerald-700">
                                {getInitials(asistencia.nombre_completo)}
                              </div>

                              <div>
                                <p className="font-bold text-slate-900">
                                  {asistencia.nombre_completo}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {asistencia.codigo}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${estado.className}`}
                            >
                              {estado.label}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-500">
                            {asistencia.observacion || '—'}
                          </td>

                          <td className="px-4 py-4">
                            <p className="text-sm font-semibold text-slate-700">
                              {asistencia.registrado_por}
                            </p>

                            <p className="text-xs text-slate-500">
                              {formatDateTime(asistencia.fecha_registro)}
                            </p>
                          </td>

                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                openAttendanceDrawer(asistencia)
                              }
                              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>

      {showDrawer && selectedAsistencia && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                Editar asistencia
              </h2>

              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 font-black text-emerald-700">
                {getInitials(selectedAsistencia.nombre_completo)}
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  {selectedAsistencia.nombre_completo}
                </p>

                <p className="text-sm text-slate-500">
                  {selectedAsistencia.codigo}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <label className="text-sm font-bold text-slate-700">
                Estado de asistencia
              </label>

              <div className="mt-3 grid grid-cols-3 gap-3">
                <AttendanceOption
                  label="Asistió"
                  value="ASISTIO"
                  selected={attendanceForm.estado === 'ASISTIO'}
                  icon={CheckCircleIcon}
                  onClick={() =>
                    setAttendanceForm((previous) => ({
                      ...previous,
                      estado: 'ASISTIO',
                    }))
                  }
                />

                <AttendanceOption
                  label="Faltó"
                  value="FALTA"
                  selected={attendanceForm.estado === 'FALTA'}
                  icon={XCircleIcon}
                  onClick={() =>
                    setAttendanceForm((previous) => ({
                      ...previous,
                      estado: 'FALTA',
                    }))
                  }
                />

                <AttendanceOption
                  label="Sin efecto"
                  value="SIN_EFECTO"
                  selected={attendanceForm.estado === 'SIN_EFECTO'}
                  icon={MinusCircleIcon}
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
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Observación
              </label>

              <textarea
                rows={4}
                value={attendanceForm.observacion}
                onChange={(event) =>
                  setAttendanceForm((previous) => ({
                    ...previous,
                    observacion: event.target.value,
                  }))
                }
                className="w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <label className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <span className="font-bold text-slate-700">
                Justificado
              </span>

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
            </label>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={saveAttendance}
                className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <form
            onSubmit={createMeeting}
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                Nueva reunión
              </h2>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl p-2 hover:bg-slate-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <FormField label="Título" className="md:col-span-2">
                <input
                  required
                  value={meetingForm.titulo}
                  onChange={(event) =>
                    setMeetingForm((previous) => ({
                      ...previous,
                      titulo: event.target.value,
                    }))
                  }
                  className="input-control"
                />
              </FormField>

              <FormField label="Fecha">
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
                  className="input-control"
                />
              </FormField>

              <FormField label="Lugar">
                <input
                  required
                  value={meetingForm.lugar}
                  onChange={(event) =>
                    setMeetingForm((previous) => ({
                      ...previous,
                      lugar: event.target.value,
                    }))
                  }
                  className="input-control"
                />
              </FormField>

              <FormField label="Hora de inicio">
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
                  className="input-control"
                />
              </FormField>

              <FormField label="Hora de finalización">
                <input
                  required
                  type="time"
                  value={meetingForm.hora_final}
                  onChange={(event) =>
                    setMeetingForm((previous) => ({
                      ...previous,
                      hora_final: event.target.value,
                    }))
                  }
                  className="input-control"
                />
              </FormField>

              <FormField label="Monto de multa">
                <input
                  type="number"
                  min="0"
                  value={meetingForm.monto_multa}
                  onChange={(event) =>
                    setMeetingForm((previous) => ({
                      ...previous,
                      monto_multa: event.target.value,
                    }))
                  }
                  className="input-control"
                />
              </FormField>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800"
              >
                Crear reunión
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-6 w-6 text-slate-600" />

      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-bold text-slate-900">{value || '-'}</p>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  percentage,
  icon: Icon,
  className,
}) {
  return (
    <div className={`rounded-2xl p-5 ${className}`}>
      <div className="flex items-center gap-3">
        <Icon className="h-8 w-8" />

        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-2xl font-black">{value}</p>
          <p className="text-xs font-bold">{percentage}</p>
        </div>
      </div>
    </div>
  );
}

function AttendanceOption({
  label,
  selected,
  icon: Icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-center transition ${
        selected
          ? 'border-emerald-700 bg-emerald-50 text-emerald-700'
          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon className="mx-auto h-8 w-8" />
      <p className="mt-2 text-xs font-bold">{label}</p>
    </button>
  );
}

function TableHead({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-black text-slate-900">
        {value || '-'}
      </p>
    </div>
  );
}

function FormField({ label, children, className = '' }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      {children}
    </label>
  );
}