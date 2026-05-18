import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { AccionServices as Servs } from '../../services/acciones.services';
import { SocioServices as sociosServs } from '../../../socios/services/socio.services';
import { CalleRamalServices as calleServs } from '../../services/calleRamal.services';
import { TipoAccionServices as tiposAccionesServs } from '../../services/tipoAccion.services';

import { getChangedFields } from '../../../../helpers/getChangedFields';

import { accionSchema, accionUpdateSchema } from '../../schema/accion.schema';

import { MODALS, useModalManager } from '../../../../hooks/useModalManager';

import AsyncSelect from '../../../../components/AsyncSelect';
import Select from '../../../../components/Select';
import MultiSelect from '../../../../components/MultiSelect';

import InputField from '../../../../components/ElegantInput';
import TextArea from '../../../../components/ElegantTextarea';
import ConfirmModal from '../../../../components/ConfirmModal';

const initialForm = () => ({
  socio_id: '',
  calle_id: '',
  acciones: [],
  codigo_interno_accion: '',
  nro_medidor_accion: '',
  direccion_accion: '',
  observacion_accion: '',
  nro_accion: '',
  estado_accion: '',
});

const optioneEstado = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'PASIVO', label: 'Pasivo' },
  { value: 'ANULADO', label: 'Anulado' },
];

