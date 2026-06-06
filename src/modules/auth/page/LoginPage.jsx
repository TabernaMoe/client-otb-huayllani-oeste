import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import InputField from '../../../components/InputField';
import PasswordField from '../../../components/PasswordField';
import Logo from '/logo-otb.webp';
import { AuthService } from '../services/auth.services';

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    user: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError('');

    if (!form.user.trim() || !form.password.trim()) {
      setError('Debe ingresar usuario y contraseña');
      return;
    }

    try {
      setLoading(true);
/*
      const data = await AuthService.login({
        user: form.user.trim(),
        password: form.password.trim(),
      });

      console.log('Respuesta del backend:', data);

      if (!data.ok) {
        setError(data.message || 'Credenciales incorrectas');
        return;
      }
*/

const data = await AuthService.login({
  user: form.user.trim(),
  password: form.password.trim(),
});

console.log('Respuesta del backend:', data);

// MODO DESARROLLO
if (!data.ok) {
  if (import.meta.env.DEV && form.user === 'admin') {
    AuthService.saveSession({
      token: 'dev-token',
      user: {
        id: 1,
        nombre_usuario: 'admin',
        estado: true,
        rol: {
          id: 1,
          nombre_rol: 'ADMIN',
          permisos: [
            { codigo_permiso: 'USUARIOS_READ' },
            { codigo_permiso: 'ROLES_READ' },
            { codigo_permiso: 'GESTIONES_READ' },
            { codigo_permiso: 'CALLES_READ' },
            { codigo_permiso: 'TARIFAS_READ' },
            { codigo_permiso: 'DETALLE_ACCION_READ' },
            { codigo_permiso: 'SOCIOS_READ' },
            { codigo_permiso: 'ACCIONES_READ' },
          ],
        },
      },
    });

    navigate('/admin', { replace: true });
    return;
  }

  setError(data.message || 'Credenciales incorrectas');
  return;
}
      const user = data.user || data.usuario;

      if (user?.habilitado === false || user?.estado === false) {
        setError('Usuario deshabilitado');
        return;
      }

      AuthService.saveSession(data);

      navigate('/cliente/socios', { replace: true });
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-100">
      <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50">
              <img
                src={Logo}
                alt="Logo OTB Huayllani Oeste"
                className="h-16 w-16 object-contain"
              />
            </div>

            <h1 className="text-3xl font-bold text-slate-800">
              Iniciar sesión
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Bienvenido al sistema de la OTB Huayllani Oeste
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <InputField
              label="Código de usuario"
              placeholder="Ej. 123"
              name="user"
              value={form.user}
              onChange={handleChange}
            />

            <PasswordField
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-red-800 py-3 font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-red-400"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Acceso exclusivo para vecinos registrados
          </p>
        </form>
      </div>

      <div className="relative hidden items-center justify-center overflow-hidden bg-linear-to-br from-red-950 via-red-800 to-red-600 lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="relative z-10 mx-10 max-w-md rounded-3xl bg-white/10 p-10 text-center text-white shadow-2xl ring-1 ring-white/20 backdrop-blur-md">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-3xl bg-white p-4 shadow-xl">
            <img
              src={Logo}
              alt="Logo OTB Huayllani Oeste"
              className="h-full w-full object-contain"
            />
          </div>

          <h2 className="text-4xl font-bold">Huayllani Oeste</h2>

          <p className="mt-4 text-sm leading-6 text-white/80">
            Plataforma digital para la gestión vecinal, pagos, comunicados y
            administración de la OTB.
          </p>
        </div>
      </div>
    </div>
  );
}