import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const COLORS: Record<string, string> = {
  low: '#10b981',
  medium: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444',
};

interface Props {
  data: { _id: string; count: number }[];
}

const PriorityBarChart = ({ data }: Props) => {
  const chartData = data.map((d) => ({ name: d._id, count: d.count, fill: COLORS[d._id] || '#8884d8' }));

  if (chartData.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-12">No task data yet</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" style={{ textTransform: 'capitalize', fontSize: 12 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PriorityBarChart;