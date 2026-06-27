import { useMemo, useState } from 'react';
import { isSameDay, parseISO } from 'date-fns';
import DailyChart from '../components/DailyChart.jsx';
import WeeklyChart from '../components/WeeklyChart.jsx';
import { useData } from '../context/DataContext.jsx';
import { average } from '../utils/glucoseUtils.js';
import { formatTime, getDayLabel, getWeekDays, todayDateInput } from '../utils/dateUtils.js';

function Charts() {
  const { bloodSugarLogs } = useData();
  const [selectedDate, setSelectedDate] = useState(todayDateInput());

  const dailyData = useMemo(() => {
    const target = new Date(`${selectedDate}T00:00:00`);

    return bloodSugarLogs
      .filter((log) => isSameDay(parseISO(log.measuredAt), target))
      .sort((a, b) => new Date(a.measuredAt) - new Date(b.measuredAt))
      .map((log) => ({
        time: formatTime(log.measuredAt),
        glucose: Number(log.glucoseValue)
      }));
  }, [bloodSugarLogs, selectedDate]);

  const weeklyData = useMemo(() => {
    return getWeekDays(new Date(`${selectedDate}T00:00:00`)).map((day) => {
      const logsOfDay = bloodSugarLogs.filter((log) => isSameDay(parseISO(log.measuredAt), day));
      return {
        day: getDayLabel(day),
        average: average(logsOfDay.map((log) => log.glucoseValue)),
        count: logsOfDay.length
      };
    });
  }, [bloodSugarLogs, selectedDate]);

  return (
    <div className="page-grid">
      <section className="card page-heading">
        <p className="eyebrow">Visual analytics</p>
        <h1>Charts</h1>
        <p className="muted">See daily blood sugar changes and weekly average values.</p>
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <h2>Daily blood sugar</h2>
            <p className="muted">Line chart for the selected day.</p>
          </div>
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
        </div>
        <DailyChart data={dailyData} />
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <h2>Weekly average</h2>
            <p className="muted">Average blood sugar for each day of the selected week.</p>
          </div>
        </div>
        <WeeklyChart data={weeklyData} />
      </section>
    </div>
  );
}

export default Charts;
