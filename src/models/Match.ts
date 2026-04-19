import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  },
);

// Ensure a match always has 2 users
matchSchema.path('users').validate(function (value) {
  return value.length === 2;
}, 'A match must have exactly two users.');

const Match = mongoose.model('Match', matchSchema);

export default Match;
