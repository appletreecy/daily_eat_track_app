import { mealModel } from '../models/mealModel';

const AUTOPILOT_TIMEZONE = 'Australia/Sydney';

const sydneyDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: AUTOPILOT_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const getSydneyDateParts = (date: Date) => {
  const parts = sydneyDateFormatter.formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('Failed to format Sydney date parts');
  }

  return { year, month, day };
};

const getYesterdayInSydney = () => {
  const { year, month, day } = getSydneyDateParts(new Date());
  const sydneyCalendarDateUtc = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  sydneyCalendarDateUtc.setUTCDate(sydneyCalendarDateUtc.getUTCDate() - 1);
  return sydneyCalendarDateUtc.toISOString().split('T')[0];
};

export const autopilotService = {
    seedYesterdayIfEmpty: async () => {
        const targetDate = getYesterdayInSydney();
        const meals = await mealModel.getMealsByDate(targetDate);
        
        if (meals.length > 0) {
            return;
        }

        await mealModel.createMeal({
            meal_type: 'breakfast',
            food_name: 'breakfast-seeded',
            calories: 350,
            protein: 15,
            carbs: 40,
            fat: 12,
            had_red_meat: false,
            meal_date: targetDate,
            notes: 'Auto-added by autopilot',
        });
    },
};
