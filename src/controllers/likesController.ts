import type { Request, Response } from 'express';
import Swipe from '../models/Swipe.ts';

/**
 * Get users who liked the current user but no mutual match yet
 */
export const getIncomingLikes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    // Users who Liked/Superliked current user
    const likes = await Swipe.find({
      swipedUser: userId,
      type: { $in: ['like', 'superlike'] },
    })
      .populate('swiper', 'name avatar bio interests gender isVerified')
      .sort({ createdAt: -1 });

    // Filter out if current user already swiped back (in case match was already handled)
    const activeLikes = [];
    for (const like of likes) {
      const swipedBack = await Swipe.findOne({
        swiper: userId,
        swipedUser: (like.swiper as any)._id,
      });

      if (!swipedBack) {
        activeLikes.push(like);
      }
    }

    res.status(200).json({
      status: 'success',
      results: activeLikes.length,
      data: activeLikes,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
