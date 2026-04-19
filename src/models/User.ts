import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Please provide your mobile number'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    googleId: {
      type: String,
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    photos: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    birthday: {
      type: Date,
    },
    gender: {
      type: String,
      default: '',
    },
    interestedIn: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    jobTitle: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    school: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    relationshipGoal: {
      type: String,
      enum: [
        'Long-term Partner',
        'Casual Dating',
        'Life Partner',
        'Not sure yet',
        'long-term partner',
        'long-term, open to short',
        'short-term, open to long',
        'short-term fun',
        'new friends',
        'still figuring it out',
        '',
      ],
      default: '',
    },
    lifestyle: {
      drinking: {
        type: String,
        enum: [
          'Socially',
          'Never',
          'Frequently',
          'Sober',
          'socially',
          'never',
          'frequently',
          'sober',
          '',
        ],
        default: '',
      },
      smoking: {
        type: String,
        enum: [
          'Socially',
          'Never',
          'Frequently',
          'Non-smoker',
          'socially',
          'never',
          'frequently',
          'non-smoker',
          '',
        ],
        default: '',
      },
      exercise: {
        type: String,
        enum: ['Active', 'Sometimes', 'Almost never', 'active', 'sometimes', 'almost never', ''],
        default: '',
      },
      starSign: {
        type: String,
        default: '',
      },
      religion: {
        type: String,
        default: '',
      },
    },
    prompts: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    videoCallEnabled: {
      type: Boolean,
      default: false,
    },
    hideAge: {
      type: Boolean,
      default: false,
    },
    showLocation: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    superLikeCount: {
      type: Number,
      default: 0,
    },
    lastSuperLike: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  // Hash password with cost of 12
  const passwordHash = await bcrypt.hash((this as any).password, 12);
  (this as any).password = passwordHash;
});

// Method to check if password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
