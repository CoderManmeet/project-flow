import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS: Record<string, string> = {
  todo: '#94a3b8',
  'in-progress': '#3b82f6',
  review: '#f59e0b',
  completed: '#10b981',
};

const LABELS: Record<string, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  review: 'Review',
  completed: 'Completed',
};

interface Props {
  data: { _id: string; count: number }[];
}

const StatusPieChart = ({ data }: Props) => {
  const chartData = data.map((d) => ({
    name: LABELS[d._id] || d._id,
    value: d.count,
    key: d._id,
  }));

  if (chartData.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-12">No task data yet</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
          {chartData.map((entry) => (
            <Cell key={entry.key} fill={COLORS[entry.key] || '#8884d8'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StatusPieChart;