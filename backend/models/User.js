import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyname: { type: String },
  type: { type: String }, // e.g., 'supplier', 'organizer', etc.
  eventType: { type: String },
  serviceType: { type: String },
  address: { type: String },
  taxid: { type: String },
  phone: { type: String }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
