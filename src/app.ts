import express, { type Request, type Response } from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes.ts';
import matchRoutes from './routes/matchRoutes.ts';
import chatRoutes from './routes/chatRoutes.ts';
import likesRoutes from './routes/likesRoutes.ts';
import userRoutes from './routes/userRoutes.ts';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Slide Dating App Backend is running!');
});

export default app;
