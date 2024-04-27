const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  EventName: {
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
  Venues: [{
    venueName: String,
    faculty: String,
    studentCapacity: Number,
  }],
  Batch:{
    type:String,
    required:true
  },
  SelectedSlots:{
    type:[String],
    default:[]
  }
  
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


const Slot = mongoose.model('Slot',studentSchema);
const User = mongoose.model('User',userSchema);
const Admins = mongoose.model('Admins',adminSchema);

module.exports={
  Slot,User,Admins,
}
