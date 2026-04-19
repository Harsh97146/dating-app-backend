import express from 'express';
import { getPotentialMatches, swipeUser } from '../controllers/matchController.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

router.use(protect);

router.get('/potentials', getPotentialMatches);
router.post('/swipe', swipeUser);

export default router;
