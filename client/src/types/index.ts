export interface Meal{
    id: number;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    food_name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    had_red_meat: number;
    meal_date:string;
    notes?: string;
    created_at: string;
}

export interface CreateMealDTO{
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    food_name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    had_red_meat?: boolean;
    meal_date:string;
    notes?: string;
}

export interface DailySummary{
    date: string;
    total_calories: number;
    total_protein?: number;
    total_carbs?: number;
    total_fat?: number;
    meal_count: number;
}

export interface DailyCoachInsight {
    summary: string;
    suggestions: string[];
    warning: string | null;
    responseTimeMs: number | null;
    responseSource: 'openai' | 'fallback';
}
