const express = require('express'); 
const mongoose = require('mongoose');

const { User, Slot, Admins } = require('./models/Slot');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
app.use(cors()); 
app.use(bodyParser.json()); 





app.post('/user',async (req,res)=>{
  const {username,email,password}=req.body;
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({username,email, password: hashedPassword});
    await newUser.save();
    res.json({ message: 'User added successfully!' });
  }
  catch (error) {
    console.error('Error User adding:', error);
    console.warn('server fault');
    res.status(500).json({ error: 'Error User adding' });
  }
})
app.get('/user', async (req, res) => {
  try {
    const user = await User.find(); 
    res.json(user); 
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' }); // Handle errors gracefully
  }
});

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
app.get('/admin', async (req, res) => {
  try {
    const admin = await Admins.find(); 
    res.json(admin); 
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ message: 'Error fetching admin' }); // Handle errors gracefully
  }
});


app.post('/slots', async (req, res) => {
    const { EventName,Date, Venue,Batch,Venues, SelectedSlots } = req.body;
    try {
      const newSlot = new Slot({ EventName, Date, Venue ,Batch,Venues, SelectedSlots});


      await newSlot.save();
      res.json({ message: 'Slot saved successfully!' });
    } catch (error) {
      console.error('Error saving slot:', error);
      console.warn('server fault');
      res.status(500).json({ error: 'Error saving slot' });
    }
  });

  app.get('/slots', async (req, res) => {
    try {
      const slots = await Slot.find(); 
      res.json(slots); 
    } catch (error) {
      console.error('Error fetching slots:', error);
      res.status(500).json({ message: 'Error fetching slots' }); // Handle errors gracefully
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
