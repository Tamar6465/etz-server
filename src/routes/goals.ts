import { Router } from 'express';
import {
    getTopLevelGoals,
    getGoalWithChildren,
    createGoal,
    updateGoal,
    deleteGoal
} from '../controllers/goals';
import {
    createProgressUpdate,
    getProgressUpdates
} from '../controllers/progressUpdates';

const router = Router();

router.get('/', getTopLevelGoals);
router.get('/:id', getGoalWithChildren);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

// עדכוני התקדמות
router.post('/:id/updates', createProgressUpdate);
router.get('/:id/updates', getProgressUpdates);

export default router;

