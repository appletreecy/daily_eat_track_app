import api from './api';
import type { Meal, CreateMealDTO, DailySummary } from '../types';

export const mealService = {
  getAllMeals: async (): Promise<Meal[]> => {
    const response = await api.get('/meals');
    return response.data;
  },

  getMealById: async (id: number): Promise<Meal> => {
    const response = await api.get(`/meals/${id}`);
    return response.data;
  },

  getMealsByDate: async (date: string): Promise<Meal[]> => {
    const response = await api.get(`/meals/date/${date}`);
    return response.data;
  },

  createMeal: async (meal: CreateMealDTO): Promise<Meal> => {
    const response = await api.post('/meals', meal);
    return response.data;
  },

  updateMeal: async (id: number, meal: Partial<CreateMealDTO>): Promise<Meal> => {
    const response = await api.put(`/meals/${id}`, meal);
    return response.data;
  },

  deleteMeal: async (id: number): Promise<void> => {
    await api.delete(`/meals/${id}`);
  },

  getDailySummary: async (date: string): Promise<DailySummary> => {
    const response = await api.get(`/summary/daily/${date}`);
    return response.data;
  },
};