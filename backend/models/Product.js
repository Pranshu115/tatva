import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['steel', 'cement', 'aggregates', 'masonry', 'electrical', 'plumbing', 'hardware', 'other'],
    lowercase: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'ton', 'bag', 'cft', 'nos', 'sqft', 'meter', 'liter'],
    lowercase: true
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative']
  },
  minOrderQuantity: {
    type: Number,
    default: 1,
    min: [1, 'Minimum order quantity must be at least 1']
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Supplier is required']
  },
  specifications: {
    grade: String,
    brand: String,
    dimensions: String,
    weight: Number,
    color: String,
    material: String,
    certification: [String]
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ supplier: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });

// Virtual for total value of stock
productSchema.virtual('stockValue').get(function() {
  return this.price * this.stock;
});

// Pre-save middleware to update supplier's product count
productSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Update supplier's product count
    await mongoose.model('User').findByIdAndUpdate(
      this.supplier,
      { $inc: { 'stats.totalProducts': 1 } }
    );
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;