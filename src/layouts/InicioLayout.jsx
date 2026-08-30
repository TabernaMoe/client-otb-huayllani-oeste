import { useState } from 'react';

import {
  ArrowRightIcon,
  BanknotesIcon,
  Bars3Icon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon,
  EnvelopeIcon,
  HomeModernIcon,
  MapPinIcon,
  MegaphoneIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

/**
 * ============================================================
 * DATOS DE ACCESO RÁPIDO
 * ============================================================
 */

const accesos = [
  {
    title: 'Servicio de agua',
    description: 'Consultas, avisos y mantenimiento del servicio.',
    icon: WrenchScrewdriverIcon,
  },
  {
    title: 'Comunicados',
    description: 'Mantente informado con los últimos avisos.',
    icon: MegaphoneIcon,
  },
  {
    title: 'Actividades',
    description: 'Reuniones, campañas y eventos comunitarios.',
    icon: CalendarDaysIcon,
  },
  {
    title: 'Transparencia',
    description: 'Informes, proyectos y rendición de cuentas.',
    icon: DocumentChartBarIcon,
  },
];

/**
 * ============================================================
 * COMUNICADOS
 * ============================================================
 */

const comunicados = [
  {
    id: 1,
    tipo: 'Servicio de agua',
    titulo: 'Corte programado de agua',
    fecha: '29 de agosto de 2026',
    descripcion:
      'Se comunica a todos los vecinos que se realizará un corte programado por trabajos de mantenimiento.',
  },
  {
    id: 2,
    tipo: 'Reunión',
    titulo: 'Reunión general de vecinos',
    fecha: '31 de agosto de 2026',
    descripcion:
      'Se convoca a todos los socios y vecinos a participar de la próxima reunión general de nuestra OTB.',
  },
  {
    id: 3,
    tipo: 'Comunicado',
    titulo: 'Actualización de datos de socios',
    fecha: '27 de agosto de 2026',
    descripcion:
      'Solicitamos a los socios actualizar sus datos personales para mantener nuestros registros al día.',
  },
];

/**
 * ============================================================
 * ACTIVIDADES
 * ============================================================
 */

const actividades = [
  {
    id: 1,
    dia: '31',
    mes: 'AGO',
    titulo: 'Reunión general de vecinos',
    hora: '19:00',
    lugar: 'Sede de la OTB',
  },
  {
    id: 2,
    dia: '05',
    mes: 'SEP',
    titulo: 'Limpieza comunitaria',
    hora: '08:00',
    lugar: 'Plaza principal',
  },
  {
    id: 3,
    dia: '12',
    mes: 'SEP',
    titulo: 'Mantenimiento del sistema de agua',
    hora: '07:30',
    lugar: 'Tanque principal',
  },
];

/**
 * ============================================================
 * DIRECTIVA
 * ============================================================
 */

const directiva = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    cargo: 'Presidente',
    iniciales: 'JP',
  },
  {
    id: 2,
    nombre: 'María López',
    cargo: 'Vicepresidenta',
    iniciales: 'ML',
  },
  {
    id: 3,
    nombre: 'Carlos Flores',
    cargo: 'Secretario de Hacienda',
    iniciales: 'CF',
  },
  {
    id: 4,
    nombre: 'Ana Vargas',
    cargo: 'Secretaria de Actas',
    iniciales: 'AV',
  },
];

/**
 * ============================================================
 * MENÚ
 * ============================================================
 */

const menuItems = [
  {
    label: 'Inicio',
    href: '#inicio',
  },
  {
    label: 'Nosotros',
    href: '#nosotros',
  },
  {
    label: 'Servicios',
    href: '#servicios',
  },
  {
    label: 'Comunicados',
    href: '#comunicados',
  },
  {
    label: 'Transparencia',
    href: '#transparencia',
  },
  {
    label: 'Contacto',
    href: '#contacto',
  },
];

/**
 * ============================================================
 * COMPONENTE PRINCIPAL
 * ============================================================
 */

