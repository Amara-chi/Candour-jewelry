import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters'],
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  image: {
    public_id: String,
    url: String,
    alt: String
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const generateSlug = (name) => name
  .toLowerCase()
  .replace(/[^a-z0-9 -]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-');

// Generate slug before validation so required slug passes
categorySchema.pre('validate', function(next) {
  if ((this.isModified('name') || !this.slug) && this.name) {
    this.slug = generateSlug(this.name);
  }
  next();
});

// Ensure slug updates on name changes via findOneAndUpdate
categorySchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() || {};
  const name = update.name || update.$set?.name;
  if (name) {
    const slug = generateSlug(name);
    if (update.$set) {
      update.$set.slug = slug;
    } else {
      update.slug = slug;
    }
    this.setUpdate(update);
  }
  next();
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Index for search
categorySchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Category', categorySchema);
