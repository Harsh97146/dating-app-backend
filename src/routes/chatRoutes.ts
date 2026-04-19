import express from 'express';
import { getMyMatches, getChatHistory, markMessagesRead } from '../controllers/chatController.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

router.use(protect);

router.get('/my-matches', getMyMatches);
router.get('/history/:matchId', getChatHistory);
router.patch('/read/:matchId', markMessagesRead);

export default router;
