import { useState } from 'react';
import EmptyState from '../components/EmptyState.jsx';
import { useData } from '../context/DataContext.jsx';
import { currentTimeInput } from '../utils/dateUtils.js';

function Reminders() {
  const { reminders, addReminder, deleteReminder, toggleReminder } = useData();
  const [title, setTitle] = useState('Check blood sugar');
  const [time, setTime] = useState(currentTimeInput());
  const [message, setMessage] = useState('');

  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      setMessage('This browser does not support notifications.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setMessage('Notifications enabled. Keep the website open to receive reminders.');
    } else {
      setMessage('Notifications not enabled. You can still save reminders.');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !time) {
      setMessage('Please enter a reminder title and time.');
      return;
    }

    try {
      await addReminder({
        title: title.trim(),
        time,
        repeatDaily: true
      });

      setTitle('Check blood sugar');
      setMessage('Reminder saved. Browser notifications work while the website is open.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="page-grid">
      <section className="card page-heading">
        <p className="eyebrow">Alarms</p>
        <h1>Reminders</h1>
        <p className="muted">
          Create simple daily reminders. In this prototype, notifications work while the website is open.
        </p>
      </section>

      <section className="card two-column-card">
        <div>
          <h2>Add reminder</h2>
          <p className="muted">Example: Check blood sugar at 08:00 every day.</p>

          {message && <div className="info-box">{message}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <label>
              Reminder title
              <input value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>

            <label>
              Time
              <input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
            </label>

            <button className="button primary full" type="submit">Save reminder</button>
            <button className="button secondary full" type="button" onClick={requestNotificationPermission}>
              Enable notifications
            </button>
          </form>
        </div>

        <div>
          <h2>Saved reminders</h2>
          <div className="list">
            {!reminders.length && (
              <EmptyState title="No reminders" message="Create your first reminder to check blood sugar." />
            )}

            {reminders.map((reminder) => (
              <article className="log-card" key={reminder.id}>
                <div>
                  <strong>{reminder.time}</strong>
                  <p>{reminder.title}</p>
                  <small>{reminder.isActive ? 'Active' : 'Paused'} · Daily</small>
                </div>
                <div className="button-group-small">
                  <button className="small-button" onClick={() => toggleReminder(reminder.id).catch((error) => setMessage(error.message))}>
                    {reminder.isActive ? 'Pause' : 'Activate'}
                  </button>
                  <button className="danger-button" onClick={() => deleteReminder(reminder.id).catch((error) => setMessage(error.message))}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Reminders;
