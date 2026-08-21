import { Router } from 'express';
import { coachController } from '../controllers/coachController';

const router = Router();

router.get('/daily/:date', coachController.getDailyInsight);

export default router;
