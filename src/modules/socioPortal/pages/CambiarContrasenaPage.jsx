import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../auth/services/auth.services';
import { SocioPortalServices } from '../services/socioPortal.services';

export default function CambiarContrasenaPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ contrasenia_actual: '', contrasenia_nueva: '', confirmar: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.contrasenia_nueva !== form.confirmar) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    try {
      setLoading(true);
      await SocioPortalServices.cambiarPassword({
        contrasenia_actual: form.contrasenia_actual,
        contrasenia_nueva: form.contrasenia_nueva,
      });
      AuthService.updateSession({ debe_cambiar_password: false });
      navigate('/socio/inicio', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl">
      <form onSubmit={submit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black">Cambiar contraseña</h1>
          <p className="mt-1 text-sm text-slate-500">Por seguridad, cambia la contraseña inicial antes de continuar.</p>
        </div>
        {error && <div className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
        {[
          ['contrasenia_actual', 'Contraseña actual'],
          ['contrasenia_nueva', 'Nueva contraseña'],
          ['confirmar', 'Confirmar nueva contraseña'],
        ].map(([name, label]) => (
          <label key={name} className="block">
            <span className="mb-1 block text-sm font-bold text-slate-700">{label}</span>
            <input
              type="password"
              value={form[name]}
              onChange={(e) => setForm((current) => ({ ...current, [name]: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
              required
            />
          </label>
        ))}
        <button disabled={loading} className="w-full rounded-2xl bg-emerald-700 px-4 py-3 font-bold text-white disabled:opacity-60">
          {loading ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </section>
  );
}
