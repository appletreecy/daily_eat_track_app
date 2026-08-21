import type { Request, Response } from 'express';
import { mealModel } from '../models/mealModel';
import { nutritionCoachService } from '../services/nutritionCoachService';

export const coachController = {
  getDailyInsight: async (req: Request, res: Response) => {
    try {
      const rawDate = req.params.date;
      const date = Array.isArray(rawDate) ? rawDate[0] : rawDate;

      if (!date) {
        return res.status(400).json({ message: 'Date is required' });
      }

      const [summary, meals] = await Promise.all([
        mealModel.getDailySummary(date),
        mealModel.getMealsByDate(date),
      ]);

      const insight = await nutritionCoachService.getDailyInsight(date, summary, meals);
      return res.json(insight);
    } catch (error) {
      console.error('Error generating daily coach insight:', error);
      return res.status(500).json({ message: 'Failed to generate daily coach insight' });
    }
  },
};
