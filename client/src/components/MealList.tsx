import type { Meal } from '../types';

interface MealListProps {
  meals: Meal[];
  deletingMealId: number | null;
  onDeleteMeal: (meal: Meal) => Promise<void>;
}

const MealList = ({ meals, deletingMealId, onDeleteMeal }: MealListProps) => {
  return (
    <section className="card">
      <div className="card-header">
        <h3 className="card-title">Meals</h3>
        <span className="badge">{meals.length} item(s)</span>
      </div>

      {meals.length === 0 ? (
        <p className="muted-text">No meals logged yet for this date.</p>
      ) : (
        <div className="meal-list">
          {meals.map((meal) => (
            <article key={meal.id} className="meal-item">
              <div className="meal-item-top">
                <div>
                  <p className="meal-type">{meal.meal_type}</p>
                  <h4 className="meal-name">{meal.food_name}</h4>
                </div>
                <div className="meal-calories">{meal.calories} kcal</div>
              </div>

              <div className="meal-meta">
                <span>Date: {meal.meal_date}</span>
                <span>Protein: {meal.protein ?? 0}g</span>
                <span>Carbs: {meal.carbs ?? 0}g</span>
                <span>Fat: {meal.fat ?? 0}g</span>
              </div>
              {meal.had_red_meat ? <p className="meal-tag">Included red meat</p> : null}

              {meal.notes ? <p className="meal-notes">Notes: {meal.notes}</p> : null}
              <div className="meal-action">
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => void onDeleteMeal(meal)}
                  disabled={deletingMealId === meal.id}
                >
                  {deletingMealId === meal.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default MealList;
