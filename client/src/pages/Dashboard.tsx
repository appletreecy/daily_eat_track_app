import { useEffect, useState } from 'react';
import DailyCoachCard from '../components/DailyCoachCard';
import DailySummaryCard from '../components/DailySummaryCard';
import MealList from '../components/MealList';
import { coachService } from '../services/coachService';
import { mealService } from '../services/mealService';
import type { DailyCoachInsight, DailySummary, Meal } from '../types';
import MacroDonutChart from '../components/MacroDonutChart';

const today = new Date().toISOString().split('T')[0];

const Dashboard = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(true);
  const [coachInsight, setCoachInsight] = useState<DailyCoachInsight | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [mealsData, summaryData] = await Promise.all([
          mealService.getMealsByDate(selectedDate),
          mealService.getDailySummary(selectedDate),
        ]);

        setMeals(mealsData);
        setSummary(summaryData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboardData();
  }, [selectedDate]);

  useEffect(() => {
    setCoachInsight(null);
    setCoachError('');
  }, [selectedDate]);

  const handleGenerateInsight = async () => {
    try {
      setCoachLoading(true);
      setCoachError('');
      const insight = await coachService.getDailyInsight(selectedDate);
      setCoachInsight(insight);
    } catch (error) {
      console.error('Error generating coach insight:', error);
      setCoachError('Failed to generate coach insight.');
    } finally {
      setCoachLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Dashboard</h2>
          <p className="section-subtitle">Review meals and nutrition totals for a selected day</p>
        </div>

        <div className="date-filter">
          <label htmlFor="selectedDate" className="field-label">
            Choose Date
          </label>
          <input
            id="selectedDate"
            className="text-input"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="card">
          <p className="muted-text">Loading...</p>
        </div>
        ) : (
          <>
            <div className="dashboard-grid">
              <DailySummaryCard summary={summary} />
              <MealList meals={meals} />
            </div>
              <MacroDonutChart summary={summary} />
            <DailyCoachCard
              date={selectedDate}
              insight={coachInsight}
              loading={coachLoading}
              error={coachError}
              onGenerate={handleGenerateInsight}
            />
          </>
        )}
    </section>
  );
};

export default Dashboard;
