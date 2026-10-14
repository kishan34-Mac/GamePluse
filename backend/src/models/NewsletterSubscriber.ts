import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletterSubscriber extends Document {
  id: string;
  email: string;
  status: 'subscribed' | 'unsubscribed' | 'pending';
  consentTimestamp: Date;
  confirmedAt?: Date;
  unsubscribeTokenHash: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['subscribed', 'unsubscribed', 'pending'],
      default: 'subscribed',
      index: true,
    },
    consentTimestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    confirmedAt: {
      type: Date,
    },
    unsubscribeTokenHash: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: 'website_footer',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        delete ret.unsubscribeTokenHash;
        return ret;
      },
    },
  }
);

// Unique: true automatically creates index on email

export const NewsletterSubscriberModel = mongoose.model<INewsletterSubscriber>(
  'NewsletterSubscriber',
  NewsletterSubscriberSchema
);
