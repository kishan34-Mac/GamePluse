import mongoose, { Schema, Document } from 'mongoose';

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface ITableOfContentItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface IFAQItem {
  question: string;
  answer: string;
}

export interface IContentBlock {
  type: string;
  text?: string;
  level?: number;
  id?: string;
  src?: string;
  alt?: string;
  caption?: string;
  author?: string;
  role?: string;
  title?: string;
  pros?: string[];
  cons?: string[];
  videoId?: string;
  productId?: string;
  faqs?: IFAQItem[];
}

export interface IArticle extends Document {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: string;
  image: string;
  imageCaption?: string;
  authorId: string;
  publishedAt: Date;
  updatedAt: Date;
  readingTime: string;
  tags: string[];
  featured: boolean;
  trending: boolean;
  popular: boolean;
  editorsPick: boolean;
  status: ArticleStatus;
  isSponsored?: boolean;
  sponsorName?: string;
  sponsorDisclosure?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  contentBlocks?: IContentBlock[];
  rawContent?: string;
  tableOfContents?: ITableOfContentItem[];
  faqs?: IFAQItem[];
  gameId?: string;
  createdAt: Date;
}

const TableOfContentItemSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    level: { type: Number, enum: [2, 3], required: true },
  },
  { _id: false }
);

const FAQItemSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const ContentBlockSchema = new Schema(
  {
    type: { type: String, required: true },
    text: { type: String },
    level: { type: Number },
    id: { type: String },
    src: { type: String },
    alt: { type: String },
    caption: { type: String },
    author: { type: String },
    role: { type: String },
    title: { type: String },
    pros: [{ type: String }],
    cons: [{ type: String }],
    videoId: { type: String },
    productId: { type: String },
    faqs: [FAQItemSchema],
  },
  { _id: false }
);

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    subtitle: { type: String, trim: true },
    excerpt: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true, index: true },
    image: { type: String, required: true },
    imageCaption: { type: String, trim: true },
    authorId: { type: String, required: true, index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    readingTime: { type: String, default: '4 min read', trim: true },
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false, index: true },
    trending: { type: Boolean, default: false, index: true },
    popular: { type: Boolean, default: false, index: true },
    editorsPick: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    isSponsored: { type: Boolean, default: false },
    sponsorName: { type: String, trim: true },
    sponsorDisclosure: { type: String, trim: true },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
    contentBlocks: [ContentBlockSchema],
    rawContent: { type: String },
    tableOfContents: [TableOfContentItemSchema],
    faqs: [FAQItemSchema],
    gameId: { type: String, index: true },
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
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ category: 1, status: 1, publishedAt: -1 });
ArticleSchema.index({ tags: 1, status: 1 });
ArticleSchema.index({ featured: 1, status: 1, publishedAt: -1 });
ArticleSchema.index({ trending: 1, status: 1, publishedAt: -1 });
ArticleSchema.index({ popular: 1, status: 1, publishedAt: -1 });
ArticleSchema.index({
  title: 'text',
  subtitle: 'text',
  excerpt: 'text',
  tags: 'text',
});

export const ArticleModel = mongoose.model<IArticle>('Article', ArticleSchema);
