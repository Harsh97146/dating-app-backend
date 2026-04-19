import { Server as SocketIOServer, Socket } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let io: SocketIOServer;

export const initSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // In production, replace with your frontend URL
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Join a private room for the user
    socket.on('setup', (userData: any) => {
      socket.join(userData._id);
      socket.emit('connected');
    });

    // Join chat room
    socket.on('join chat', (room: string) => {
      socket.join(room);
      console.log('User Joined Room:', room);
    });

    // Typing indicators
    socket.on('typing', (room: string) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room: string) => socket.in(room).emit('stop typing'));

    // New message
    socket.on('new message', (newMessageReceived: any) => {
      const match = newMessageReceived.match;

      if (!match || !match.users) return console.log('match.users not defined');

      match.users.forEach((user: any) => {
        if (user._id === newMessageReceived.sender._id) return;

        socket.in(user._id).emit('message received', newMessageReceived);
      });
    });

    // WebRTC Signaling
    socket.on(
      'call user',
      (data: { userToCall: string; signalData: any; from: string; name: string }) => {
        io.to(data.userToCall).emit('call incoming', {
          signal: data.signalData,
          from: data.from,
          name: data.name,
        });
      },
    );

    socket.on('answer call', (data: { to: string; signal: any }) => {
      io.to(data.to).emit('call accepted', data.signal);
    });

    socket.on('ice-candidate', (data: { to: string; candidate: any }) => {
      io.to(data.to).emit('ice-candidate', data.candidate);
    });

    // Message read receipts
    socket.on('message read', (data: { matchId: string; userId: string }) => {
      socket.in(data.matchId).emit('message read', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const emitToUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(userId).emit(event, data);
  }
};
