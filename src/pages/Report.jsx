import { useMemo, useState } from 'react';
import { isWithinInterval, parseISO } from 'date-fns';
import MedicalDisclaimer from '../components/MedicalDisclaimer.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useData } from '../context/DataContext.jsx';
import { currentTimeInput, formatDateTime, todayDateInput } from '../utils/dateUtils.js';
import { average, sum } from '../utils/glucoseUtils.js';

function toCsvValue(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function Report() {
  const { bloodSugarLogs, insulinLogs } = useData();
  const [startDate, setStartDate] = useState(todayDateInput());
  const [endDate, setEndDate] = useState(todayDateInput());

  const range = useMemo(() => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);
    return { start, end };
  }, [startDate, endDate]);

  const reportBloodSugar = useMemo(() => {
    return bloodSugarLogs
      .filter((log) => isWithinInterval(parseISO(log.measuredAt), range))
      .sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt));
  }, [bloodSugarLogs, range]);

  const reportInsulin = useMemo(() => {
    return insulinLogs
      .filter((log) => isWithinInterval(parseISO(log.injectedAt), range))
      .sort((a, b) => new Date(a.injectedAt) - new Date(b.injectedAt));
  }, [insulinLogs, range]);

  const averageGlucose = average(reportBloodSugar.map((log) => log.glucoseValue));
  const totalInsulin = sum(reportInsulin.map((log) => log.units));

  function printReport() {
    window.print();
  }

  function downloadCsv() {
    const rows = [
      ['type', 'date_time', 'value', 'unit_or_type', 'context', 'note'],
      ...reportBloodSugar.map((log) => [
        'blood_sugar',
        formatDateTime(log.measuredAt),
        log.glucoseValue,
        log.unit,
        log.measurementType,
        log.note
      ]),
      ...reportInsulin.map((log) => [
        'insulin',
        formatDateTime(log.injectedAt),
        log.units,
        log.insulinType,
        'units',
        log.note
      ])
    ];

    const csv = rows.map((row) => row.map(toCsvValue).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `glucotrack-report-${startDate}-to-${endDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page-grid report-page">
      <section className="card page-heading no-print">
        <p className="eyebrow">Doctor export</p>
        <h1>Report</h1>
        <p className="muted">Choose a period, print it, or save it as PDF from your browser print dialog.</p>
      </section>

      <section className="card no-print">
        <div className="form-row">
          <label>
            Start date
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </label>
          <label>
            End date
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </label>
        </div>

        <div className="form-actions spacing-top">
          <button className="button primary" onClick={printReport}>Print / Save as PDF</button>
          <button className="button secondary" onClick={downloadCsv}>Download CSV</button>
        </div>
      </section>

      <section className="card printable-report">
        <div className="report-header">
          <div>
            <p className="eyebrow">GlucoTrack report</p>
            <h1>Diabetes tracking summary</h1>
            <p className="muted">Period: {startDate} to {endDate}</p>
          </div>
          <div className="report-date">
            Generated at<br />{todayDateInput()} {currentTimeInput()}
          </div>
        </div>

        <MedicalDisclaimer />

        <section className="stats-grid report-stats">
          <div className="stat-card">
            <p>Blood sugar readings</p>
            <strong>{reportBloodSugar.length}</strong>
          </div>
          <div className="stat-card">
            <p>Average glucose</p>
            <strong>{averageGlucose ? `${averageGlucose} mg/dL` : 'No data'}</strong>
          </div>
          <div className="stat-card">
            <p>Insulin logs</p>
            <strong>{reportInsulin.length}</strong>
          </div>
          <div className="stat-card">
            <p>Total insulin</p>
            <strong>{totalInsulin} units</strong>
          </div>
        </section>

        <h2>Blood sugar readings</h2>
        {!reportBloodSugar.length ? (
          <EmptyState title="No blood sugar readings" message="No readings were found for this period." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date/time</th>
                  <th>Value</th>
                  <th>Type</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {reportBloodSugar.map((log) => (
                  <tr key={log.id}>
                    <td>{formatDateTime(log.measuredAt)}</td>
                    <td>{log.glucoseValue} {log.unit}</td>
                    <td>{log.measurementType}</td>
                    <td>{log.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2>Insulin injections</h2>
        {!reportInsulin.length ? (
          <EmptyState title="No insulin logs" message="No injections were found for this period." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date/time</th>
                  <th>Units</th>
                  <th>Insulin type</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {reportInsulin.map((log) => (
                  <tr key={log.id}>
                    <td>{formatDateTime(log.injectedAt)}</td>
                    <td>{log.units}</td>
                    <td>{log.insulinType}</td>
                    <td>{log.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Report;
