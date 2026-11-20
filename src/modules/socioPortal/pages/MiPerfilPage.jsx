import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { KeyIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import PortalPageHeader from '../components/PortalPageHeader';
import { PortalError, PortalLoading } from '../components/PortalFeedback';
import { editarPerfilSchema } from '../schemas/socioPortal.schema';
import { SocioPortalServices } from '../services/socioPortal.services';

export default function MiPerfilPage() {
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({ numero_celular: '', direccion: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    SocioPortalServices.getPerfil()
      .then((response) => {
        const data = response?.data ?? response;
        setPerfil(data);
        setForm({
          numero_celular: data?.numero_celular || '',
          direccion: data?.direccion || '',
        });
      })
      .catch((err) =>
        setError(err.response?.data?.message || 'No se pudo cargar tu perfil'),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({});
    setError('');

    const parsed = editarPerfilSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors = {};
      for (const issue of parsed.error.issues) {
        nextErrors[issue.path[0]] = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    try {
      setSaving(true);
      const response = await SocioPortalServices.updatePerfil(parsed.data);
      const updated = response?.data ?? { ...perfil, ...parsed.data };
      setPerfil(updated);
      toast.success('Datos de contacto actualizados');
    } catch (err) {
      setError(
        err.response?.data?.message || 'No se pudieron guardar los cambios',
      );
    } finally {
      setSaving(false);
    }
  };

  const nombreCompleto = perfil
    ? `${perfil.nombres || ''} ${perfil.primer_apellido || ''} ${perfil.segundo_apellido || ''}`.trim()
    : '';

  return (
    <section className="space-y-6">
      <PortalPageHeader
        title="Mi perfil"
        description="Consulta tus datos registrados y mantén actualizada tu información de contacto."
        action={
          <Link
            to="/socio/cambiar-contrasena"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <KeyIcon className="h-4 w-4" />
            Cambiar contraseña
          </Link>
        }
      />

      <PortalError message={error} />

      {loading ? (
        <PortalLoading text="Cargando perfil..." />
      ) : (
        perfil && (
          <div className="grid gap-6 lg:grid-cols-5">
            <article className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <UserCircleIcon className="h-9 w-9" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {nombreCompleto || 'Socio'}
                  </h2>
                  <p className="text-sm font-medium text-slate-500">
                    CI: {perfil.ci_socio} {perfil.ci_expedido || ''}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Nombres', perfil.nombres],
                  ['Primer apellido', perfil.primer_apellido],
                  ['Segundo apellido', perfil.segundo_apellido],
                  ['Género', perfil.genero],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 font-bold text-slate-900">{value || '—'}</p>
                  </div>
                ))}
              </div>
            </article>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
            >
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Datos de contacto
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Puedes actualizar tu número de celular y dirección.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Número de celular
                </label>
                <input
                  type="text"
                  value={form.numero_celular}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, numero_celular: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                />
                {fieldErrors.numero_celular && (
                  <p className="mt-1 text-xs font-semibold text-rose-600">
                    {fieldErrors.numero_celular}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Dirección
                </label>
                <textarea
                  rows={3}
                  value={form.direccion}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, direccion: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
                />
                {fieldErrors.direccion && (
                  <p className="mt-1 text-xs font-semibold text-rose-600">
                    {fieldErrors.direccion}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        )
      )}
    </section>
  );
}
