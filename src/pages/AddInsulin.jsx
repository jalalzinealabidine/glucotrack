import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicalDisclaimer from '../components/MedicalDisclaimer.jsx';
import { useData } from '../context/DataContext.jsx';
import { combineDateTime, currentTimeInput, todayDateInput } from '../utils/dateUtils.js';

const initialForm = {
  insulinType: '',
  units: '',
  date: todayDateInput(),
  time: currentTimeInput(),
  note: ''
};

function AddInsulin() {
  const navigate = useNavigate();
  const { addInsulinLog } = useData();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const units = Number(form.units);

    if (!form.units || Number.isNaN(units)) {
      setError('Please enter valid insulin units.');
      return;
    }

    if (units <= 0) {
      setError('Insulin units must be positive.');
      return;
    }

    if (!form.date || !form.time) {
      setError('Please choose a date and time.');
      return;
    }

    try {
      await addInsulinLog({
        insulinType: form.insulinType.trim() || 'Not specified',
        units,
        injectedAt: combineDateTime(form.date, form.time),
        note: form.note.trim()
      });

      navigate('/history');
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="page-narrow">
      <section className="card">
        <p className="eyebrow">New injection</p>
        <h1>Add insulin</h1>
        <p className="muted">Log insulin units that were already prescribed by your doctor.</p>

        {error && <div className="error-box">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Insulin type
            <input
              name="insulinType"
              value={form.insulinType}
              onChange={handleChange}
              placeholder="Example: Rapid, Basal, Novorapid"
            />
          </label>

          <label>
            Units injected
            <input
              name="units"
              type="number"
              min="0.1"
              step="0.1"
              value={form.units}
              onChange={handleChange}
              placeholder="Example: 8"
            />
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
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Example: before lunch"
              rows="4"
            />
          </label>

          <button className="button primary full" type="submit">Save insulin log</button>
        </form>
      </section>

      <MedicalDisclaimer />
    </div>
  );
}

export default AddInsulin;
