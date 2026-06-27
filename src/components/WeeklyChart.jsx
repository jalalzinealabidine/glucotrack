import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import EmptyState from './EmptyState.jsx';

function WeeklyChart({ data }) {
  const hasValues = data.some((item) => item.average > 0);

  if (!hasValues) {
    return <EmptyState title="No weekly data" message="Add readings this week to see averages." />;
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} mg/dL`, 'Average']} />
          <Bar dataKey="average" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyChart;
