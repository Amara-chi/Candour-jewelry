import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
    index: true
  },
  slug: {
    type: String,
    unique: true,
    index: true,
    sparse: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be positive']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price must be positive']
  },
  costPerItem: {
    type: Number,
    min: [0, 'Cost must be positive']
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  barcode: {
    type: String
  },
  trackQuantity: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  continueSellingWhenOutOfStock: {
    type: Boolean,
    default: false
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  collections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection'
  }],

  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  images: [{
    public_id: {
      type: String,
      // required: true
    },
    url: {
      type: String,
      // required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  variants: [{
    name: String,
    options: [String],
    prices: Map
  }],
  options: [{
    name: String,
    values: [String]
  }],
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'kg', 'oz', 'lb'],
      default: 'g'
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'in'],
      default: 'cm'
    }
  },
  vendor: String,
  type: {
    type: String,
    enum: ['physical', 'digital'],
    default: 'physical'
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    if (this.name) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100);
    }
  }
  next();
});

// Virtual for inStock
productSchema.virtual('inStock').get(function() {
  return this.quantity > 0;
});

// Index for search
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  'seo.keywords': 'text'
});

// Static method for search
productSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query },
    status: 'active'
  }).sort({ score: { $meta: 'textScore' } });
};

export default mongoose.model('Product', productSchema);
