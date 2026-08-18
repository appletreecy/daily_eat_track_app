import { Request, Response } from 'express';
import { mealModel } from '../models/mealModel';

export const mealController = {
  getAllMeals: async (_req: Request, res: Response) => {
    try {
      const meals = await mealModel.getAllMeals();
      res.json(meals);
    } catch (error) {
      console.error('Error fetching meals:', error);
      res.status(500).json({ message: 'Failed to fetch meals' });
    }
  },

  getMealById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid meal id' });
      }

      const meal = await mealModel.getMealById(id);

      if (!meal) {
        return res.status(404).json({ message: 'Meal not found' });
      }

      res.json(meal);
    } catch (error) {
      console.error('Error fetching meal:', error);
      res.status(500).json({ message: 'Failed to fetch meal' });
    }
  },

  getMealsByDate: async (req: Request, res: Response) => {
    try {
      const rawData = req.params.date;
      const date = Array.isArray(rawData) ? rawData[0] : rawData;
      const meals = await mealModel.getMealsByDate(date);
      res.json(meals);
    } catch (error) {
      console.error('Error fetching meals by date:', error);
      res.status(500).json({ message: 'Failed to fetch meals by date' });
    }
  },

  createMeal: async (req: Request, res: Response) => {
    try {
      const { meal_type, food_name, calories, protein, carbs, fat, meal_date, notes } = req.body;

      if (!meal_type || !food_name || calories === undefined || !meal_date) {
        return res.status(400).json({
          message: 'meal_type, food_name, calories, and meal_date are required',
        });
      }

      const createdMeal = await mealModel.createMeal({
        meal_type,
        food_name,
        calories: Number(calories),
        protein: protein !== undefined ? Number(protein) : undefined,
        carbs: carbs !== undefined ? Number(carbs) : undefined,
        fat: fat !== undefined ? Number(fat) : undefined,
        meal_date,
        notes,
      });

      res.status(201).json(createdMeal);
    } catch (error) {
      console.error('Error creating meal:', error);
      res.status(500).json({ message: 'Failed to create meal' });
    }
  },

  updateMeal: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid meal id' });
      }

      const updatedMeal = await mealModel.updateMeal(id, req.body);

      if (!updatedMeal) {
        return res.status(404).json({ message: 'Meal not found' });
      }

      res.json(updatedMeal);
    } catch (error) {
      console.error('Error updating meal:', error);
      res.status(500).json({ message: 'Failed to update meal' });
    }
  },

  deleteMeal: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid meal id' });
      }

      const deleted = await mealModel.deleteMeal(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Meal not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting meal:', error);
      res.status(500).json({ message: 'Failed to delete meal' });
    }
  },

  getDailySummary: async (req: Request, res: Response) => {
    try {
      const rawData = req.params.date;
      const date = Array.isArray(rawData) ? rawData[0] : rawData;
      const summary = await mealModel.getDailySummary(date);
      res.json(summary);
    } catch (error) {
      console.error('Error fetching daily summary:', error);
      res.status(500).json({ message: 'Failed to fetch daily summary' });
    }
  },
};