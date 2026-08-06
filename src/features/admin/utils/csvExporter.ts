/**
 * Utility to convert JSON objects into downloadable CSV files in Portuguese UTF-8 encoding.
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  headers: { key: keyof T | string; label: string }[],
  filename: string
) {
  if (!data || !data.length) {
    alert('Nenhum dado disponível para exportar.');
    return;
  }

  // Header row
  const headerRow = headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(';');

  // Data rows
  const dataRows = data.map((row) => {
    return headers
      .map((h) => {
        let val: any = row[h.key];

        if (val === null || val === undefined) {
          val = '';
        } else if (typeof val === 'object') {
          if (Array.isArray(val)) {
            val = val.map((i) => (typeof i === 'object' ? i.name || JSON.stringify(i) : i)).join(', ');
          } else {
            val = val.name || JSON.stringify(val);
          }
        }

        const stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      })
      .join(';');
  });

  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
