import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import EmptyState from './EmptyState.jsx';

function DailyChart({ data }) {
  if (!data.length) {
    return <EmptyState title="No daily data" message="Add blood sugar readings to see the daily chart." />;
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
          <Tooltip formatter={(value) => [`${value} mg/dL`, 'Blood sugar']} />
          <Line type="monotone" dataKey="glucose" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DailyChart;
