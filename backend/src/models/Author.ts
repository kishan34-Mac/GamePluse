import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthor extends Document {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  role: string;
  socialLinks?: {
    twitter?: string;
    email?: string;
    website?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    bio: { type: String, default: '', trim: true },
    avatar: { type: String, default: '' },
    role: { type: String, default: 'Staff Writer', trim: true },
    socialLinks: {
      twitter: { type: String, trim: true },
      email: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    isActive: { type: Boolean, default: true, index: true },
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

// Unique: true automatically creates index

export const AuthorModel = mongoose.model<IAuthor>('Author', AuthorSchema);
