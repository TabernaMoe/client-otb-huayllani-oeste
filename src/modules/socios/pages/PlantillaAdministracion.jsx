import SocioPage from './SocioPage';

export default function PlanillaAdministracion() {
  return (
    <section className="min-h-screen bg-slate-50">
      <div className="space-y-5">

        {/* ================= ENCABEZADO ================= */}

        <header>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>
              Inicio
            </span>

            <span>/</span>

            <span>
              Administración
            </span>

            <span>/</span>

            <span className="text-emerald-700">
              Socios
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Administración de socios
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gestiona la información
            y estado de los socios registrados.
          </p>
        </header>

        {/* ================= SOCIOS ================= */}

        <SocioPage />
      </div>
    </section>
  );
}