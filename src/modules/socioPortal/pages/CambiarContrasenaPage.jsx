import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

import { useAuth } from '../../auth/context/AuthContext';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { zodErrors } from '../../../utils/zodErrors';
import { PortalError } from '../components/PortalFeedback';
import { cambiarContrasenaSchema } from '../schemas/socioPortal.schema';
import { SocioPortalServices } from '../services/socioPortal.services';

const FIELDS = [
  { name: 'contrasenia_actual', label: 'Contraseña actual' },
  { name: 'contrasenia_nueva', label: 'Nueva contraseña (mín. 8 caracteres)' },
  { name: 'confirmar', label: 'Confirmar nueva contraseña' },
];

export default function CambiarContrasenaPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [form, setForm] = useState({
    contrasenia_actual: '',
    contrasenia_nueva: '',
    confirmar: '',
  });
  const [visible, setVisible] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const { submitting, run } = useAsyncSubmit();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});

    const parsed = cambiarContrasenaSchema.safeParse(form);
    if (!parsed.success) {
      setFieldErrors(zodErrors(parsed.error));
      return;
    }

    await run(
      () =>
        SocioPortalServices.cambiarPassword({
          contrasenia_actual: parsed.data.contrasenia_actual,
          contrasenia_nueva: parsed.data.contrasenia_nueva,
        }),
      {
        successMessage: 'Contraseña actualizada correctamente',
        errorMessage: 'No se pudo cambiar la contraseña',
        onError: (res) => {
          setError(res?.message || 'No se pudo cambiar la contraseña');
        },
        onSuccess: () => {
          updateUser({ debe_cambiar_password: false });
          navigate('/socio/inicio', { replace: true });
        },
      },
    );
  };

  return (
    <section className="mx-auto max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Cambiar contraseña
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Usa una contraseña segura de al menos 8 caracteres para proteger tu cuenta.
            </p>
          </div>
        </div>

        <PortalError message={error} />

        {FIELDS.map(({ name, label }) => {
          const isVisible = Boolean(visible[name]);
          return (
            <div key={name}>
              <label className="mb-1 block text-sm font-bold text-slate-700">
                {label}
              </label>
              <div className="relative">
                <input
                  type={isVisible ? 'text' : 'password'}
                  value={form[name]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [name]: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 pr-11 text-sm outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={() =>
                    setVisible((prev) => ({ ...prev, [name]: !prev[name] }))
                  }
                  aria-label="Mostrar u ocultar contraseña"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-700"
                >
                  {isVisible ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {fieldErrors[name] && (
                <p className="mt-1 text-xs font-semibold text-rose-600">
                  {fieldErrors[name]}
                </p>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
        >
          {submitting ? 'Guardando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </section>
  );
}
