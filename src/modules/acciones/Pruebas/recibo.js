const generarReciboAguaHTML = (datos) => {
  const {
    numeroRecibo,
    fechaPago,
    nombreSocio,
    ci,
    numeroAccion,
    direccion,
    periodo,
    numeroMedidor,
    lecturaAnterior,
    lecturaActual,
    consumo,
    montoAgua,
    formaPago = 'Efectivo',
    cajero = 'Administrador',
    logoUrl = '/logo.png',
  } = datos;

  const formatoNumero = (valor, decimales = 2) => {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return Number(0).toFixed(decimales);
    }

    return numero.toFixed(decimales);
  };

  const formatoRecibo = String(numeroRecibo ?? 0).padStart(6, '0');

  const formatoFecha = new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fechaPago ? new Date(fechaPago) : new Date());

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />

        <title>Recibo ${formatoRecibo}</title>

        <style>
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #f1f5f9;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
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

            background: white;

            border: 1px solid #d1d5db;

            position: relative;
          }

          /* =========================
             ENCABEZADO
          ========================= */

          .header {
            display: grid;
            grid-template-columns: 52px 1fr 105px;
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
            line-height: 1.15;
            font-weight: 700;
          }

          .empresa h2 {
            margin: 2px 0 0;

            font-size: 16px;
            line-height: 1.15;
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
            font-size: 10px;
            font-weight: 700;
            color: #64748b;

            margin-bottom: 3px;
          }

          .recibo-info .numero {
            font-size: 14px;
            font-weight: 700;

            margin-bottom: 4px;
          }

          .recibo-info .fecha {
            font-size: 9px;
            color: #64748b;
          }

          .divider {
            border: 0;
            border-top: 1px solid #d1d5db;

            margin: 17px 0;
          }

          /* =========================
             SECCIONES
          ========================= */

          .section {
            margin-bottom: 19px;
          }

          .section-title {
            margin-bottom: 13px;

            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.3px;
          }

          .row {
            display: grid;
            grid-template-columns: 105px 1fr;

            margin-bottom: 9px;

            font-size: 10px;
          }

          .row .label {
            color: #64748b;
          }

          .row .value {
            font-weight: 700;

            overflow-wrap: break-word;
          }

          /* =========================
             TABLA
          ========================= */

          .table {
            width: 100%;

            border-collapse: collapse;

            font-size: 10px;
          }

          .table thead {
            background: #f8fafc;
          }

          .table th {
            padding: 8px 10px;

            color: #64748b;

            font-size: 9px;
            font-weight: 700;

            text-align: left;
          }

          .table td {
            padding: 10px;

            border-bottom: 1px solid #e5e7eb;
          }

          .table th:last-child,
          .table td:last-child {
            text-align: right;
          }

          /* =========================
             TOTAL
          ========================= */

          .total-container {
            margin-top: 24px;

            border-top: 1px solid #111827;

            padding-top: 15px;

            display: flex;
            align-items: flex-end;
            justify-content: space-between;
          }

          .total-label {
            font-size: 12px;
            font-weight: 700;
          }

          .total {
            font-size: 20px;
            font-weight: 700;
          }

          /* =========================
             PIE
          ========================= */

          .footer {
            margin-top: 25px;

            display: grid;
            grid-template-columns: 1fr 130px;
            gap: 20px;
            align-items: end;
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

          /* =========================
             BOTÓN
          ========================= */

          .acciones {
            width: 140mm;

            margin: 0 auto 15px;

            display: flex;
            justify-content: flex-end;
          }

          .print-button {
            border: none;
            border-radius: 8px;

            background: #047857;

            padding: 10px 18px;

            color: white;

            font-size: 14px;
            font-weight: 600;

            cursor: pointer;
          }

          .print-button:hover {
            background: #065f46;
          }

          /* =========================
             IMPRESIÓN
          ========================= */

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

              background: white;
            }

            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            .no-print {
              display: none !important;
            }

            .recibo {
              width: 140mm;
              min-height: 216mm;

              margin: 0;

              border: none;

              box-shadow: none;
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

          <!-- ENCABEZADO -->
          <div class="header">

            <div class="logo-container">
              <img
                src="${logoUrl}"
                alt="Logo"
                class="logo"
                onerror="this.style.display='none'"
              />
            </div>

            <div class="empresa">
              <h1>COMITÉ DE AGUA POTABLE</h1>
              <h2>HUAYLLANI OESTE</h2>

              <p>
                RECIBO DE PAGO DE AGUA
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

          <!-- DATOS DEL SOCIO -->
          <section class="section">

            <div class="section-title">
              DATOS DEL SOCIO
            </div>

            <div class="row">
              <div class="label">
                Socio
              </div>

              <div class="value">
                ${nombreSocio ?? '-'}
              </div>
            </div>

            <div class="row">
              <div class="label">
                CI
              </div>

              <div class="value">
                ${ci ?? '-'}
              </div>
            </div>

            <div class="row">
              <div class="label">
                Acción
              </div>

              <div class="value">
                ${numeroAccion ?? '-'}
              </div>
            </div>

            <div class="row">
              <div class="label">
                Dirección
              </div>

              <div class="value">
                ${direccion ?? '-'}
              </div>
            </div>

          </section>

          <hr class="divider" />

          <!-- LECTURAS -->
          <section class="section">

            <div class="section-title">
              LECTURAS Y CONSUMO
            </div>

            <div class="row">
              <div class="label">
                Periodo
              </div>

              <div class="value">
                ${periodo ?? '-'}
              </div>
            </div>

            <div class="row">
              <div class="label">
                Medidor
              </div>

              <div class="value">
                ${numeroMedidor ?? '-'}
              </div>
            </div>

            <div class="row">
              <div class="label">
                Lectura anterior
              </div>

              <div class="value">
                ${formatoNumero(lecturaAnterior)} m³
              </div>
            </div>

            <div class="row">
              <div class="label">
                Lectura actual
              </div>

              <div class="value">
                ${formatoNumero(lecturaActual)} m³
              </div>
            </div>

            <div class="row">
              <div class="label">
                Consumo
              </div>

              <div class="value">
                ${formatoNumero(consumo)} m³
              </div>
            </div>

          </section>

          <hr class="divider" />

          <!-- DETALLE -->
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

                <tr>

                  <td>
                    Consumo de agua
                  </td>

                  <td>
                    ${formatoNumero(montoAgua)} Bs
                  </td>

                </tr>

              </tbody>

            </table>

          </section>

          <!-- TOTAL -->
          <div class="total-container">

            <div class="total-label">
              TOTAL PAGADO
            </div>

            <div class="total">
              ${formatoNumero(montoAgua)} Bs
            </div>

          </div>

          <!-- PIE -->
          <footer class="footer">

            <div class="footer-info">

              <div>
                Forma de pago:
                ${formaPago}
              </div>

              <div>
                Cajero:
                ${cajero}
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

export const imprimirReciboAgua = (datos) => {
  const ventana = window.open('', '_blank', 'width=850,height=900');

  if (!ventana) {
    throw new Error('El navegador bloqueó la ventana emergente para imprimir.');
  }

  const html = generarReciboAguaHTML(datos);

  ventana.document.open();
  ventana.document.write(html);
  ventana.document.close();
};
