import { PrinterIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatCurrency, formatDate } from '../../../utils/formatters';

function openPrintableReceipt(recibo, socioName) {
  const detalles = recibo.cobros_detalle?.length
    ? recibo.cobros_detalle
    : [{ concepto: recibo.concepto || 'Pago OTB', monto: recibo.monto }];

  const rowsHtml = detalles
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;">
          <strong>${item.concepto || 'Concepto'}</strong>
          ${item.descripcion ? `<div style="font-size:12px;color:#64748b;">${item.descripcion}</div>` : ''}
        </td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;">
          ${formatCurrency(item.monto)}
        </td>
      </tr>`,
    )
    .join('');

  const html = `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>Comprobante #${recibo.numero_recibo || recibo.id}</title>
    </head>
    <body style="font-family:system-ui,sans-serif;padding:24px;color:#0f172a;max-width:680px;margin:auto;">
      <div style="border:1px solid #cbd5e1;border-radius:16px;padding:24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f766e;padding-bottom:12px;">
          <div>
            <h2 style="margin:0;color:#0f766e;">OTB Huayllani Oeste</h2>
            <p style="margin:4px 0 0;font-size:13px;color:#475569;">Comprobante de Pago — Portal del Socio</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:12px;color:#64748b;">N° RECIBO</div>
            <div style="font-size:20px;font-weight:800;">#${recibo.numero_recibo || recibo.id}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;font-size:14px;">
          <div><strong>Socio:</strong> ${socioName || 'Socio'}</div>
          <div><strong>Fecha:</strong> ${formatDate(recibo.fecha_emision)}</div>
          <div><strong>Acción:</strong> ${recibo.codigo_interno ? `#${recibo.codigo_interno}` : '—'}</div>
          <div><strong>Método:</strong> ${recibo.metodo_pago || 'EFECTIVO'} (${recibo.origen})</div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="text-align:left;padding:8px;border-bottom:1px solid #cbd5e1;">Detalle</th>
              <th style="text-align:right;padding:8px;border-bottom:1px solid #cbd5e1;">Monto</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
          <tfoot>
            <tr>
              <td style="padding:12px 8px;font-weight:800;">TOTAL PAGADO</td>
              <td style="padding:12px 8px;text-align:right;font-size:18px;font-weight:900;color:#0f766e;">
                ${formatCurrency(recibo.monto)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <script>window.onload = () => { window.print(); };</script>
    </body>
  </html>`;

  const popup = window.open('', '_blank', 'width=760,height=700');
  if (!popup) return;
  popup.document.write(html);
  popup.document.close();
}

export default function ReciboDetalleModal({ recibo, socioName, onClose }) {
  if (!recibo) return null;

  const detalles = recibo.cobros_detalle?.length
    ? recibo.cobros_detalle
    : [{ id: recibo.id, concepto: recibo.concepto || 'Pago registrado', monto: recibo.monto }];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-linear-to-r from-emerald-700 to-teal-700 px-6 py-4 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-100">
              Comprobante de pago
            </p>
            <h3 className="text-xl font-black">
              Recibo #{recibo.numero_recibo || recibo.id}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-xl bg-white/15 p-2 text-white transition hover:bg-white/25"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-400">Fecha de emisión</p>
              <p className="mt-0.5 font-bold text-slate-800">
                {formatDate(recibo.fecha_emision)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Método de pago</p>
              <p className="mt-0.5 font-bold text-slate-800">
                {recibo.metodo_pago || 'EFECTIVO'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Acción</p>
              <p className="mt-0.5 font-bold text-slate-800">
                {recibo.codigo_interno ? `#${recibo.codigo_interno}` : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Origen</p>
              <p className="mt-0.5 font-bold text-slate-800">{recibo.origen || 'GENERAL'}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              Detalle pagado
            </p>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
              {detalles.map((item, idx) => (
                <div
                  key={`${item.id ?? idx}-${item.concepto}`}
                  className="flex items-start justify-between gap-4 px-4 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800">
                      {item.concepto || 'Concepto'}
                    </p>
                    {item.descripcion && (
                      <p className="mt-0.5 text-xs text-slate-500">{item.descripcion}</p>
                    )}
                  </div>
                  <span className="shrink-0 font-bold text-slate-900">
                    {formatCurrency(item.monto)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
            <span className="text-sm font-bold text-emerald-900">Total pagado</span>
            <span className="text-xl font-black text-emerald-700">
              {formatCurrency(recibo.monto)}
            </span>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => openPrintableReceipt(recibo, socioName)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800"
            >
              <PrinterIcon className="h-4 w-4" />
              Imprimir comprobante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
