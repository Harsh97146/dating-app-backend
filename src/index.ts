import { createServer } from 'http';
import dotenv from 'dotenv';
import connectDB from './config/db.ts';
import app from './app.ts';
import { initSocket } from './services/socketService.ts';

dotenv.config();

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    const httpServer = createServer(app);
    const port = process.env.PORT || 3000;

    // Initialize Socket.io
    initSocket(httpServer);

    httpServer.listen(Number(port), '0.0.0.0', () => {
      console.log(`Server is running at http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
