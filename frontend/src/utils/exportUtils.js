/**
 * Export Utility Functions for Renta Property Management System
 * Provides client-side Excel (.csv/xlsx compatible) and PDF report generation.
 */

/**
 * Export tabular data as Excel (.csv compatible) file
 */
export const exportToExcel = (data, columns, filename = 'Renta_System_Report') => {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headers = columns ? columns.map((col) => `"${col.label.replace(/"/g, '""')}"`) : Object.keys(data[0]).map((k) => `"${k}"`);
  const keys = columns ? columns.map((col) => col.key) : Object.keys(data[0]);

  let csvContent = headers.join(',') + '\r\n';

  data.forEach((row) => {
    const rowValues = keys.map((key) => {
      let val = row[key];
      if (val === null || val === undefined) {
        val = '';
      } else if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    });
    csvContent += rowValues.join(',') + '\r\n';
  });

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export financial/system report as a printable PDF document
 */
export const exportToPDF = (title, metricsSummary = [], columns = [], data = [], filename = 'Renta_Report') => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate the PDF report.');
    return;
  }

  const currentDate = new Date().toLocaleString();

  const summaryHtml = metricsSummary.length > 0
    ? `
      <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 25px;">
        ${metricsSummary.map(m => `
          <div style="flex: 1; min-width: 180px; padding: 12px 16px; background: #f8fafc; border-left: 4px solid #1976d2; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">${m.label}</div>
            <div style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 4px;">${m.value}</div>
          </div>
        `).join('')}
      </div>
    `
    : '';

  const tableHeaderHtml = columns.length > 0
    ? `
      <thead>
        <tr style="background-color: #1976d2; color: #ffffff;">
          ${columns.map(col => `<th style="padding: 10px; text-align: left; font-size: 12px;">${col.label}</th>`).join('')}
        </tr>
      </thead>
    `
    : '';

  const tableBodyHtml = data.length > 0
    ? `
      <tbody>
        ${data.map((row, idx) => `
          <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
            ${columns.map(col => `<td style="padding: 8px 10px; font-size: 12px; color: #334155;">${row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '—'}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    `
    : '';

  const reportContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - ${filename}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1976d2; pb: 15px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 800; color: #1976d2; letter-spacing: -0.5px; }
          .subtitle { font-size: 12px; color: #64748b; }
          h1 { font-size: 20px; color: #0f172a; margin-top: 0; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .footer { margin-top: 40px; pt: 15px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="padding: 8px 16px; background-color: #1976d2; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">Print / Save as PDF</button>
        </div>

        <div class="header">
          <div>
            <div class="logo">RENTA</div>
            <div class="subtitle">Commercial Property & Rental Management System</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #64748b;">
            <div>Generated: ${currentDate}</div>
            <div>Status: Official System Report</div>
          </div>
        </div>

        <h1>${title}</h1>

        ${summaryHtml}
        ${columns.length > 0 ? `<table>${tableHeaderHtml}${tableBodyHtml}</table>` : ''}

        <div class="footer">
          This document is an automated official report generated by Renta Property Management System. Confidential.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(reportContent);
  printWindow.document.close();
};

/**
 * Generate Official Printable Payment Receipt PDF
 */
export const generatePaymentReceipt = (payment) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download/print the official payment receipt.');
    return;
  }

  const receiptNo = payment.receiptNo || `REC-${Date.now().toString().slice(-6)}`;
  const dateStr = payment.dueDate || payment.createdAt || new Date().toLocaleDateString();
  const tenantName = payment.tenant || payment.tenantName || 'Tenant User';
  const propertyName = payment.property || payment.propertyName || 'Renta Property';
  const unitNumber = payment.unit || payment.unitNumber || 'A-101';
  const amountStr = `KSh ${parseFloat(payment.amount || 0).toLocaleString()}`;
  const method = payment.paymentMethod || 'M-PESA';

  const receiptHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Receipt #${receiptNo} - Renta Property Management</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 30px; background-color: #ffffff; }
          .receipt-box { max-width: 650px; margin: 0 auto; border: 2px solid #1e293b; padding: 35px; border-radius: 8px; position: relative; }
          .receipt-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px dashed #cbd5e1; padding-bottom: 20px; margin-bottom: 25px; }
          .brand-title { font-size: 26px; font-weight: 800; color: #1976d2; letter-spacing: -0.5px; }
          .brand-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
          .receipt-badge { font-size: 13px; font-weight: 700; background-color: #22c55e; color: #ffffff; padding: 6px 14px; border-radius: 20px; display: inline-block; text-transform: uppercase; }
          .receipt-title { text-align: center; font-size: 20px; font-weight: 800; margin-bottom: 25px; color: #0f172a; letter-spacing: 1px; text-transform: uppercase; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; background: #f8fafc; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0; }
          .info-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 3px; }
          .info-val { font-size: 15px; font-weight: 700; color: #0f172a; }
          .payment-details { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .payment-details th { background-color: #0f172a; color: #ffffff; padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 700; }
          .payment-details td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
          .total-row { font-size: 18px; font-weight: 800; color: #166534; background-color: #f0fdf4; }
          .stamp-container { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; pt: 20px; border-top: 1px solid #e2e8f0; }
          .stamp { border: 2px solid #22c55e; color: #15803d; font-weight: 800; font-size: 14px; padding: 8px 16px; border-radius: 6px; transform: rotate(-5deg); text-transform: uppercase; letter-spacing: 1px; }
          .sig { text-align: right; font-size: 12px; color: #64748b; }
          .no-print { text-align: center; margin-bottom: 25px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button onclick="window.print()" style="padding: 10px 24px; background-color: #1976d2; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 14px; cursor: pointer; boxShadow: 0 4px 12px rgba(25,118,210,0.3);">Print / Save Official Receipt PDF</button>
        </div>

        <div class="receipt-box">
          <div class="receipt-header">
            <div>
              <div class="brand-title">RENTA MANAGEMENT</div>
              <div class="brand-sub">Official Digital Payment Receipt</div>
            </div>
            <div style="text-align: right;">
              <div class="receipt-badge">PAID &amp; CLEARED</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 8px;">Receipt No: <strong>#${receiptNo}</strong></div>
            </div>
          </div>

          <div class="receipt-title">Official Rent Payment Receipt</div>

          <div class="info-grid">
            <div>
              <div class="info-label">Tenant Name</div>
              <div class="info-val">${tenantName}</div>
            </div>
            <div>
              <div class="info-label">Date &amp; Time</div>
              <div class="info-val">${dateStr}</div>
            </div>
            <div>
              <div class="info-label">Property Name</div>
              <div class="info-val">${propertyName}</div>
            </div>
            <div>
              <div class="info-label">Unit Assigned</div>
              <div class="info-val">Unit ${unitNumber}</div>
            </div>
          </div>

          <table class="payment-details">
            <thead>
              <tr>
                <th>Description</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monthly Rent &amp; Utility Settlement</td>
                <td><strong>${method}</strong></td>
                <td><span style="color: #15803d; font-weight: 700;">Completed</span></td>
                <td style="text-align: right; font-weight: 700;">${amountStr}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="text-align: right;">TOTAL PAID:</td>
                <td style="text-align: right;">${amountStr}</td>
              </tr>
            </tbody>
          </table>

          <div class="stamp-container">
            <div class="stamp">✓ OFFICIAL PAYMENT VERIFIED</div>
            <div class="sig">
              <div style="border-bottom: 1px solid #0f172a; width: 180px; margin-bottom: 4px;"></div>
              Authorized Accounts Desk<br/>
              Renta Property Operations
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(receiptHtml);
  printWindow.document.close();
};
