import { Router } from 'express';
import { mealController } from '../controllers/mealController';

const router = Router();

router.get('/daily/:date', mealController.getDailySummary);

export default router;
