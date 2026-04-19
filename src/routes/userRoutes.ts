import express from 'express';
import { updateProfile, getMe, uploadPhoto, getUserById } from '../controllers/userController.ts';
import { protect } from '../middleware/auth.ts';
import { upload } from '../middleware/upload.ts';

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.get('/:id', getUserById);
router.patch('/update', updateProfile);
router.post('/upload', upload.single('photo'), uploadPhoto);

export default router;
