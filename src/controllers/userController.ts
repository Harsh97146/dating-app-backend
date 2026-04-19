import type { Request, Response } from 'express';
import User from '../models/User.ts';

/**
 * Update user profile details
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    console.log('Update profile request for user:', userId);
    console.log('Update data:', req.body);

    const {
      name,
      bio,
      birthday,
      gender,
      interestedIn,
      interests,
      videoCallEnabled,
      photos,
      jobTitle,
      company,
      school,
      height,
      relationshipGoal,
      lifestyle,
      prompts,
      hideAge,
      showLocation,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        bio,
        birthday,
        gender,
        interestedIn,
        interests,
        videoCallEnabled,
        photos,
        jobTitle,
        company,
        school,
        height,
        relationshipGoal,
        lifestyle,
        prompts,
        hideAge,
        showLocation,
      },
      { new: true, runValidators: true },
    );

    console.log('Profile updated successfully');
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get current user profile
 */
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const user = await User.findById(userId);

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Upload profile photo
 */
export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Please upload a file' });
      return;
    }

    // Replace backslashes with forward slashes for URL
    const filePath = req.file.path.replace(/\\/g, '/');
    // Store as relative path so it works across devices (emulator, physical, etc.)
    const relativePath = `/${filePath}`;

    console.log('Photo uploaded:', relativePath);

    res.status(200).json({
      status: 'success',
      url: relativePath,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Get any user by ID (public profile)
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-email -mobileNumber'); // Exclude sensitive info

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
