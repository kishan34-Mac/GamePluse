import mongoose, { Schema, Document } from 'mongoose';

export interface IScoreBreakdown {
  score: number;
  details: string;
}

export interface IReview extends Document {
  id: string;
  gameId: string;
  slug: string;
  title: string;
  score: number;
  verdict: string;
  pros: string[];
  cons: string[];
  gameplay: IScoreBreakdown;
  graphics: IScoreBreakdown;
  performance: IScoreBreakdown;
  audio: IScoreBreakdown;
  replayability: IScoreBreakdown;
  finalVerdict: string;
  authorId: string;
  publishedAt: Date;
  coverImage?: string;
  status: 'draft' | 'published' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScoreBreakdownSchema = new Schema(
  {
    score: { type: Number, required: true, min: 0, max: 10 },
    details: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ReviewSchema = new Schema<IReview>(
  {
    gameId: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0, max: 10, index: true },
    verdict: { type: String, required: true, trim: true },
    pros: [{ type: String, trim: true }],
    cons: [{ type: String, trim: true }],
    gameplay: { type: ScoreBreakdownSchema, required: true },
    graphics: { type: ScoreBreakdownSchema, required: true },
    performance: { type: ScoreBreakdownSchema, required: true },
    audio: { type: ScoreBreakdownSchema, required: true },
    replayability: { type: ScoreBreakdownSchema, required: true },
    finalVerdict: { type: String, required: true, trim: true },
    authorId: { type: String, required: true, index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    coverImage: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published', index: true },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Unique: true automatically creates index on slug
ReviewSchema.index({ status: 1, publishedAt: -1 });

export const ReviewModel = mongoose.model<IReview>('Review', ReviewSchema);
