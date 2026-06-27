import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicalDisclaimer from '../components/MedicalDisclaimer.jsx';
import { useData } from '../context/DataContext.jsx';
import { combineDateTime, currentTimeInput, todayDateInput } from '../utils/dateUtils.js';

const initialForm = {
  glucoseValue: '',
  unit: 'mg/dL',
  measurementType: 'fasting',
  date: todayDateInput(),
  time: currentTimeInput(),
  note: ''
};

function AddBloodSugar() {
  const navigate = useNavigate();
  const { addBloodSugarLog } = useData();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previousForm) => ({ ...previousForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const glucose = Number(form.glucoseValue);

    if (!form.glucoseValue || Number.isNaN(glucose)) {
      setError('Please enter a valid blood sugar value.');
      return;
    }

    if (glucose <= 0) {
      setError('Blood sugar value must be positive.');
      return;
    }

    if (!form.date || !form.time) {
      setError('Please choose a date and time.');
      return;
    }

    try {
      await addBloodSugarLog({
        glucoseValue: glucose,
        unit: form.unit,
        measurementType: form.measurementType,
        measuredAt: combineDateTime(form.date, form.time),
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
        <p className="eyebrow">New reading</p>
        <h1>Add blood sugar</h1>
        <p className="muted">Log your glucose value, time, meal state and optional notes.</p>

        {error && <div className="error-box">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Blood sugar value
            <input
              name="glucoseValue"
              type="number"
              min="1"
              step="0.1"
              value={form.glucoseValue}
              onChange={handleChange}
              placeholder="Example: 145"
            />
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
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Example: before breakfast"
              rows="4"
            />
          </label>

          <button className="button primary full" type="submit">Save blood sugar</button>
        </form>
      </section>

      <MedicalDisclaimer />
    </div>
  );
}

export default AddBloodSugar;
