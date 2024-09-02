const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  date: { type: String, required: true },
  venue: { type: String, required: true },
  rollno: { type: String, required: true },
  
});

module.exports = mongoose.model('Booking', BookingSchema);