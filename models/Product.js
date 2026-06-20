import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please select a category']
  },
  stockCount: {
    type: Number,
    required: true,
    default: 0
  },
  images: [
    {
      url: { type: String, required: true }
    }
  ],
  reviews: [ReviewSchema]
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);