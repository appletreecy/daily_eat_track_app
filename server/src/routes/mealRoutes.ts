import { Router } from 'express';
import { mealController } from '../controllers/mealController';

const router = Router();

router.get('/', mealController.getAllMeals);
router.get('/date/:date', mealController.getMealsByDate);
router.get('/:id', mealController.getMealById);
router.post('/', mealController.createMeal);
router.put('/:id', mealController.updateMeal);
router.delete('/:id', mealController.deleteMeal);

export default router;
