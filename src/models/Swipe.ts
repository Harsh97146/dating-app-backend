import mongoose from 'mongoose';

const swipeSchema = new mongoose.Schema(
  {
    swiper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    swipedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'dislike', 'superlike'],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate swipes from the same user to the same target
swipeSchema.index({ swiper: 1, swipedUser: 1 }, { unique: true });

const Swipe = mongoose.model('Swipe', swipeSchema);

export default Swipe;
