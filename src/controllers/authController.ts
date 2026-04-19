import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.ts';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '24h',
  });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    console.log('Signup request received:', req.body.email);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      password: req.body.password,
    });

    console.log('User created successfully:', newUser.email);
    createSendToken(newUser, 201, res);
  } catch (err: any) {
    console.error('Signup error:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await (user as any).correctPassword(password, (user as any).password))) {
      console.log('Authentication failed for:', email);
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    console.log('Login successful for:', email);
    createSendToken(user, 200, res);
  } catch (err: any) {
    console.error('Login error:', err.message);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { googleId, email, name, avatar } = req.body;

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        password: Math.random().toString(36).slice(-10),
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (avatar) (user as any).avatar = avatar;
      await user.save();
    }

    createSendToken(user, 200, res);
  } catch (err: any) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
