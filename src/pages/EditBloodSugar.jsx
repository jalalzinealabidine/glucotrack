import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MedicalDisclaimer from '../components/MedicalDisclaimer.jsx';
import { useData } from '../context/DataContext.jsx';
import { combineDateTime, isoToDateInput, isoToTimeInput } from '../utils/dateUtils.js';

function EditBloodSugar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bloodSugarLogs, updateBloodSugarLog } = useData();
  const existingLog = useMemo(() => bloodSugarLogs.find((log) => log.id === id), [bloodSugarLogs, id]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({
    glucoseValue: existingLog?.glucoseValue ?? '',
    unit: existingLog?.unit ?? 'mg/dL',
    measurementType: existingLog?.measurementType ?? 'fasting',
    date: isoToDateInput(existingLog?.measuredAt),
    time: isoToTimeInput(existingLog?.measuredAt),
    note: existingLog?.note ?? ''
  }));



  useEffect(() => {
    if (!existingLog) return;
    setForm({
      glucoseValue: existingLog.glucoseValue ?? '',
      unit: existingLog.unit ?? 'mg/dL',
      measurementType: existingLog.measurementType ?? 'fasting',
      date: isoToDateInput(existingLog.measuredAt),
      time: isoToTimeInput(existingLog.measuredAt),
      note: existingLog.note ?? ''
    });
  }, [existingLog]);

  if (!existingLog) {
    return (
      <section className="card page-heading">
        <p className="eyebrow">Edit reading</p>
        <h1>Blood sugar log not found</h1>
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

    const glucose = Number(form.glucoseValue);
    if (!form.glucoseValue || Number.isNaN(glucose) || glucose <= 0) {
      setError('Please enter a positive blood sugar value.');
      return;
    }

    if (!form.date || !form.time) {
      setError('Please choose a date and time.');
      return;
    }

    try {
      setSaving(true);
      await updateBloodSugarLog(id, {
        glucoseValue: glucose,
        unit: form.unit,
        measurementType: form.measurementType,
        measuredAt: combineDateTime(form.date, form.time),
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
        <p className="eyebrow">Edit reading</p>
        <h1>Edit blood sugar</h1>
        <p className="muted">Update a saved blood sugar record.</p>

        {error && <div className="error-box">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Blood sugar value
            <input name="glucoseValue" type="number" min="1" step="0.1" value={form.glucoseValue} onChange={handleChange} />
          </label>

          <label>
            Unit
            <select name="unit" value={form.unit} onChange={handleChange}>
              <option value="mg/dL">mg/dL</option>
              <option value="mmol/L">mmol/L</option>
            </select>
          </label>

          <label>
            Measurement type
            <select name="measurementType" value={form.measurementType} onChange={handleChange}>
              <option value="fasting">Fasting</option>
              <option value="before meal">Before meal</option>
              <option value="after meal">After meal</option>
              <option value="bedtime">Bedtime</option>
              <option value="other">Other</option>
            </select>
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

export default EditBloodSugar;
