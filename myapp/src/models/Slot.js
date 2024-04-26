const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  EventName: {
    type: String,
    required: true
  },
  Duration: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    required: true
  },
  Venue: {
    type: Number,
    required: true
  },
  Batch:{
    type:String,
    required:true
  }
  
});

module.exports = mongoose.model('Slot', studentSchema);
