import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.ts';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: 'You are not logged in! Please log in to get access.' });
    }

    // 2. Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res
        .status(401)
        .json({ message: 'The user belonging to this token no longer exists.' });
    }

    // Grant access to protected route
    (req as any).user = currentUser;
    next();
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid token or session expired' });
  }
};
