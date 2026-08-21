import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { DailySummary } from '../types';


interface MacroDonutChartProps {
  summary: DailySummary | null;
}

const COLORS = ['#2563eb', '#16a34a', '#f59e0b'];

const MacroDonutChart = ({ summary }: MacroDonutChartProps) => {
  const proteinCalories = Number(summary?.total_protein ?? 0) * 4;
  const carbsCalories = Number(summary?.total_carbs ?? 0) * 4;
  const fatCalories = Number(summary?.total_fat ?? 0) * 9;

  const chartData = [
    { name: 'Protein', value: proteinCalories },
    { name: 'Carbs', value: carbsCalories },
    { name: 'Fat', value: fatCalories },
  ].filter((item) => item.value > 0);

  return (
    <section className="card">
      <div className="card-header">
        <h3 className="card-title">Macro Breakdown</h3>
        <span className="badge">Calories by macro</span>
      </div>

      {chartData.length === 0 ? (
        <p className="muted-text">No macro data available for this date.</p>
      ) : (
          <div className="chart-canvas">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${Math.round(Number(value ?? 0))} kcal`, 'Calories']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          </div>
      )}
    </section>
  );
};

export default MacroDonutChart;
