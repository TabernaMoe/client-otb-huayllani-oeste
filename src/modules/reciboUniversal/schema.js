import z from 'zod';
import {
  reqString,
  reqInteger,
  reqDecimal,
} from '../../validators/funcionesZod';

export const CobroUniversalSchema = z.object({
  accion_id: z.coerce.number().min(1, 'Seleccione una acción'),
  concepto: reqString({ label: 'Concepto' }),
  descripcion: reqString({ label: 'Descripcion' }),
  monto: reqDecimal({ label: 'Monto' }),
});
