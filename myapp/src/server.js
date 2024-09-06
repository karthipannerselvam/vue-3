const express = require('express'); 
const mongoose = require('mongoose');
const Batch = require('./models/Batch')
const Booking = require('./models/Booking');
const { User, Slot, Admins,} = require('./models/Slot');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');

app.use(cors()); 
app.use(bodyParser.json()); 

app.use(session({
  secret: 'xyz', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));





// Middleware to verify JWT and attach userId to req





















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

    const adminToken = jwt.sign({ id: admin._id, role: 'admin' }, 'xyz', { expiresIn: '1h' });
   
    res.json({ success: true, adminToken }); 
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'Server error' }); 
  }
});

app.post('/api/login', async (req, res) => {
  const { rollno, password } = req.body;

  try {
    const user = await User.findOne({ rollno });
    if (!user) {
      return res.status(401).json({ message: 'Invalid rollno or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid rollno or password' });
    }

    const token = jwt.sign({ id: user._id }, 'xyz', { expiresIn: '1h' });

 
    res.json({ success: true, token }); 
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

  app.post('/book-slot',verifyAdminToken, async (req, res) => {
    try {
      const { eventName, date, venue, rollno } = req.body;
      const userId = req.userIdFromToken;
      const existingBooking = await Booking.findOne({ eventName, date, venue, rollno: userId });
      if (existingBooking) {
        return res.status(400).json({ message: 'Slot already booked' });
      }
      const newBooking = new Booking({
        eventName,
        date,
        venue,
        rollno 
      });
  
      await newBooking.save();
      res.json({ success: true });
    } catch (error) {
      console.error('Error booking slot:', error);
      res.status(500).json({ message: 'Error booking slot' });
    }
  });
  
  
  app.use(authenticateToken);
  
  app.get('/get-current-user', async (req, res) => {
    try {
     
      const userId = req.session.userId || req.userIdFromToken;
  
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated ' });
      }
  
      
      const user = await User.findById(userId).select('username email rollno');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Error fetching user data' });
    }
  });
  
  app.get('/check-slot-status', authenticateToken, async (req, res) => {
    try {
      const userId = req.userIdFromToken;
      if (!userId) return res.status(401).json({ message: 'User not authenticated' });
  
      const { eventName, date, venue } = req.query;
  
      
      const booking = await Booking.findOne({ eventName, date, venue, rollno: userId });
  
      if (booking) {
        res.json({ booked: true });
      } else {
        res.json({ booked: false });
      }
    } catch (error) {
      console.error('Error checking slot status:', error);
      res.status(500).json({ message: 'Error checking slot status' });
    }
  });
  app.get('/student/:rollno', verifyAdminToken, async (req, res) => {
    try {
      const { rollno } = req.params;
      
    
      const student = await User.findOne({ rollno });
      
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  

      const bookedSlots = await Booking.find({ rollno });
  
      res.status(200).json({ student, bookedSlots });
    } catch (error) {
      console.error('Error fetching student data:', error);
      res.status(500).json({ message: 'Failed to retrieve student data' });
    }
  });











  




  









  function authenticateToken(req, res, next) {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Received token:', token);
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, 'xyz', (err, user) => {
      if (err) {
        console.error('Token verification failed:', err);
        return res.sendStatus(403);
      }
      
      req.userIdFromToken = user.id;
      next();
    });
  }
  
  function verifyAdminToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const adminToken = authHeader && authHeader.split(' ')[1];
    console.log('Received token:', adminToken);
    if (!adminToken) return res.sendStatus(401);

    jwt.verify(adminToken, 'xyz', (err, admin) => {
      if (err) {
        console.error('Token verification failed:', err);
        return res.sendStatus(403);
      }
        
        
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        
        req.adminId = admin.id;
        next();
    });
}

























  

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
    const batches = await Batch.find(); 
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Error fetching batches' });
  }
});