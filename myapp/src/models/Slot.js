const mongoose = require('mongoose');
const Batch = require('./Batch');


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
  batch:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  SelecedBatch:{
    type:String,
    required:true,
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
  // batch:{type:String,required:true},
  batch:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  rollno:{type:String,required:true},
});

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' } 
});


const Slot = mongoose.model('Slot',studentSchema);
const User = mongoose.model('User',userSchema);
const Admins = mongoose.model('Admins',adminSchema);


module.exports={
  Slot,User,Admins,
}
