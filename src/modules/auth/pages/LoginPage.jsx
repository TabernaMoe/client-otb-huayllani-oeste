import InputField from '../../../components/InputField';
import PasswordField from '../../../components/PasswordField';
import Logo from '/logo-otb.webp';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-slate-100">
      {/* Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200">
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

          <div className="space-y-5">
            <InputField label="Código de usuario" placeholder="Ej. 102030" />

            <PasswordField
              label="Contraseña"
              placeholder="Ingrese su contraseña"
            />

            <button className="mt-2 w-full rounded-2xl bg-red-800 py-3 font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-900 active:scale-[0.98]">
              Iniciar sesión
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Acceso exclusivo para vecinos registrados
          </p>
        </div>
      </div>

      {/* Panel visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-linear-to-br from-red-950 via-red-800 to-red-600">
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="relative z-10 mx-10 max-w-md rounded-3xl bg-white/10 p-10 text-center text-white shadow-2xl backdrop-blur-md ring-1 ring-white/20">
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
