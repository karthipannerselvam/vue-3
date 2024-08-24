const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  eventName: String,
  date: String,
  venue: String,
  studentId: mongoose.Schema.Types.ObjectId,
  slotId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Booking', BookingSchema);