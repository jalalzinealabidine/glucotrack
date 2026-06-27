import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MedicalDisclaimer from '../components/MedicalDisclaimer.jsx';
import { useData } from '../context/DataContext.jsx';
import { combineDateTime, isoToDateInput, isoToTimeInput } from '../utils/dateUtils.js';

function EditInsulin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { insulinLogs, updateInsulinLog } = useData();
  const existingLog = useMemo(() => insulinLogs.find((log) => log.id === id), [insulinLogs, id]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({
    insulinType: existingLog?.insulinType ?? '',
    units: existingLog?.units ?? '',
    date: isoToDateInput(existingLog?.injectedAt),
    time: isoToTimeInput(existingLog?.injectedAt),
    note: existingLog?.note ?? ''
  }));



  useEffect(() => {
    if (!existingLog) return;
    setForm({
      insulinType: existingLog.insulinType ?? '',
      units: existingLog.units ?? '',
      date: isoToDateInput(existingLog.injectedAt),
      time: isoToTimeInput(existingLog.injectedAt),
      note: existingLog.note ?? ''
    });
  }, [existingLog]);

  if (!existingLog) {
    return (
      <section className="card page-heading">
        <p className="eyebrow">Edit injection</p>
        <h1>Insulin log not found</h1>
        <p className="muted">The record may have been deleted or is not loaded yet.</p>
        <Link className="button primary" to="/history">Back to history</Link>
      </section>
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const units = Number(form.units);
    if (!form.units || Number.isNaN(units) || units <= 0) {
      setError('Please enter positive insulin units.');
      return;
    }

    if (!form.date || !form.time) {
      setError('Please choose a date and time.');
      return;
    }

    try {
      setSaving(true);
      await updateInsulinLog(id, {
        insulinType: form.insulinType.trim() || 'Not specified',
        units,
        injectedAt: combineDateTime(form.date, form.time),
        note: form.note.trim()
      });
      navigate('/history');
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-narrow">
      <section className="card">
        <p className="eyebrow">Edit injection</p>
        <h1>Edit insulin</h1>
        <p className="muted">Update a saved insulin record.</p>

        {error && <div className="error-box">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Insulin type
            <input name="insulinType" value={form.insulinType} onChange={handleChange} />
          </label>

          <label>
            Units injected
            <input name="units" type="number" min="0.1" step="0.1" value={form.units} onChange={handleChange} />
          </label>

          <div className="form-row">
            <label>
              Date
              <input name="date" type="date" value={form.date} onChange={handleChange} />
            </label>
            <label>
              Time
              <input name="time" type="time" value={form.time} onChange={handleChange} />
            </label>
          </div>

          <label>
            Note
            <textarea name="note" value={form.note} onChange={handleChange} rows="4" />
          </label>

          <div className="form-actions">
            <button className="button primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
            <Link className="button secondary" to="/history">Cancel</Link>
          </div>
        </form>
      </section>

      <MedicalDisclaimer />
    </div>
  );
}

export default EditInsulin;
