import mongoose from 'mongoose';

// Subtype schema
const subTypeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  rate: { type: String, required: true },
});

// Detail schema
const detailSchema = new mongoose.Schema({
  dress: { type: String, required: true },
  unit: { type: String, required: true },
  minQty: { type: String, required: true },
  maxQty: { type: String, required: true },
  subtypes: [subTypeSchema],
  delivery: { type: String, required: true },
});

// Service schema
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  details: [detailSchema],
  image: { type: String }, 
}, {
  timestamps: true,
});

export default mongoose.model('Service', serviceSchema);