import { useState } from 'react';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { SocioServices as Servs } from '../../services/socio.services';

export default function PagoPage() {
  // =========================
  // STATES
  // =========================

  // Guarda lo que escribes para buscar
  const [idSocio, setIdSocio] = useState('');

  // Guarda el socio encontrado
  const [socio, setSocio] = useState(null);

  // Loading de búsqueda
  const [loading, setLoading] = useState(false);

  // Datos del pago
  const [formPago, setFormPago] = useState({
    monto: '',
    metodo_pago: 'EFECTIVO',
    observacion: '',
  });

  // =========================
  // BUSCAR SOCIO
  // =========================

  const handleBuscarSocio = async () => {
    try {
      if (!idSocio) {
        toast.warning('Ingrese el ID del socio');
        return;
      }

      setLoading(true);

      const response = await Servs.getId(idSocio);

      if (!response.ok) {
        toast.error(response.message || 'Socio no encontrado');
        setSocio(null);
        return;
      }

      setSocio(response.dato);
      toast.success('Socio encontrado');
    } catch (error) {
      toast.error(error.message || 'Error al buscar socio');
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CAMBIAR FORM PAGO
  // =========================

  const handleChangePago = (e) => {
    const { name, value } = e.target;

    setFormPago((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // REGISTRAR PAGO
  // =========================

  const handleRegistrarPago = async (e) => {
    e.preventDefault();

    if (!socio) {
      toast.warning('Primero debe buscar un socio');
      return;
    }

    const payload = {
      socio_id: socio.id,
      monto: Number(formPago.monto),
      metodo_pago: formPago.metodo_pago,
      observacion: formPago.observacion,
    };

    console.log('Payload pago:', payload);

    toast.success('Aquí ya llamarías al servicio de pago');
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Registrar pago
        </h1>
        <p className="text-sm text-slate-500">
          Busque un socio por ID para registrar su pago.
        </p>
      </div>

      {/* BUSCADOR */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Buscar socio por ID
        </label>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="number"
              value={idSocio}
              onChange={(e) => setIdSocio(e.target.value)}
              placeholder="Ej. 1"
              className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-3"
            />
          </div>

          <button
            type="button"
            onClick={handleBuscarSocio}
            disabled={loading}
            className="rounded-xl bg-emerald-800 px-6 py-2 text-white hover:bg-emerald-900 disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {/* DATOS DEL SOCIO */}
      {socio && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-800">
            Datos del socio
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">ID socio</p>
              <p className="font-semibold">{socio.id}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">CI</p>
              <p className="font-semibold">
                {socio.ci_socio} {socio.ci_expedido_socio}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Nombre completo</p>
              <p className="font-semibold">
                {socio.nombres_socio} {socio.primer_apellido_socio}{' '}
                {socio.segundo_apellido_socio}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Celular</p>
              <p className="font-semibold">{socio.numero_celular_socio}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Estado acción</p>
              <p className="font-semibold">{socio.estado_accion}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Dirección</p>
              <p className="font-semibold">{socio.direccion_socio}</p>
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO PAGO */}
      <form
        onSubmit={handleRegistrarPago}
        className="rounded-2xl border bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Datos del pago
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Monto
            </label>
            <input
              type="number"
              name="monto"
              value={formPago.monto}
              onChange={handleChangePago}
              placeholder="Ej. 50"
              className="w-full rounded-xl border p-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Método de pago
            </label>
            <select
              name="metodo_pago"
              value={formPago.metodo_pago}
              onChange={handleChangePago}
              className="w-full rounded-xl border p-2"
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="QR">QR</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Observación
            </label>
            <input
              type="text"
              name="observacion"
              value={formPago.observacion}
              onChange={handleChangePago}
              placeholder="Opcional"
              className="w-full rounded-xl border p-2"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={!socio}
            className="rounded-xl bg-emerald-800 px-8 py-2 text-white hover:bg-emerald-900 disabled:opacity-50"
          >
            Registrar pago
          </button>
        </div>
      </form>
    </div>
  );
}