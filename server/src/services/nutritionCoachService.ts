import type { DailySummary, Meal } from '../models/mealModel';

export interface DailyCoachInsight {
  summary: string;
  suggestions: string[];
  warning: string | null;
}

interface OpenAIChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
}

const getHighestCalorieMeal = (meals: Meal[]): Meal | null => {
  if (meals.length === 0) {
    return null;
  }

  return meals.reduce((highestMeal, meal) =>
    Number(meal.calories) > Number(highestMeal.calories) ? meal : highestMeal
  );
};

const buildFallbackInsight = (date: string, summary: DailySummary, meals: Meal[]): DailyCoachInsight => {
  if (summary.meal_count === 0) {
    return {
      summary: `No meals were logged for ${date}, so there is not enough nutrition data to coach from yet.`,
      suggestions: [
        'Log meals as you go through the day so the dashboard can spot patterns more accurately.',
        'Start with calories and macros first, then add notes when something unusual happens.',
      ],
      warning: null,
    };
  }

  const totalCalories = Number(summary.total_calories ?? 0);
  const totalProtein = Number(summary.total_protein ?? 0);
  const totalCarbs = Number(summary.total_carbs ?? 0);
  const totalFat = Number(summary.total_fat ?? 0);
  const redMeatMeals = meals.filter((meal) => Boolean(meal.had_red_meat));
  const highestCalorieMeal = getHighestCalorieMeal(meals);
  const suggestions: string[] = [];

  if (totalProtein < 40) {
    suggestions.push('Protein looks a bit low today, so adding a lean protein source tomorrow could help balance the day.');
  } else if (totalProtein >= 80) {
    suggestions.push('Protein intake looks solid today, so you can focus tomorrow on keeping the same consistency across meals.');
  }

  if (totalFat > totalProtein && totalFat > totalCarbs) {
    suggestions.push('A lot of today leaned toward fat-heavy meals, so pairing those meals with lighter sides could make tomorrow feel more balanced.');
  } else if (totalCarbs < 80) {
    suggestions.push('Carbs were on the lower side, so adding fruit, rice, oats, or potatoes may improve energy through the day.');
  } else {
    suggestions.push('Your macros look reasonably balanced overall, so keeping meal timing consistent would be a good next step.');
  }

  if (redMeatMeals.length > 0) {
    suggestions.push('Since red meat showed up today, consider a fish, tofu, or chicken option tomorrow for a lighter rotation.');
  } else {
    suggestions.push('This was a no-red-meat day, which gives you room to keep variety high with different protein sources.');
  }

  const warning =
    summary.meal_count <= 1
      ? 'Only one meal was logged today, so the totals may not reflect your full intake.'
      : totalCalories < 900
        ? 'Total calories look unusually low, so this day may be under-logged.'
        : totalFat >= 90
          ? 'Fat intake was quite high today compared with the rest of the dashboard totals.'
          : null;

  const summaryParts = [
    `${date} shows ${summary.meal_count} logged meal${summary.meal_count === 1 ? '' : 's'} and about ${Math.round(totalCalories)} calories.`,
  ];

  if (highestCalorieMeal) {
    summaryParts.push(
      `The biggest meal was ${highestCalorieMeal.food_name} at roughly ${Math.round(Number(highestCalorieMeal.calories))} calories.`
    );
  }

  if (redMeatMeals.length > 0) {
    summaryParts.push(`Red meat appeared in ${redMeatMeals.length} meal${redMeatMeals.length === 1 ? '' : 's'}.`);
  }

  return {
    summary: summaryParts.join(' '),
    suggestions: suggestions.slice(0, 3),
    warning,
  };
};

const buildPrompt = (date: string, summary: DailySummary, meals: Meal[]) => `
You are a nutrition coach for a daily meal tracking app.

Analyze the user's nutrition for one day and respond with JSON only.

Date: ${date}

Daily totals:
- Calories: ${summary.total_calories ?? 0}
- Protein: ${summary.total_protein ?? 0}
- Carbs: ${summary.total_carbs ?? 0}
- Fat: ${summary.total_fat ?? 0}
- Meal count: ${summary.meal_count}

Meals:
${meals
  .map(
    (meal) => `- ${meal.meal_type}: ${meal.food_name}
  calories=${meal.calories}
  protein=${meal.protein ?? 0}
  carbs=${meal.carbs ?? 0}
  fat=${meal.fat ?? 0}
  had_red_meat=${meal.had_red_meat ? 'yes' : 'no'}
  notes=${meal.notes ?? 'none'}`
  )
  .join('\n')}

Return JSON only in exactly this shape:
{
  "summary": "1-2 short sentences",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "warning": "one warning sentence or null"
}

Rules:
- Keep the tone practical and supportive.
- Give 2 or 3 suggestions.
- Give one warning only if something looks off, otherwise null.
- Do not include markdown.
`;

const parseInsightResponse = (content: string): DailyCoachInsight | null => {
  const trimmedContent = content.trim();
  const jsonMatch = trimmedContent.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    return null;
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as Partial<DailyCoachInsight>;

    if (typeof parsed.summary !== 'string' || !Array.isArray(parsed.suggestions)) {
      return null;
    }

    return {
      summary: parsed.summary,
      suggestions: parsed.suggestions
        .filter((suggestion): suggestion is string => typeof suggestion === 'string' && suggestion.trim() !== '')
        .slice(0, 3),
      warning: typeof parsed.warning === 'string' ? parsed.warning : null,
    };
  } catch {
    return null;
  }
};

const callOpenAI = async (date: string, summary: DailySummary, meals: Meal[]): Promise<DailyCoachInsight | null> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch(process.env.OPENAI_API_URL ?? 'https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are a practical nutrition coach. Respond with JSON only.',
        },
        {
          role: 'user',
          content: buildPrompt(date, summary, meals),
        },
      ],
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const result = (await response.json()) as OpenAIChatCompletionResponse;
  const content = result.choices?.[0]?.message?.content;

  if (!content) {
    return null;
  }

  return parseInsightResponse(content);
};

export const nutritionCoachService = {
  getDailyInsight: async (date: string, summary: DailySummary, meals: Meal[]): Promise<DailyCoachInsight> => {
    if (summary.meal_count === 0) {
      return buildFallbackInsight(date, summary, meals);
    }

    try {
      const aiInsight = await callOpenAI(date, summary, meals);

      if (aiInsight) {
        return aiInsight;
      }
    } catch (error) {
      console.error('Failed to generate AI coach insight:', error);
    }

    return buildFallbackInsight(date, summary, meals);
  },
};
