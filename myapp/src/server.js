const express = require('express'); 
const mongoose = require('mongoose');
const Batch = require('./models/Batch')
const Booking = require('./models/Booking');
const { User, Slot, Admins,} = require('./models/Slot');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
app.use(cors()); 
app.use(bodyParser.json()); 




app.post('/user',async (req,res)=>{
  const {username,email,password,rollno, batch}=req.body;
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingBatch = await Batch.findById(batch);
    if (!existingBatch) {
      return res.status(400).json({ error: 'Invalid batch ID' });
    }
    const newUser = new User({username,email, password: hashedPassword,rollno,batch: existingBatch._id, });
    await newUser.save();
    res.json({ message: 'User added successfully!' });
  }
  catch (error) {
    console.error('Error User adding:', error);
    console.warn('server fault');
    res.status(500).json({ error: 'Error User adding' });
  }
})


app.post('/admin',async (req,res)=>{
  const {username,email,password}=req.body;
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admins({username,email, password: hashedPassword});
    await newAdmin.save();
    res.json({ message: 'Admin added successfully!' });
  }
  catch (error) {
    console.error('Error Admin adding:', error);
    console.warn('server fault');
    res.status(500).json({ error: 'Error Admin adding' });
  }
})
app.post('/api/alogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admins.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    res.json({ success: true, admin: "super" }); 
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'Server error' }); 
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    res.json({ success: true, user: "super" }); 
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' }); 
  }
});

app.post('/slots', async (req, res) => {
  const { EventName, Date, Venue, batch, Venues, SelectedSlots,SelecedBatch } = req.body;

  try {
    const existingBatch = await Batch.findById(batch);
    if (!existingBatch) {
      return res.status(400).json({ error: 'Invalid batch ID' });
    }
     const newSlot = new Slot({
       EventName,
       Date,
       Venue,
       batch:existingBatch._id, 
       Venues,
       SelectedSlots,
       SelecedBatch,
     });
     await newSlot.save();
     res.json({ message: 'Slot saved successfully!' });
  } catch (error) {
     console.error('Error saving slot:', error);
     res.status(500).json({ error: 'Error saving slot' });
  }
 });

  app.get('/slots', async (req, res) => {
    try {
      const slots = await Slot.find()
      res.json(slots); 
    } catch (error) {
      console.error('Error fetching slots:', error);
      res.status(500).json({ message: 'Error fetching slots' }); // Handle errors gracefully
    }
  });

  app.get('/batches', async (req, res) => {
    try {
      const batches = await Batch.find(); // Fetch all batch documents
      res.json(batches); // Send the retrieved batches as JSON
    } catch (error) {
      console.error('Error fetching batches:', error);
      res.status(500).json({ message: 'Error fetching batches' }); // Handle errors gracefully
    }
  });

  app.post('/book-slot', async (req, res) => {
    const { eventName, date, venue, studentId, slotId } = req.body;
    try {
      const newBooking = new Booking({
        eventName,
        date,
        venue,
        studentId,
        slotId
      });
      await newBooking.save();
  
      // Optionally, update the slot document
      const slot = await Slot.findById(slotId);
      if (slot) {
        slot.SelectedSlots.push(studentId); // Update as necessary
        await slot.save();
      }
  
      res.status(200).json({ message: 'Slot booked successfully!' });
    } catch (error) {
      console.error('Error booking slot:', error);
      res.status(500).json({ error: 'Error booking slot' });
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

app.get('/batches', async (req, res) => {
  try {
    const batches = await Batch.find(); // Assuming Batch is your model
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Error fetching batches' }); // Handle errors gracefully
  }
});