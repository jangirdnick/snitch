import mongoose, { type Document, Schema, type Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { CATEGORY_STATUS } from '@snitch/schemas';

export interface ICategory extends Document {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: (typeof CATEGORY_STATUS)[number];
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    id: {
      type: String,
      default: () => randomUUID(),
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be under 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description must be under 500 characters'],
    },
    status: {
      type: String,
      enum: CATEGORY_STATUS,
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CategorySchema.pre('validate', function () {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

const Category: Model<ICategory> =
  (mongoose.models.Category as Model<ICategory>) ||
  mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
