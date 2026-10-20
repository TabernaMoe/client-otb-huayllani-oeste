import { useState, useEffect } from 'react';
import { Cog6ToothIcon, BookmarkSquareIcon } from '@heroicons/react/24/outline';
import Select from '../../../components/Select';
import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';

import { ReciboMadreSerivices as Servs } from '../services';
import { toast } from 'react-toastify';

import ConfirmModal from '../../../components/ConfirmModal';

import { CobroUniversalSchema } from '../schema';

const INITIAL_FORM = {
  accion_id: '',
  concepto: '',
  descripcion: '',
  monto: '',
};

export default function ReciboMadreForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [acciones, setAcciones] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await Servs.getSelectAccion();
        if (!response.ok) {
          throw new Error(
            response?.message || 'No se pudo obtener las acciones',
          );
        }
        setAcciones(Array.isArray(response?.data) ? response.data : []);
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : 'Algo salio mal intentelo mas tarde',
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const OpenModalHandle = () => {
    const result = CobroUniversalSchema.safeParse(form);

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setErrors(fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await Servs.create({ payload: form });
      if (!response.ok) {
        throw new Error(response?.message || 'No se pudo crear el recibo');
      }
      toast.success(response.message);
      setForm(INITIAL_FORM);
      setOpenModal(false);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Algo salio mal intentelo mas tarde',
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-[#f7f9fc] px-4 py-6 font-sans text-slate-800 sm:px-6 sm:py-9">
        <div>
          <div className="mb-5">
            <h1 className="text-xl font-bold tracking-tight text-[#1f285f] sm:text-2xl">
              Crear recibo madre
            </h1>
            <p className="mt-1 text-sm text-[#7a84aa]">
              Define un recibo base con código universal y datos obligatorios.
            </p>
          </div>

          {/* Datos del recibo */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-start gap-3">
              <Cog6ToothIcon className="mt-0.5 size-6 shrink-0 text-green-600" />
              <div>
                <h2 className="text-base font-bold text-[#1f285f]">
                  Datos del recibo
                </h2>
                <p className="mt-0.5 text-xs text-[#7a84aa]">
                  Define el concepto, descripción y monto base del recibo madre.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <Select
                name={'accion_id'}
                value={form?.accion_id}
                options={acciones}
                onChange={handleChange}
                error={errors?.accion_id}
              />
              <ElegantInput
                label={'Concepto'}
                name={'concepto'}
                value={form?.concepto}
                error={errors?.concepto}
                onChange={handleChange}
              />
              <ElegantTextarea
                label={'Descripción'}
                onChange={handleChange}
                name={'descripcion'}
                value={form?.descripcion}
                error={errors?.descripcion}
              />
              <ElegantInput
                label={'Monto Bs.'}
                onChange={handleChange}
                type="number"
                name={'monto'}
                value={form?.monto}
                error={errors?.monto}
              />
            </div>
          </section>

          {/* Acciones */}
          <footer className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={saving}
              onClick={OpenModalHandle}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#263579] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e2b63] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <BookmarkSquareIcon className="size-4" />
              {saving ? 'Guardando...' : 'Guardar recibo madre'}
            </button>
          </footer>
        </div>
      </div>
      <ConfirmModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleSave}
        loading={loading}
      />
    </>
  );
}
