import type { Request, Response } from 'express';
import Swipe from '../models/Swipe.ts';
import Match from '../models/Match.ts';
import User from '../models/User.ts';
import { emitToUser } from '../services/socketService.ts';

/**
 * Get potential matches for the user based on preferences
 */
export const getPotentialMatches = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get IDs of users already swiped
    const swipedUsers = await Swipe.find({ swiper: userId }).distinct('swipedUser');

    // Add current user to exclude list
    swipedUsers.push(userId);

    // Build query based on preferences
    const query: any = {
      _id: { $nin: swipedUsers },
    };

    console.log(`Getting potential matches for user: ${userId}`);
    console.log(`Already swiped count: ${swipedUsers.length - 1}`);

    if (
      user.interestedIn &&
      user.interestedIn.length > 0 &&
      !user.interestedIn.includes('everyone')
    ) {
      query.gender = { $in: user.interestedIn };
    }

    // Find users (limit to 20 for one go)
    const potentials = await User.find(query)
      .limit(20)
      .select('name avatar photos bio interests gender distance jobTitle birthday');

    res.status(200).json({
      status: 'success',
      results: potentials.length,
      data: potentials,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Handle user swipe (like/dislike/superlike)
 */
export const swipeUser = async (req: Request, res: Response) => {
  try {
    const { swipedUserId, type } = req.body;
    const userId = (req as any).user._id;

    if (!['like', 'dislike', 'superlike'].includes(type)) {
      return res.status(400).json({ message: 'Invalid swipe type' });
    }

    // 1. Create the swipe
    const swipe = await Swipe.create({
      swiper: userId,
      swipedUser: swipedUserId,
      type,
    });

    let match = null;

    // 2. Check for mutual match if it's a like or superlike
    if (type === 'like' || type === 'superlike') {
      const mutualSwipe = await Swipe.findOne({
        swiper: swipedUserId,
        swipedUser: userId,
        type: { $in: ['like', 'superlike'] },
      });

      if (mutualSwipe) {
        // Create match
        match = await Match.create({
          users: [userId, swipedUserId],
        });

        // Emit socket event for instant matching
        emitToUser(userId.toString(), 'new match', { match, otherUser: swipedUserId });
        emitToUser(swipedUserId.toString(), 'new match', { match, otherUser: userId });
      }
    }

    res.status(201).json({
      status: 'success',
      data: {
        swipe,
        isMatch: !!match,
        match,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already swiped on this user' });
    }
    res.status(500).json({ message: error.message });
  }
};
