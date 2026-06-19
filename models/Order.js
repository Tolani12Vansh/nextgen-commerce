import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Please provide a name']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  shippingAddress: {
    type: String,
    required: [true, 'Please provide a shipping address']
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered'],
    default: 'Processing'
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);