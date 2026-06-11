import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be at least 0'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Books',
        'Drafters & Tools',
        'Calculators',
        'Electronics',
        'Lab Equipment',
        'Project Components',
        'Hostel Essentials',
        'Others',
      ],
    },
    condition: {
      type: String,
      required: [true, 'Please select the item condition'],
      enum: ['New', 'Like New', 'Good', 'Fair'],
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    state: { type: String, required: [true, 'State is required'] },
    city: { type: String, required: [true, 'City is required'] },
    college: { type: String, required: [true, 'College is required'] },
    status: {
      type: String,
      enum: ['active', 'sold'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Indexes for faster filtering
listingSchema.index({ state: 1, city: 1, college: 1, category: 1, title: 'text' });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
