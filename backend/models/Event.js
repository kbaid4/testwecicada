import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  budget: { type: Number },
  type: { type: String },
  subType: { type: String },
  addadmin: { type: String },
  location: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  documents: [
    {
      filename: String,
      path: String,
      originalname: String,
      uploadDate: { type: Date, default: Date.now },
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
    }
  ]
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
