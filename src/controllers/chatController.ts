import type { Request, Response } from 'express';
import Match from '../models/Match.ts';
import Message from '../models/Message.ts';

/**
 * Get list of all mutual matches for the user
 */
export const getMyMatches = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const matches = await Match.find({
      users: { $in: [userId] },
    })
      .populate('users', 'name avatar bio isVerified')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      status: 'success',
      data: matches,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get chat history for a specific match
 */
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const userId = (req as any).user._id;

    // Verify user is part of the match
    const match = await Match.findOne({
      _id: matchId as any,
      users: { $in: [userId] },
    });

    if (!match) {
      return res.status(403).json({ message: 'Unauthorized to view this chat' });
    }

    const messages = await Message.find({ match: matchId as any })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar');

    res.status(200).json({
      status: 'success',
      data: messages,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mark messages as read
 */
export const markMessagesRead = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const userId = (req as any).user._id;

    await Message.updateMany(
      {
        match: matchId as any,
        sender: { $ne: userId as any },
        readBy: { $ne: userId as any },
      },
      {
        $addToSet: { readBy: userId as any },
      },
    );

    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
