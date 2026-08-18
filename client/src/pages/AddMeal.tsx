import { useState } from 'react';
import MealForm from '../components/MealForm';
import { mealService } from '../services/mealService';
import type { CreateMealDTO } from '../types';

const AddMeal = () => {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (meal: CreateMealDTO) => {
    try {
      await mealService.createMeal(meal);
      setIsError(false);
      setMessage('Meal added successfully.');
    } catch (error) {
      console.error('Error adding meal:', error);
      setIsError(true);
      setMessage('Failed to add meal.');
    }
  };

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Add Meal</h2>
          <p className="section-subtitle">Log what you ate and track calories and macros</p>
        </div>
      </div>

      {message ? (
        <div className={isError ? 'alert alert-error' : 'alert alert-success'}>{message}</div>
      ) : null}

      <MealForm onSubmit={handleSubmit} />
    </section>
  );
};

export default AddMeal;
