import { useEffect, useState } from 'react';
import { SocioPortalServices } from '../services/socioPortal.services';

export default function MiPerfilPage() {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    SocioPortalServices.getPerfil()
      .then((response) => setPerfil(response?.data ?? response))
      .catch((err) => setError(err.response?.data?.message || 'No se pudo cargar el perfil'));
  }, []);

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Mi perfil</h1>
        <p className="mt-1 text-sm text-slate-500">Datos personales asociados a tu cuenta.</p>
      </div>
      {error && <div className="rounded-2xl bg-red-50 p-4 text-red-700">{error}</div>}
      {!perfil ? <div className="rounded-3xl bg-white p-6 shadow-sm">Cargando...</div> : (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['CI', perfil.ci_socio],
            ['Nombres', perfil.nombres],
            ['Primer apellido', perfil.primer_apellido],
            ['Segundo apellido', perfil.segundo_apellido],
            ['Celular', perfil.numero_celular],
            ['Dirección', perfil.direccion],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <p className="mt-1 text-lg font-black text-slate-900">{value || '-'}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
