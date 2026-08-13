/**
 * Export Utility Functions for Renta Property Management System
 * Provides client-side Excel (.csv/xlsx compatible) and PDF report generation.
 */

/**
 * Export tabular data as Excel (.csv compatible) file
 * @param {Array} data - Array of objects representing table rows
 * @param {Array} columns - Array of column definitions [{ key: 'id', label: 'ID' }]
 * @param {string} filename - Output filename (without extension)
 */
export const exportToExcel = (data, columns, filename = 'Renta_System_Report') => {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  // 1. Build CSV Header
  const headers = columns ? columns.map((col) => `"${col.label.replace(/"/g, '""')}"`) : Object.keys(data[0]).map((k) => `"${k}"`);
  const keys = columns ? columns.map((col) => col.key) : Object.keys(data[0]);

  let csvContent = headers.join(',') + '\r\n';

  // 2. Build CSV Rows
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

  // 3. Trigger Download
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
 * @param {string} title - Report Title
 * @param {Array} metricsSummary - Array of { label, value } for top metrics summary
 * @param {Array} columns - Table columns [{ key: 'id', label: 'ID' }]
 * @param {Array} data - Table row data
 * @param {string} filename - Report filename
 */
export const exportToPDF = (title, metricsSummary = [], columns = [], data = [], filename = 'Renta_Report') => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate the PDF report.');
    return;
  }

  const currentDate = new Date().toLocaleString();

  // Generate HTML for printable report
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
          @media print {
            .no-print { display: none; }
          }
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
          // Auto trigger print dialog after page load
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(reportContent);
  printWindow.document.close();
};
