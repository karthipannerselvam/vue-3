const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({

    year: { type: String, required: true }  
  });


  module.exports =  mongoose.model('Batch', batchSchema);