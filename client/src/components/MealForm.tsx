import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateMealDTO } from '../types';

interface MealFormProps {
    onSubmit: (data: CreateMealDTO) => Promise<void>;
}

interface MealFormState {
  meal_type: CreateMealDTO['meal_type'];
  food_name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  had_red_meat: boolean;
  meal_date: string;
  notes: string;
}

const today = new Date().toISOString().split('T')[0];

const MealForm = ({ onSubmit }: MealFormProps) => {
  const [formData, setFormData] = useState<MealFormState>({
    meal_type: 'breakfast',
    food_name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    had_red_meat: false,
    meal_date: today,
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = event.target;
    const { name } = target;
    const nextValue =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        meal_type: formData.meal_type,
        food_name: formData.food_name,
        calories: Number(formData.calories),
        protein: formData.protein === '' ? undefined : Number(formData.protein),
        carbs: formData.carbs === '' ? undefined : Number(formData.carbs),
        fat: formData.fat === '' ? undefined : Number(formData.fat),
        had_red_meat: formData.had_red_meat,
        meal_date: formData.meal_date,
        notes: formData.notes.trim() === '' ? undefined : formData.notes,
      });

      setFormData({
        meal_type: 'breakfast',
        food_name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        had_red_meat: false,
        meal_date: today,
        notes: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="meal-form card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="meal_type" className="field-label">
            Meal Type
          </label>
          <select
            id="meal_type"
            name="meal_type"
            className="text-input"
            value={formData.meal_type}
            onChange={handleChange}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div className="field field-wide">
          <label htmlFor="food_name" className="field-label">
            Food Name
          </label>
          <input
            id="food_name"
            name="food_name"
            className="text-input"
            type="text"
            value={formData.food_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="calories" className="field-label">
            Calories
          </label>
          <input
            id="calories"
            name="calories"
            className="text-input"
            type="number"
            value={formData.calories}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="protein" className="field-label">
            Protein (g)
          </label>
          <input
            id="protein"
            name="protein"
            className="text-input"
            type="number"
            value={formData.protein}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="carbs" className="field-label">
            Carbs (g)
          </label>
          <input
            id="carbs"
            name="carbs"
            className="text-input"
            type="number"
            value={formData.carbs}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="fat" className="field-label">
            Fat (g)
          </label>
          <input
            id="fat"
            name="fat"
            className="text-input"
            type="number"
            value={formData.fat}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="meal_date" className="field-label">
            Meal Date
          </label>
          <input
            id="meal_date"
            name="meal_date"
            className="text-input"
            type="date"
            value={formData.meal_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field field-full">
          <label className="checkbox-row">
            <input
              type="checkbox"
              name="had_red_meat"
              checked={formData.had_red_meat}
              onChange={handleChange}
            />
            <span>This meal included red meat</span>
          </label>
        </div>

        <div className="field field-full">
          <label htmlFor="notes" className="field-label">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            className="text-input text-area"
            value={formData.notes ?? ''}
            onChange={handleChange}
            rows={5}
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Meal'}
        </button>
      </div>
    </form>
  );
};

export default MealForm;
