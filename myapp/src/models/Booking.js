const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  date: { type: String, required: true },
  venue: { type: String, required: true },
  rollno: { type: String, required: true },
  booked: { type: Boolean, default: false },
  slot:{ type: String, default: false },
  slotId: {
        type:String,
        required: true
    },
  
});

const SlotFeedbackSchema = new mongoose.Schema({
  slotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Slot',
  },
  scale: {
      type: Number,
      required: true,
      min: 1,
      max: 5
  },
  remarks: {
      type: String,
      required: true
  },
  rollno: {
      type: String,
      required: true
  },
  date: {
      type: Date,
      required: true
  },
  venue: {
      type: String,
      required: true
  }
});

const Booking = mongoose.model('Booking', BookingSchema);
const SlotFeedback = mongoose.model('SlotFeedback', SlotFeedbackSchema);

module.exports = { Booking, SlotFeedback };