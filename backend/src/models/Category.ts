import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  heroImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: '', trim: true },
    icon: { type: String, default: 'BookOpen' },
    heroImage: { type: String, default: '' },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    status: { type: String, enum: ['active', 'archived'], default: 'active', index: true },
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

// Slug has unique: true which automatically creates the index.

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
