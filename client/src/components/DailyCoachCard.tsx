import type { DailyCoachInsight } from '../types';

interface DailyCoachCardProps {
  date: string;
  insight: DailyCoachInsight | null;
  loading: boolean;
  error: string;
  onGenerate: () => void | Promise<void>;
}

const DailyCoachCard = ({ date, insight, loading, error, onGenerate }: DailyCoachCardProps) => {
  return (
    <section className="card coach-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Daily Nutrition Coach</h3>
          <p className="coach-subtitle">Generate a quick summary, practical suggestions, and one watch-out for this day.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => void onGenerate()} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Insight'}
        </button>
      </div>

      <p className="muted-text">Selected date: {date}</p>

      {insight ? (
        <p className="coach-meta">
          {insight.responseSource === 'openai' && insight.responseTimeMs !== null
            ? `OpenAI response time: ${insight.responseTimeMs} ms`
            : 'Using local fallback insight'}
        </p>
      ) : null}

      {error ? <div className="alert alert-error">{error}</div> : null}

      {!insight && !loading && !error ? (
        <p className="muted-text">Click Generate Insight to review the day with the nutrition coach.</p>
      ) : null}

      {insight ? (
        <div className="coach-content">
          <div className="coach-section">
            <h4 className="coach-heading">Summary</h4>
            <p className="coach-text">{insight.summary}</p>
          </div>

          <div className="coach-section">
            <h4 className="coach-heading">Suggestions</h4>
            <ul className="coach-list">
              {insight.suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </div>

          {insight.warning ? (
            <div className="coach-warning">
              <strong>Warning:</strong> {insight.warning}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default DailyCoachCard;
