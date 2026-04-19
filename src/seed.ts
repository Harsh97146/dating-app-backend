import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.ts';
import bcrypt from 'bcryptjs';

dotenv.config();

const users = [
  {
    name: 'Sophia Thorne',
    email: 'sophia@example.com',
    password: 'password123',
    mobileNumber: '1234567890',
    gender: 'female',
    interestedIn: ['male', 'female'],
    bio: "Adventure seeker and coffee enthusiast. Let's explore the city!",
    jobTitle: 'Graphic Designer',
    company: 'Pixel Perfect',
    school: 'Design Academy',
    birthday: new Date('1998-05-15'),
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    interests: ['Art', 'Travel', 'Coffee'],
  },
  {
    name: 'Liam Neeson',
    email: 'liam@example.com',
    password: 'password123',
    mobileNumber: '1234567891',
    gender: 'male',
    interestedIn: ['female'],
    bio: 'Looking for someone to share movie nights with. I have a very particular set of skills.',
    jobTitle: 'Actor / Private Eye',
    company: 'Freelance',
    school: 'Drama School',
    birthday: new Date('1990-11-20'),
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    interests: ['Movies', 'Action', 'Reading'],
  },
  {
    name: 'Emma Watson',
    email: 'emma@example.com',
    password: 'password123',
    mobileNumber: '1234567892',
    gender: 'female',
    interestedIn: ['male'],
    bio: 'Books are my best friends. Looking for a conversation partner.',
    jobTitle: 'Librarian',
    company: 'Public Library',
    school: 'Oxford',
    birthday: new Date('1995-03-10'),
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    interests: ['Books', 'Education', 'Nature'],
  },
  {
    name: 'Marcus Chen',
    email: 'marcus@example.com',
    password: 'password123',
    mobileNumber: '1234567893',
    gender: 'male',
    interestedIn: ['female', 'other'],
    bio: 'Fitness freak and food lover. I can cook a mean steak.',
    jobTitle: 'Personal Trainer',
    company: 'Iron Gym',
    school: 'Fitness University',
    birthday: new Date('1992-07-25'),
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    interests: ['Fitness', 'Cooking', 'Hiking'],
  },
  {
    name: 'Isabella Rossi',
    email: 'isabella@example.com',
    password: 'password123',
    mobileNumber: '1234567894',
    gender: 'female',
    interestedIn: ['male'],
    bio: 'Travel is my middle name. 40 countries and counting!',
    jobTitle: 'Travel Blogger',
    company: 'Nomad Life',
    school: 'Global Studies',
    birthday: new Date('1994-12-05'),
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    interests: ['Travel', 'Photography', 'Culture'],
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI is not defined');

    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    // Delete existing users except maybe the main ones?
    // Let's just add them.
    for (const u of users) {
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(u.password, 12);
        await User.create({ ...u, password: hashedPassword });
        console.log(`Created user: ${u.name}`);
      } else {
        console.log(`User already exists: ${u.name}`);
      }
    }

    console.log('Seeding completed');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
