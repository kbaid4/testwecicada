import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  status: { type: String, default: 'Pending' },
  date: { type: Date },
  budget: { type: Number },
  completed: { type: Boolean, default: false },
  progress: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
