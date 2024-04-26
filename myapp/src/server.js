const express = require('express'); 
const mongoose = require('mongoose');
const Slot = require('./models/Slot');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors()); 
app.use(bodyParser.json()); 
// const newStudent = new Slot({EventName: 'John Doe', Duration: '5 min',Date:'12/12/12',Venues:5 });
// newStudent.save()
//   .then(() => console.log('Student saved'))
//   .catch(error => console.error('Error saving student:', error));
app.post('/slots', async (req, res) => {
    const { EventName, Duration, Date, Venue,Batch } = req.body;
    try {
      const newSlot = new Slot({ EventName, Duration, Date, Venue ,Batch});
      await newSlot.save();
      res.json({ message: 'Slot saved successfully!' });
    } catch (error) {
      console.error('Error saving slot:', error);
      console.warn('server fault');
      res.status(500).json({ error: 'Error saving slot' });
    }
  });




const connectionString = 'mongodb://127.0.0.1:27017/Student'; 

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


app.listen(3030, () => console.log('Server listening on port 3030'));
