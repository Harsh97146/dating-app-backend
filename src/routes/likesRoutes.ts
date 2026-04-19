import express from 'express';
import { getIncomingLikes } from '../controllers/likesController.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

router.use(protect);

router.get('/incoming', getIncomingLikes);

export default router;
