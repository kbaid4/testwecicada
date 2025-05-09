import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  rating: { type: Number, default: 0 },
  services: [{ type: String }],
  companyname: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  taxid: { type: String }
}, { timestamps: true });

export default mongoose.model('Supplier', supplierSchema);
