import type { DailySummary } from '../types';

interface DailySummaryCardProps {
  summary: DailySummary | null;
}

const DailySummaryCard = ({ summary }: DailySummaryCardProps) => {
  if (!summary) {
    return (
      <section className="card">
        <h3 className="card-title">Daily Summary</h3>
        <p className="muted-text">No summary available.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-header">
        <h3 className="card-title">Daily Summary</h3>
        <span className="badge">{summary.date}</span>
      </div>

      <div className="summary-grid">
        <div className="summary-stat">
          <span className="summary-label">Calories</span>
          <strong className="summary-value">{summary.total_calories}</strong>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Protein</span>
          <strong className="summary-value">{summary.total_protein ?? 0}g</strong>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Carbs</span>
          <strong className="summary-value">{summary.total_carbs ?? 0}g</strong>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Fat</span>
          <strong className="summary-value">{summary.total_fat ?? 0}g</strong>
        </div>
        <div className="summary-stat summary-stat-full">
          <span className="summary-label">Meals Logged</span>
          <strong className="summary-value">{summary.meal_count}</strong>
        </div>
      </div>
    </section>
  );
};

export default DailySummaryCard;
