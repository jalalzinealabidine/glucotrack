import { Link } from 'react-router-dom';
import { isSameDay, parseISO } from 'date-fns';
import StatCard from '../components/StatCard.jsx';
import MedicalDisclaimer from '../components/MedicalDisclaimer.jsx';
import { useData } from '../context/DataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { average, sum } from '../utils/glucoseUtils.js';
import { formatDateTime } from '../utils/dateUtils.js';

function Dashboard() {
  const { bloodSugarLogs, insulinLogs, reminders, storageMode } = useData();
  const { isSupabaseConfigured, user } = useAuth();
  const today = new Date();

  const todayBloodSugarLogs = bloodSugarLogs.filter((log) => isSameDay(parseISO(log.measuredAt), today));
  const todayInsulinLogs = insulinLogs.filter((log) => isSameDay(parseISO(log.injectedAt), today));

  const lastBloodSugar = bloodSugarLogs[0];
  const todayAverage = average(todayBloodSugarLogs.map((log) => log.glucoseValue));
  const todayInsulinTotal = sum(todayInsulinLogs.map((log) => log.units));
  const nextReminder = reminders
    .filter((reminder) => reminder.isActive)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <div className="page-grid">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Health tracking project</p>
          <h1>Track blood sugar, insulin, charts and reminders.</h1>
          <p>
            A diabetes tracking website built with React. It works offline with localStorage and can use Supabase cloud storage when configured.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/add-blood-sugar">Add blood sugar</Link>
            <Link className="button secondary" to="/add-insulin">Add insulin</Link>
            {!user && isSupabaseConfigured && <Link className="button secondary" to="/login">Login for cloud sync</Link>}
          </div>
        </div>
      </section>

      <MedicalDisclaimer />

      <section className="card mode-card">
        <div>
          <p className="eyebrow">Storage mode</p>
          <h2>{storageMode === 'cloud' ? 'Cloud mode is active' : 'Local mode is active'}</h2>
          <p className="muted">
            {storageMode === 'cloud'
              ? 'Your records are saved in Supabase for your logged-in account.'
              : 'Your records are saved only in this browser. Configure Supabase and login to enable cloud storage.'}
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Last blood sugar"
          value={lastBloodSugar ? `${lastBloodSugar.glucoseValue} ${lastBloodSugar.unit}` : 'No data'}
          helper={lastBloodSugar ? formatDateTime(lastBloodSugar.measuredAt) : 'Add your first reading'}
        />
        <StatCard
          label="Today average"
          value={todayAverage ? `${todayAverage} mg/dL` : 'No data'}
          helper={`${todayBloodSugarLogs.length} reading(s) today`}
        />
        <StatCard
          label="Today insulin total"
          value={`${todayInsulinTotal} units`}
          helper={`${todayInsulinLogs.length} injection(s) today`}
        />
        <StatCard
          label="Next reminder"
          value={nextReminder ? nextReminder.time : 'No reminder'}
          helper={nextReminder ? nextReminder.title : 'Create a reminder'}
        />
      </section>

      <section className="card quick-links">
        <h2>Quick actions</h2>
        <div className="quick-grid">
          <Link to="/history">View history</Link>
          <Link to="/charts">Open charts</Link>
          <Link to="/reminders">Manage reminders</Link>
          <Link to="/report">Export report</Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
