import api from './api';
import type { DailyCoachInsight } from '../types';

export const coachService = {
  getDailyInsight: async (date: string): Promise<DailyCoachInsight> => {
    const response = await api.get(`/coach/daily/${date}`);
    return response.data;
  },
};
