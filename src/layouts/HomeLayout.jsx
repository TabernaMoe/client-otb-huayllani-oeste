import { useNavigate } from 'react-router';
import Logo from '/logo-otb.webp';

const committee = [
  {
    name: 'Juan Pérez',
    role: 'Presidente',
    phone: '70000001',
  },
  {
    name: 'María López',
    role: 'Vicepresidenta',
    phone: '70000002',
  },
  {
    name: 'Carlos Mamani',
    role: 'Secretario de actas',
    phone: '70000003',
  },
  {
    name: 'Carlos Mamani',
    role: 'Secretario de actas',
    phone: '70000003',
  },
  {
    name: 'Carlos Mamani',
    role: 'Secretario de actas',
    phone: '70000003',
  },
];

const news = [
  {
    title: 'Mantenimiento de áreas verdes',
    date: '20 Abril 2026',
    description:
      'Se realizará una jornada de limpieza y mantenimiento en los espacios comunes del barrio.',
  },
  {
    title: 'Reunión general de vecinos',
    date: '25 Abril 2026',
    description:
      'Convocamos a todos los vecinos a participar de la reunión general en la sede de la OTB.',
  },
  {
    title: 'Mejoras en alumbrado público',
    date: '30 Abril 2026',
    description:
      'Se gestionó la instalación de nuevas luminarias en sectores prioritarios.',
  },
];

const announcements = [
  'El pago de aportes vecinales estará habilitado hasta fin de mes.',
  'Se solicita actualizar los datos personales de cada vecino.',
  'La atención en oficina será de lunes a viernes de 18:00 a 20:00.',
];

export default function HomePage() {
  const navigate = useNavigate();

  const goLogin = () => {
    navigate('/login');
  };
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Logo OTB"
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                OTB Huayllani Oeste
              </h1>
              <p className="text-xs text-slate-500">Gestión vecinal digital</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#comite" className="hover:text-sky-800">
              Comité
            </a>
            <a href="#noticias" className="hover:text-sky-800">
              Noticias
            </a>
            <a href="#comunicados" className="hover:text-sky-800">
              Comunicados
            </a>
            <a
              href="/login"
              className="rounded-xl bg-sky-800 px-5 py-2 text-white hover:bg-sky-900"
              onClick={goLogin}
            >
              Ingresar
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-red-950 via-sky-800 to-red-600">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <div className="text-white">
            <h2 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
              Comunidad organizada, moderna y conectada.
            </h2>

            <p className="mt-6 max-w-xl text-lg text-white/80">
              Consulta noticias, comunicados, información del comité y accede a
              servicios digitales de la OTB Huayllani Oeste.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/login"
                className="rounded-2xl bg-white px-6 py-3 text-center font-semibold text-sky-900 shadow-lg hover:bg-slate-100"
              >
                Ingresar al sistema
              </a>

              <a
                href="#noticias"
                className="rounded-2xl border border-white/30 px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
              >
                Ver noticias
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="rounded-4xl bg-white/10 p-6 shadow-2xl backdrop-blur ring-1 ring-white/20">
              <div className="rounded-3xl bg-white p-8">
                <img
                  src={Logo}
                  alt="Logo OTB"
                  className="h-72 w-72 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comité */}
      <section id="comite" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-800">
            Representantes
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Comité de la OTB
          </h2>
          <p className="mt-3 text-slate-500">
            Conoce a los responsables de la gestión vecinal.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {committee.map((member) => (
            <div
              key={member.name}
              className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-2xl font-bold text-sky-800">
                {member.name.charAt(0)}
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {member.name}
              </h3>

              <p className="mt-1 font-medium text-sky-800">{member.role}</p>

              <p className="mt-4 text-sm text-slate-500">
                Contacto: {member.phone}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Noticias */}
      <section id="noticias" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-sky-800">
                Actualidad
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Últimas noticias
              </h2>
            </div>

            <a
              href="#"
              className="font-semibold text-sky-800 hover:text-sky-900"
            >
              Ver todas →
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-40 bg-linear-to-br from-sky-900 to-red-600" />

                <div className="p-6">
                  <p className="text-sm font-medium text-sky-800">
                    {item.date}
                  </p>

                  <h3 className="mt-3 text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comunicados */}
      <section id="comunicados" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-2xl bg-slate-900 p-8 text-white md:p-12">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-300">
              Información importante
            </p>
            <h2 className="mt-2 text-3xl font-bold">Comunicados</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {announcements.map((item, index) => (
              <div
                key={item}
                className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-700 font-bold">
                  {index + 1}
                </span>

                <p className="text-sm leading-6 text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row">
          <p>© 2026 OTB Huayllani Oeste. Todos los derechos reservados.</p>
          <p>Desarrollado para gestión vecinal digital.</p>
        </div>
      </footer>
    </main>
  );
}
