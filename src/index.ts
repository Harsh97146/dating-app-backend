import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import connectDB from './config/db.ts';
import authRoutes from './routes/authRoutes.ts';
import matchRoutes from './routes/matchRoutes.ts';
import chatRoutes from './routes/chatRoutes.ts';
import likesRoutes from './routes/likesRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import { initSocket } from './services/socketService.ts';

import path from 'path';

dotenv.config();

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    const app = express();
    const httpServer = createServer(app);
    const port = process.env.PORT || 3000;

    // Initialize Socket.io
    initSocket(httpServer);

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

    httpServer.listen(Number(port), '0.0.0.0', () => {
      console.log(`Server is running at http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
