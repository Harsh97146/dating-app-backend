import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    type: {
      type: String,
      enum: ['text', 'image', 'video_call_notification'],
      default: 'text',
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