export default function InicioOTB() {
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * ==========================================================
   * SCROLL HACIA UNA SECCIÓN
   * ==========================================================
   */

  const handleNavigation = () => {
    setMenuOpen(false);
  };

  /**
   * ==========================================================
   * INGRESAR AL SISTEMA
   * ==========================================================
   *
   * Puedes cambiar "/login" por la ruta que utilice
   * tu proyecto.
   */

  const handleIngresar = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          {/* LOGO */}

          <a
            href="#inicio"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-md shadow-sky-600/20">
              <HomeModernIcon className="h-6 w-6" />
            </div>

            <div>
              <p className="font-black leading-none text-slate-900">
                OTB Villa Esperanza
              </p>

              <p className="mt-1 text-xs font-medium text-sky-600">
                Comunidad organizada
              </p>
            </div>
          </a>

          {/* MENÚ DESKTOP */}

          <nav className="hidden items-center gap-7 lg:flex">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-slate-600 transition hover:text-sky-600"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* BOTÓN INGRESAR */}

          <div className="hidden lg:block">
            <button
              type="button"
              onClick={handleIngresar}
              className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-600/20"
            >
              Ingresar
            </button>
          </div>

          {/* BOTÓN MENÚ MOBILE */}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* MENÚ MOBILE */}

        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-5 py-5 shadow-md lg:hidden">
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={handleNavigation}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-600"
                >
                  {item.label}
                </a>
              ))}

              <button
                type="button"
                onClick={handleIngresar}
                className="mt-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                Ingresar
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ======================================================
          HERO PRINCIPAL
      ====================================================== */}

      <section
        id="inicio"
        className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-sky-800 to-cyan-600"
      >
        {/* DECORACIONES */}

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />

        <div className="absolute left-1/2 top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          {/* TEXTO */}

          <div>
            <span className="inline-flex rounded-full border border-sky-300/30 bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100 backdrop-blur">
              Organización Territorial de Base
            </span>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Juntos construimos una mejor comunidad
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-sky-100">
              Información, servicios y comunicación directa para todos los
              vecinos de nuestra OTB.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#comunicados"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-sky-700 shadow-lg transition hover:bg-sky-50"
              >
                Ver comunicados

                <ArrowRightIcon className="h-5 w-5" />
              </a>

              <a
                href="#nosotros"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                Conoce nuestra OTB
              </a>
            </div>
          </div>

          {/* IMAGEN / MOCKUP */}

          <div className="relative">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur">
              <div className="flex min-h-[390px] items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-900">
                <div className="px-8 text-center text-white">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/10">
                    <HomeModernIcon className="h-20 w-20 text-sky-100" />
                  </div>

                  <p className="mt-6 text-2xl font-black">
                    Nuestra comunidad
                  </p>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-sky-100">
                    Aquí puedes colocar una fotografía representativa de tu OTB.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD FLOTANTE */}

            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-5 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-sky-100 p-3">
                  <UsersIcon className="h-6 w-6 text-sky-600" />
                </div>

                <div>
                  <p className="text-2xl font-black text-slate-900">
                    +400
                  </p>

                  <p className="text-xs text-slate-500">
                    Vecinos registrados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          ACCESOS RÁPIDOS
      ====================================================== */}

      <section
        id="servicios"
        className="relative z-10 mx-auto -mt-8 max-w-7xl px-5 lg:px-8"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {accesos.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-lg shadow-slate-200/50 transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-sm font-bold text-sky-600">
                  Ver más

                  <ArrowRightIcon className="h-4 w-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ======================================================
          COMUNICADOS
      ====================================================== */}

      <section
        id="comunicados"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-sky-600">
              Información
            </span>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Últimos comunicados
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500">
              Conoce los últimos avisos, noticias y novedades importantes de
              nuestra comunidad.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 font-bold text-sky-600 transition hover:text-sky-700"
          >
            Ver todos

            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {comunicados.map((comunicado) => (
            <article
              key={comunicado.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-600">
                  {comunicado.tipo}
                </span>

                <div className="rounded-lg bg-slate-50 p-2 text-slate-400 transition group-hover:bg-sky-50 group-hover:text-sky-600">
                  <MegaphoneIcon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-5 text-sm font-medium text-slate-400">
                {comunicado.fecha}
              </p>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                {comunicado.titulo}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {comunicado.descripcion}
              </p>

              <button
                type="button"
                className="mt-6 flex items-center gap-1 text-sm font-bold text-sky-600 transition hover:text-sky-700"
              >
                Leer comunicado

                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ======================================================
          NOSOTROS
      ====================================================== */}

      <section
        id="nosotros"
        className="scroll-mt-24 bg-slate-50 py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          {/* IMAGEN / BLOQUE */}

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 to-sky-950 p-10 text-white shadow-xl">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <HomeModernIcon className="h-9 w-9 text-sky-100" />
              </div>

              <h3 className="mt-8 text-3xl font-black">
                Una organización al servicio de nuestros vecinos
              </h3>

              <p className="mt-5 leading-7 text-sky-100">
                Promovemos la participación comunitaria, el mejoramiento de
                nuestros servicios y una gestión responsable y transparente.
              </p>
            </div>
          </div>

          {/* TEXTO */}

          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-sky-600">
              Nuestra OTB
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Trabajamos juntos por nuestra comunidad
            </h2>

            <p className="mt-6 leading-7 text-slate-500">
              Nuestra Organización Territorial de Base trabaja por el bienestar
              y desarrollo de la zona, promoviendo la participación vecinal,
              una administración transparente y la mejora constante de los
              servicios comunitarios.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <p className="text-3xl font-black text-sky-600">
                  +400
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Socios
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <p className="text-3xl font-black text-sky-600">
                  15
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Años
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <p className="text-3xl font-black text-sky-600">
                  12
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Proyectos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          SERVICIO DE AGUA
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky-950 via-sky-800 to-cyan-600 text-white shadow-xl">
          <div className="grid gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            {/* INFORMACIÓN */}

            <div>
              <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100">
                Servicio comunitario
              </span>

              <h2 className="mt-6 text-3xl font-black sm:text-4xl">
                Servicio de agua
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-sky-100">
                Consulta información importante relacionada con el servicio de
                agua de nuestra comunidad.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Fechas de cobro',
                  'Comunicados del servicio',
                  'Cortes programados',
                  'Mantenimiento',
                  'Información de tarifas',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <div className="rounded-full bg-white/10 p-1">
                      <CheckCircleIcon className="h-5 w-5 text-cyan-200" />
                    </div>

                    <span className="text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-8 rounded-xl bg-white px-6 py-3 font-bold text-sky-700 shadow-lg transition hover:bg-sky-50"
              >
                Más información
              </button>
            </div>

            {/* CONSULTA DE DEUDA */}

            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-7 shadow-xl backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <WrenchScrewdriverIcon className="h-6 w-6 text-sky-100" />
                </div>

                <p className="mt-6 text-sm text-sky-200">
                  Consulta rápida
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Consulta tu deuda de agua
                </h3>

                <p className="mt-3 text-sm leading-6 text-sky-100">
                  Ingresa tu número de acción o número de medidor.
                </p>

                <input
                  type="text"
                  placeholder="Ej. ACC-001 o MED-001"
                  className="mt-6 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-sky-200/60 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
                />

                <button
                  type="button"
                  className="mt-3 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-sky-950 shadow-sm transition hover:bg-cyan-300"
                >
                  Consultar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          PRÓXIMAS ACTIVIDADES
      ====================================================== */}

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-sky-600">
              Comunidad
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Próximas actividades
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              Participa en las actividades programadas para nuestra comunidad.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl space-y-4">
            {actividades.map((actividad) => (
              <article
                key={actividad.id}
                className="group flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md sm:flex-row sm:items-center"
              >
                {/* FECHA */}

                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/20">
                  <span className="text-2xl font-black">
                    {actividad.dia}
                  </span>

                  <span className="text-xs font-bold">
                    {actividad.mes}
                  </span>
                </div>

                {/* INFO */}

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {actividad.titulo}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <CalendarDaysIcon className="h-4 w-4 text-sky-500" />

                      {actividad.hora}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4 text-sky-500" />

                      {actividad.lugar}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-sky-500 hover:bg-sky-50 hover:text-sky-600"
                >
                  Ver detalle
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          TRANSPARENCIA
      ====================================================== */}

      <section
        id="transparencia"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 lg:px-8"
      >
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-sky-600">
            Gestión responsable
          </span>

          <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
            Transparencia y gestión
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Consulta información relacionada con la administración, recursos,
            proyectos y gestión de nuestra comunidad.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* REPORTES */}

          <button
            type="button"
            className="group rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 transition group-hover:bg-sky-600">
              <DocumentChartBarIcon className="h-6 w-6 text-sky-600 transition group-hover:text-white" />
            </div>

            <h3 className="mt-5 font-bold text-slate-900">
              Reportes
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Consulta reportes públicos correspondientes a la gestión.
            </p>
          </button>

          {/* RENDICIÓN */}

          <button
            type="button"
            className="group rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 transition group-hover:bg-sky-600">
              <BanknotesIcon className="h-6 w-6 text-sky-600 transition group-hover:text-white" />
            </div>

            <h3 className="mt-5 font-bold text-slate-900">
              Rendición de cuentas
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Información relacionada con ingresos, egresos y administración.
            </p>
          </button>

          {/* PROYECTOS */}

          <button
            type="button"
            className="group rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 transition group-hover:bg-sky-600">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-sky-600 transition group-hover:text-white" />
            </div>

            <h3 className="mt-5 font-bold text-slate-900">
              Proyectos
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Conoce los proyectos realizados y planificados para la comunidad.
            </p>
          </button>

          {/* GESTIÓN */}

          <button
            type="button"
            className="group rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 transition group-hover:bg-sky-600">
              <ShieldCheckIcon className="h-6 w-6 text-sky-600 transition group-hover:text-white" />
            </div>

            <h3 className="mt-5 font-bold text-slate-900">
              Gestión actual
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Información institucional correspondiente a la gestión vigente.
            </p>
          </button>
        </div>
      </section>

      {/* ======================================================
          DIRECTIVA
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-sky-900 to-sky-800 py-24 text-white">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sky-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-sky-300">
              Representantes
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Nuestra directiva
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sky-100">
              Conoce a los representantes responsables de nuestra gestión
              comunitaria.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {directiva.map((persona) => (
              <article
                key={persona.id}
                className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/10 bg-sky-500 text-xl font-black shadow-lg">
                  {persona.iniciales}
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {persona.nombre}
                </h3>

                <p className="mt-1 text-sm text-sky-200">
                  {persona.cargo}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTACTO
      ====================================================== */}

      <section
        id="contacto"
        className="scroll-mt-24 bg-slate-50 py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:px-8">
          {/* INFORMACIÓN DE CONTACTO */}

          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-sky-600">
              Contacto
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              ¿Necesitas comunicarte con nosotros?
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-500">
              Puedes comunicarte con nuestra directiva o acudir a nuestras
              oficinas durante nuestros horarios de atención.
            </p>

            <div className="mt-9 space-y-5">
              {/* DIRECCIÓN */}

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-sky-100 p-3">
                  <MapPinIcon className="h-6 w-6 text-sky-600" />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Sede OTB Villa Esperanza
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Cochabamba, Bolivia
                  </p>
                </div>
              </div>

              {/* TELÉFONO */}

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-sky-100 p-3">
                  <PhoneIcon className="h-6 w-6 text-sky-600" />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    +591 70000000
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Lunes a viernes, 18:00 - 20:00
                  </p>
                </div>
              </div>

              {/* CORREO */}

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-sky-100 p-3">
                  <EnvelopeIcon className="h-6 w-6 text-sky-600" />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    contacto@otb.com
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Correo institucional
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}

          <form
            onSubmit={(event) => event.preventDefault()}
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50">
              <EnvelopeIcon className="h-6 w-6 text-sky-600" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Envíanos un mensaje
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Completa el formulario y nos pondremos en contacto contigo.
            </p>

            <div className="mt-7 grid gap-5">
              {/* NOMBRE */}

              <div>
                <label
                  htmlFor="nombre"
                  className="text-sm font-semibold text-slate-700"
                >
                  Nombre completo
                </label>

                <input
                  id="nombre"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                />
              </div>

              {/* TELÉFONO */}

              <div>
                <label
                  htmlFor="telefono"
                  className="text-sm font-semibold text-slate-700"
                >
                  Teléfono
                </label>

                <input
                  id="telefono"
                  type="text"
                  placeholder="Ej. 70000000"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                />
              </div>

              {/* MENSAJE */}

              <div>
                <label
                  htmlFor="mensaje"
                  className="text-sm font-semibold text-slate-700"
                >
                  Mensaje
                </label>

                <textarea
                  id="mensaje"
                  rows="5"
                  placeholder="Escribe tu mensaje..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-sky-600 px-5 py-3.5 font-bold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-600/20"
              >
                Enviar mensaje
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {/* OTB */}

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600">
                <HomeModernIcon className="h-6 w-6 text-white" />
              </div>

              <div>
                <p className="font-bold text-white">
                  OTB Villa Esperanza
                </p>

                <p className="text-xs text-sky-400">
                  Comunidad organizada
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Trabajamos por el desarrollo, la participación y el bienestar de
              nuestra comunidad.
            </p>
          </div>

          {/* NAVEGACIÓN */}

          <div>
            <h4 className="font-bold text-white">
              Navegación
            </h4>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <a
                href="#inicio"
                className="transition hover:text-sky-400"
              >
                Inicio
              </a>

              <a
                href="#nosotros"
                className="transition hover:text-sky-400"
              >
                Nosotros
              </a>

              <a
                href="#servicios"
                className="transition hover:text-sky-400"
              >
                Servicios
              </a>

              <a
                href="#comunicados"
                className="transition hover:text-sky-400"
              >
                Comunicados
              </a>
            </div>
          </div>

          {/* SERVICIOS */}

          <div>
            <h4 className="font-bold text-white">
              Servicios
            </h4>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <p>Servicio de agua</p>
              <p>Actividades</p>
              <p>Transparencia</p>
              <p>Reportes</p>
            </div>
          </div>

          {/* CONTACTO */}

          <div>
            <h4 className="font-bold text-white">
              Contacto
            </h4>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-sky-400" />

                <span>
                  Cochabamba, Bolivia
                </span>
              </div>

              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-sky-400" />

                <span>
                  +591 70000000
                </span>
              </div>

              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4 text-sky-400" />

                <span>
                  contacto@otb.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-6 text-xs text-slate-500 sm:flex-row lg:px-8">
            <p>
              © 2026 OTB Villa Esperanza. Todos los derechos reservados.
            </p>

            <p className="text-slate-500">
              Sistema de Gestión OTB
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}