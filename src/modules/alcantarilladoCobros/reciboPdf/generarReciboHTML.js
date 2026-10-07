const generarReciboHTML = (data) => {
  const {
    socio,
    codigo_interno,
    numero_recibo,
    fecha_emision,
    monto_pagado,
    metodo_pago,
    cobros_pagados = [],
  } = data;

  const formatoNumero = (valor, decimales = 2) => {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return Number(0).toFixed(decimales);
    }

    return numero.toFixed(decimales);
  };

  const formatoRecibo = String(numero_recibo ?? 0).padStart(6, '0');

  const formatoFecha = fecha_emision || '-';

  const detalleCobros = cobros_pagados
    .map(
      (item) => `
        <tr>
          <td>
            ${item.descripcion ?? '-'}
          </td>

          <td>
            ${formatoNumero(item.monto_pagado)} Bs
          </td>
        </tr>
      `,
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />

        <title>
          Recibo ${formatoRecibo}
        </title>

        <style>
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;

            font-family:
              Arial,
              Helvetica,
              sans-serif;

            background: #f1f5f9;

            color: #111827;
          }

          body {
            padding: 24px;
          }

          .recibo {
            width: 140mm;
            min-height: 215mm;

            margin: 0 auto;

            padding: 16mm 12mm 10mm;

            background: #ffffff;

            border: 1px solid #d1d5db;
          }

          /*
          ==============================
          ENCABEZADO
          ==============================
          */

          .header {
            display: grid;

            grid-template-columns:
              52px
              1fr
              115px;

            gap: 12px;

            align-items: start;
          }

          .logo-container {
            width: 48px;
            height: 48px;

            display: flex;

            align-items: center;
            justify-content: center;
          }

          .logo {
            width: 44px;
            height: 44px;

            object-fit: contain;
          }

          .empresa h1 {
            margin: 0;

            font-size: 16px;
            line-height: 1.2;

            font-weight: 700;
          }

          .empresa h2 {
            margin: 2px 0 0;

            font-size: 16px;
            line-height: 1.2;

            font-weight: 700;
          }

          .empresa p {
            margin: 5px 0 0;

            font-size: 10px;

            color: #64748b;
          }

          .recibo-info {
            text-align: left;
          }

          .recibo-info .label {
            margin-bottom: 3px;

            font-size: 10px;
            font-weight: 700;

            color: #64748b;
          }

          .recibo-info .numero {
            margin-bottom: 4px;

            font-size: 14px;
            font-weight: 700;
          }

          .recibo-info .fecha {
            font-size: 8px;

            color: #64748b;
          }

          .divider {
            margin: 17px 0;

            border: 0;

            border-top: 1px solid #d1d5db;
          }

          /*
          ==============================
          DATOS
          ==============================
          */

          .section {
            margin-bottom: 20px;
          }

          .section-title {
            margin-bottom: 13px;

            font-size: 11px;
            font-weight: 700;

            letter-spacing: 0.3px;
          }

          .row {
            display: grid;

            grid-template-columns:
              110px
              1fr;

            margin-bottom: 10px;

            font-size: 10px;
          }

          .row .label {
            color: #64748b;
          }

          .row .value {
            font-weight: 700;

            overflow-wrap: break-word;
          }

          /*
          ==============================
          TABLA
          ==============================
          */

          .table {
            width: 100%;

            border-collapse: collapse;

            font-size: 10px;
          }

          .table thead {
            background: #f8fafc;
          }

          .table th {
            padding: 9px 10px;

            text-align: left;

            font-size: 9px;
            font-weight: 700;

            color: #64748b;

            border-bottom: 1px solid #e5e7eb;
          }

          .table td {
            padding: 11px 10px;

            border-bottom: 1px solid #e5e7eb;
          }

          .table th:last-child,
          .table td:last-child {
            width: 100px;

            text-align: right;

            white-space: nowrap;
          }

          /*
          ==============================
          TOTAL
          ==============================
          */

          .total-container {
            display: flex;

            justify-content: space-between;
            align-items: flex-end;

            margin-top: 25px;

            padding-top: 15px;

            border-top: 1px solid #111827;
          }

          .total-label {
            font-size: 12px;
            font-weight: 700;
          }

          .total {
            font-size: 20px;
            font-weight: 700;
          }

          /*
          ==============================
          FOOTER
          ==============================
          */

          .footer {
            display: grid;

            grid-template-columns:
              1fr
              130px;

            gap: 20px;

            align-items: end;

            margin-top: 35px;
          }

          .footer-info {
            font-size: 9px;

            line-height: 1.7;

            color: #64748b;
          }

          .firma {
            text-align: center;

            font-size: 9px;

            color: #64748b;
          }

          .firma-line {
            margin-bottom: 6px;

            border-top: 1px solid #64748b;
          }

          /*
          ==============================
          BOTÓN IMPRIMIR
          ==============================
          */

          .acciones {
            width: 140mm;

            display: flex;

            justify-content: flex-end;

            margin: 0 auto 15px;
          }

          .print-button {
            padding: 10px 18px;

            border: none;
            border-radius: 8px;

            background: #047857;

            color: #ffffff;

            font-size: 14px;
            font-weight: 600;

            cursor: pointer;
          }

          /*
          ==============================
          IMPRESIÓN
          ==============================
          */

          @page {
            size: 140mm 216mm;

            margin: 0;
          }

          @media print {
            html,
            body {
              width: 140mm;
              height: 216mm;

              margin: 0;
              padding: 0;

              background: #ffffff;
            }

            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .no-print {
              display: none !important;
            }

            .recibo {
              width: 140mm;

              min-height: 216mm;

              margin: 0;

              border: none;
            }
          }
        </style>
      </head>

      <body>

        <div class="acciones no-print">

          <button
            type="button"
            class="print-button"
            onclick="window.print()"
          >
            Imprimir recibo
          </button>

        </div>

        <main class="recibo">

          <!-- ==================================
               ENCABEZADO
          =================================== -->

          <div class="header">

            <div class="logo-container">

              <img
                src="/logo.png"
                alt="Logo"
                class="logo"
                onerror="
                  this.style.display='none'
                "
              />

            </div>

            <div class="empresa">

              <h1>
                COMITÉ DE AGUA POTABLE
              </h1>

              <h2>
                HUAYLLANI OESTE
              </h2>

              <p>
                RECIBO DE PAGO
              </p>

            </div>

            <div class="recibo-info">

              <div class="label">
                RECIBO
              </div>

              <div class="numero">
                Nº ${formatoRecibo}
              </div>

              <div class="fecha">
                ${formatoFecha}
              </div>

            </div>

          </div>

          <hr class="divider" />

          <!-- ==================================
               DATOS DEL SOCIO
          =================================== -->

          <section class="section">

            <div class="section-title">
              DATOS DEL SOCIO
            </div>

            <div class="row">

              <div class="label">
                Socio
              </div>

              <div class="value">
                ${socio ?? '-'}
              </div>

            </div>

            <div class="row">

              <div class="label">
                Acción
              </div>

              <div class="value">
                ${codigo_interno ?? '-'}
              </div>

            </div>

            <div class="row">

              <div class="label">
                Método de pago
              </div>

              <div class="value">
                ${metodo_pago ?? '-'}
              </div>

            </div>

            <div class="row">

              <div class="label">
                Fecha de emisión
              </div>

              <div class="value">
                ${formatoFecha}
              </div>

            </div>

          </section>

          <hr class="divider" />

          <!-- ==================================
               DETALLE DE COBRO
          =================================== -->

          <section class="section">

            <div class="section-title">
              DETALLE DE COBRO
            </div>

            <table class="table">

              <thead>

                <tr>

                  <th>
                    Concepto
                  </th>

                  <th>
                    Importe
                  </th>

                </tr>

              </thead>

              <tbody>

                ${detalleCobros}

              </tbody>

            </table>

          </section>

          <!-- ==================================
               TOTAL
          =================================== -->

          <div class="total-container">

            <div class="total-label">
              TOTAL PAGADO
            </div>

            <div class="total">
              ${formatoNumero(monto_pagado)} Bs
            </div>

          </div>

          <!-- ==================================
               PIE
          =================================== -->

          <footer class="footer">

            <div class="footer-info">

              <div>
                Método de pago:
                ${metodo_pago ?? '-'}
              </div>

              <div>
                Recibo:
                Nº ${formatoRecibo}
              </div>

            </div>

            <div class="firma">

              <div class="firma-line"></div>

              Firma y sello

            </div>

          </footer>

        </main>

      </body>
    </html>
  `;
};

export const imprimirRecibo = (data) => {
  const ventana = window.open('', '_blank', 'width=850,height=900');

  if (!ventana) {
    throw new Error('El navegador bloqueó la ventana emergente.');
  }

  const html = generarReciboHTML(data);

  ventana.document.open();
  ventana.document.write(html);
  ventana.document.close();
};
