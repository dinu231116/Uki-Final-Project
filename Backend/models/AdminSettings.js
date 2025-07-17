import mongoose from 'mongoose';

const adminSettingsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  openTime: String,
  closeTime: String,
  dailyCapacityKg: Number,
  remainingCapacityKg: Number,
});

const AdminSettings = mongoose.model('AdminSettings', adminSettingsSchema);
export default AdminSettings;
