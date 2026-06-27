import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import { useData } from '../context/DataContext.jsx';
import { formatDateTime } from '../utils/dateUtils.js';
import { getGlucoseStatus } from '../utils/glucoseUtils.js';

function History() {
  const { bloodSugarLogs, insulinLogs, deleteBloodSugarLog, deleteInsulinLog, dataError, loading } = useData();
  const [tab, setTab] = useState('bloodSugar');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');

  const filteredBloodSugarLogs = useMemo(() => {
    return bloodSugarLogs.filter((log) => {
      const text = `${log.glucoseValue} ${log.unit} ${log.measurementType} ${log.note}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [bloodSugarLogs, query]);

  const filteredInsulinLogs = useMemo(() => {
    return insulinLogs.filter((log) => {
      const text = `${log.units} ${log.insulinType} ${log.note}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [insulinLogs, query]);

  async function handleDeleteBloodSugar(id) {
    try {
      await deleteBloodSugarLog(id);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDeleteInsulin(id) {
    try {
      await deleteInsulinLog(id);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="page-grid">
      <section className="card page-heading">
        <p className="eyebrow">All records</p>
        <h1>History</h1>
        <p className="muted">Search, review, edit, and delete your blood sugar or insulin logs.</p>
      </section>

      {dataError && <div className="error-box">{dataError}</div>}
      {message && <div className="error-box">{message}</div>}

      <section className="card">
        <div className="toolbar">
          <div className="tabs">
            <button className={tab === 'bloodSugar' ? 'tab active' : 'tab'} onClick={() => setTab('bloodSugar')}>
              Blood sugar
            </button>
            <button className={tab === 'insulin' ? 'tab active' : 'tab'} onClick={() => setTab('insulin')}>
              Insulin
            </button>
          </div>

          <input
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notes/type/value..."
          />
        </div>

        {loading && <div className="info-box">Loading your cloud data...</div>}

        {tab === 'bloodSugar' && (
          <div className="list">
            {!filteredBloodSugarLogs.length && !loading && (
              <EmptyState title="No blood sugar logs" message="Add your first reading from the Blood sugar page." />
            )}

            {filteredBloodSugarLogs.map((log) => {
              const status = getGlucoseStatus(log.glucoseValue);
              return (
                <article className="log-card" key={log.id}>
                  <div>
                    <strong>{log.glucoseValue} {log.unit}</strong>
                    <span className={`status-pill ${status.className}`}>{status.label}</span>
                    <p>{log.measurementType} · {formatDateTime(log.measuredAt)}</p>
                    {log.note && <small>{log.note}</small>}
                  </div>
                  <div className="button-group-small">
                    <Link className="small-button" to={`/edit-blood-sugar/${log.id}`}>Edit</Link>
                    <button className="danger-button" onClick={() => handleDeleteBloodSugar(log.id)}>Delete</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {tab === 'insulin' && (
          <div className="list">
            {!filteredInsulinLogs.length && !loading && (
              <EmptyState title="No insulin logs" message="Add your first injection from the Insulin page." />
            )}

            {filteredInsulinLogs.map((log) => (
              <article className="log-card" key={log.id}>
                <div>
                  <strong>{log.units} units</strong>
                  <p>{log.insulinType} · {formatDateTime(log.injectedAt)}</p>
                  {log.note && <small>{log.note}</small>}
                </div>
                <div className="button-group-small">
                  <Link className="small-button" to={`/edit-insulin/${log.id}`}>Edit</Link>
                  <button className="danger-button" onClick={() => handleDeleteInsulin(log.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default History;
