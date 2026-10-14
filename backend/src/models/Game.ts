import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover: string;
  heroImage?: string;
  genre: string;
  platforms: string[];
  developer: string;
  publisher: string;
  releaseDate: string;
  score?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    cover: { type: String, required: true },
    heroImage: { type: String, default: '' },
    genre: { type: String, required: true, trim: true },
    platforms: [{ type: String, trim: true }],
    developer: { type: String, required: true, trim: true },
    publisher: { type: String, required: true, trim: true },
    releaseDate: { type: String, required: true, trim: true },
    score: { type: Number, min: 0, max: 10 },
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
GameSchema.index({ title: 'text', description: 'text' });

export const GameModel = mongoose.model<IGame>('Game', GameSchema);
