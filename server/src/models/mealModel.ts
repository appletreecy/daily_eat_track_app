import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database';

export interface Meal extends RowDataPacket {
  id: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  meal_date: string;
  notes: string | null;
  created_at: string;
}

export interface CreateMealInput {
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  meal_date: string;
  notes?: string;
}

export interface DailySummary extends RowDataPacket {
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  meal_count: number;
}

const updatableFields = [
  'meal_type',
  'food_name',
  'calories',
  'protein',
  'carbs',
  'fat',
  'meal_date',
  'notes',
] as const;

type UpdatableField = (typeof updatableFields)[number];
type UpdateMealInput = Partial<CreateMealInput>;

export const mealModel = {
  getAllMeals: async (): Promise<Meal[]> => {
    const [rows] = await pool.query<Meal[]>(
      'SELECT * FROM meals ORDER BY meal_date DESC, created_at DESC'
    );
    return rows;
  },

  getMealById: async (id: number): Promise<Meal | null> => {
    const [rows] = await pool.query<Meal[]>(
      'SELECT * FROM meals WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  getMealsByDate: async (date: string): Promise<Meal[]> => {
    const [rows] = await pool.query<Meal[]>(
      'SELECT * FROM meals WHERE meal_date = ? ORDER BY created_at DESC',
      [date]
    );
    return rows;
  },

  createMeal: async (meal: CreateMealInput): Promise<Meal | null> => {
    const [result] = await pool.query<ResultSetHeader>(
      `
        INSERT INTO meals (
          meal_type,
          food_name,
          calories,
          protein,
          carbs,
          fat,
          meal_date,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        meal.meal_type,
        meal.food_name,
        meal.calories,
        meal.protein ?? null,
        meal.carbs ?? null,
        meal.fat ?? null,
        meal.meal_date,
        meal.notes ?? null,
      ]
    );

    return mealModel.getMealById(result.insertId);
  },

  updateMeal: async (id: number, meal: UpdateMealInput): Promise<Meal | null> => {
    const fields: string[] = [];
    const values: Array<string | number | null> = [];

    for (const field of updatableFields) {
      const value = meal[field as UpdatableField];
      if (value !== undefined) {
        fields.push(`${field} = ?`);
        values.push(value ?? null);
      }
    }

    if (fields.length === 0) {
      return mealModel.getMealById(id);
    }

    values.push(id);

    await pool.query<ResultSetHeader>(
      `UPDATE meals SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return mealModel.getMealById(id);
  },

  deleteMeal: async (id: number): Promise<boolean> => {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM meals WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  },

  getDailySummary: async (date: string): Promise<DailySummary> => {
    const [rows] = await pool.query<DailySummary[]>(
      `
        SELECT
          ? AS date,
          COALESCE(SUM(calories), 0) AS total_calories,
          COALESCE(SUM(protein), 0) AS total_protein,
          COALESCE(SUM(carbs), 0) AS total_carbs,
          COALESCE(SUM(fat), 0) AS total_fat,
          COUNT(*) AS meal_count
        FROM meals
        WHERE meal_date = ?
      `,
      [date, date]
    );

    return rows[0];
  },
};