export default function AccionesModal({
  open,
  isEdit = false,
  id,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState(initialForm());
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedSocio, setSelectedSocio] = useState(null);
  const [selectedCalle, setSelectedCalle] = useState(null);

  const [valores, setValores] = useState(null);

  const [optionAcction, setOptionAcction] = useState([]);

  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!open) return;
        setError({});
        setForm(initialForm());
        setSelectedSocio(null);
        setSelectedCalle(null);
        const resCalle = await calleServs.getAll();
        if (!resCalle.ok) {
          toast.error(resCalle.message || 'No se pudo cargar las calles');
          return;
        }

        const calles = resCalle?.data.map((row) => ({
          value: row.id,
          label: row.nombre_calle,
        }));
        setSelectedCalle(calles);

        const resTipoAcciones = await tiposAccionesServs.getAll();
        if (!resTipoAcciones.ok) {
          toast.error(
            resTipoAcciones.message || 'No se pudo cargar las calles',
          );
          return;
        }

        const accionesTipo = resTipoAcciones?.data?.map((row) => ({
          value: Number(row.id),
          label: row.nombre_tipos_acciones,
        }));

        setOptionAcction(accionesTipo);

        setForm((perv) => ({
          ...perv,
          acciones: accionesTipo.map((u) => u.value),
        }));

        if (!isEdit || !id) return;
      } catch (e) {
        console.log(e);
        toast.error(e.message | 'Algo salio mal, intentelo mas tarde');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [open, isEdit, id]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({ ...prev, [name]: null }));
  };

  const loadSocios = async (inputValue) => {
    const res = await sociosServs.getAllSelect(inputValue);

    if (!res.ok) return [];

    return res.data.map((socio) => ({
      value: socio.id,
      label: `${socio.nombres_socio} ${socio.primer_apellido_socio} ${socio.segundo_apellido_socio} - CI: ${socio.ci_socio}`,
    }));
  };

  const handleSocioChange = (option) => {
    setSelectedSocio(option ?? null);

    setForm((prev) => ({
      ...prev,
      socio_id: option ? option.value : '',
    }));

    setError((prev) => ({
      ...prev,
      socio_id: null,
    }));
  };

  //+++
  const handleValidation = () => {
    const payload = isEdit ? getChangedFields(form, form) : form;

    if (isEdit && Object.keys(payload).length === 0) {
      toast.info('No realizaste ningún cambio');
      return;
    }

    const result = isEdit
      ? accionUpdateSchema.safeParse(payload)
      : accionSchema.safeParse(payload);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }
    setValores(result.data);

    openModal(isEdit ? MODALS.EDIT : MODALS.CREATE);
  };

  const handleCreate = async () => {
    try {
      console.log(valores);
      setLoading(true);
      const response = await Servs.create(valores);
      if (!response.ok) {
        throw new Error(response.message || 'No se pude crear la accion');
      }
      toast.success(response.message || 'Se creo exitosamente la accion');
      closeModal();
      onSuccess();
    } catch (e) {
      closeModal();
      console.error('[CREATE_ACCION_ERROR]', e);
      const message =
        e instanceof Error ? e.message : 'Error interno del sistema';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await Servs.update(id, valores);
      if (!response.ok) {
        throw new Error(response.message || 'No se pude crear la accion');
      }
      toast.success(response.message || 'Se creo exitosamente la accion');
    } catch (e) {
      console.error('[UPDATE_ACCION_ERROR]', e);
      const message =
        e instanceof Error ? e.message : 'Error interno del sistema';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay (fondo) */}
        <div
          onClick={loading ? undefined : onClose}
          className="absolute inset-0 bg-black/40"
        />
        <div
          className="relative z-10 w-7xl  rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
                max-h-[calc(100vh-2rem)] overflow-y-auto"
        >
          <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? 'Editar accion' : 'Crear nuevo accion'}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
              <div className="md:col-span-1 lg:col-span-3">
                <InputField
                  label="Codigo interno"
                  name="codigo_interno_accion"
                  type="number"
                  value={form.codigo_interno_accion ?? ''}
                  onChange={handleChange}
                  error={error.codigo_interno_accion}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-3">
                <InputField
                  label="Nro medidor"
                  name="nro_medidor_accion"
                  type="number"
                  value={form.nro_medidor_accion ?? ''}
                  onChange={handleChange}
                  error={error.nro_medidor_accion}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4">
                <AsyncSelect
                  label="Seleccione el socio"
                  name="socio_id"
                  loadOptions={loadSocios}
                  value={selectedSocio ?? []}
                  onChange={handleSocioChange}
                  error={error.socio_id}
                />
              </div>

              <div className="md:col-span-1 lg:col-span-4">
                <Select
                  isMultii={true}
                  label="Seleccione la calle"
                  name="calle_id"
                  options={selectedCalle ?? []}
                  value={form?.calle_id ?? ''}
                  onChange={handleChange}
                  error={error.calle_id}
                />
              </div>

              <div className="md:col-span-1 lg:col-span-6">
                <MultiSelect
                  label="Tipos de acción"
                  name="acciones"
                  options={optionAcction}
                  value={form.acciones ?? []}
                  onChange={handleChange}
                  error={error.acciones}
                />
              </div>

              <div className="md:col-span-1 lg:col-span-3 gap-10">
                <InputField
                  label="Nro accion"
                  name="nro_accion"
                  type="number"
                  value={form.nro_accion ?? ''}
                  onChange={handleChange}
                  error={error.nro_accion}
                />
                <div className="mt-2">
                  <Select
                    label="Seleccion estado de la accion"
                    options={optioneEstado}
                    name={'estado_accion'}
                    value={form.estado_accion ?? ''}
                    onChange={handleChange}
                    error={error.estado_accion}
                  />
                </div>
              </div>
              <div className="md:col-span-1 lg:col-span-4">
                <TextArea
                  label="Direccion"
                  name="direccion_accion"
                  type="text"
                  value={form.direccion_accion ?? ''}
                  onChange={handleChange}
                  error={error.direccion_accion}
                />
              </div>
              <div className="md:col-span-1 lg:col-span-4">
                <TextArea
                  label="Observaciones"
                  name="observacion_accion"
                  type="text"
                  value={form.observacion_accion ?? ''}
                  onChange={handleChange}
                  error={error.observacion_accion}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-5">
            <button
              className="rounded-xl bg-red-800 px-3 py-2 text-white hover:bg-red-900"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="rounded-xl bg-sky-800 px-3 py-2 text-white hover:bg-sky-900"
              onClick={handleValidation}
            >
              {isEdit ? 'Editar cambios' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={isModalOpen(isEdit ? MODALS.EDIT : MODALS.CREATE)}
        onClose={closeModal}
        loading={loading}
        onConfirm={isEdit ? handleUpdate : handleCreate}
        title={isEdit ? '¿Confirmar edición?' : '¿Confirmar creación?'}
      />
    </>
  );
}
