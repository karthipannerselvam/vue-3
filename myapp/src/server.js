const express = require('express'); 
const mongoose = require('mongoose');
const Batch = require('./models/Batch')
const {Booking,SlotFeedback} = require('./models/Booking');

const { User, Slot, Admins,} = require('./models/Slot');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
app.use(cors()); 
app.use(bodyParser.json()); 

app.use(session({
  secret: 'xyz', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'karthipannerselvam173@gmail.com',
    pass: 'dywp wwja hvqf niab', 
  },
});
function sendEmail(event) {
  const mailOptions = {
    from: 'karthipannerselvam173@gmail.com',
    to: 'karthi.cs22@bitsathy.ac.in',
    subject: `Reminder: ${event.eventName} on ${new Date(event.date).toLocaleDateString()}`,
    text: `This is a reminder for the ${event.eventName} scheduled on ${new Date(event.date)}. \nYou have booked a slot today, kindly be in slot without fail. \n\nVenue: ${event.venue}\nSlot: ${event.slot}\nRoll No: ${event.rollno}\nThank You`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error: ' + error);
    }
    console.log('Email sent: ' + info.response);
  });
}

const scheduleEmails = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  try {
 
    const events = await Booking.find({ booked: true });
    const todaysEvents = events.filter(event => {
      const eventDate = new Date(event.date); 
      return eventDate >= today && eventDate < tomorrow; 
    });
    console.log(`Scheduling ${todaysEvents.length} emails for today:`);

    todaysEvents.forEach(event => {
      const scheduledDate = new Date(event.date);
      scheduledDate.setHours(12); 
      scheduledDate.setMinutes(32); 
      schedule.scheduleJob(scheduledDate, function () {
        sendEmail(event);
      });
    });
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

scheduleEmails();











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
      const rollno = req.query.rollno;
      
     
      const bookedSlots = await Booking.find({ rollno }).select('slotId');
       const bookedSlotIds = bookedSlots.map(booking => booking.slotId);
       const availableSlots = await Slot.find({ slotId: { $nin: bookedSlotIds } }); 
      res.json(availableSlots); 
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
    try {
      const { eventName, date, venue, rollno,slot,slotId } = req.body;
      const userId = req.userIdFromToken;
      const existingBooking = await Booking.findOne({ eventName, date, venue, rollno: userId ,booked: true});
      if (existingBooking) {
        if (existingBooking.booked) {
          return res.status(400).json({ message: 'Slot already booked' });
        }
        
        existingBooking.booked = true;
        await existingBooking.save();
      }
      else{
      const newBooking = new Booking({
        eventName,
        date,
        venue,
        rollno ,
        booked: true,
        slot,
        slotId
      });
      await newBooking.save();
    }
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
      
    
      const student = await User.findOne({ rollno }).select('rollno username email');
      
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  

      const bookedSlots = await Booking.find({ rollno }).lean();
      const slotsWithFeedback = await SlotFeedback.find({ rollno, remarks: { $ne: null } }).distinct('slotId');
      const slotsToReturn = bookedSlots.filter(slot => !slotsWithFeedback.includes(slot._id.toString()));
  
      res.status(200).json({ student, slotsToReturn });
    } catch (error) {
      console.error('Error fetching student data:', error);
      res.status(500).json({ message: 'Failed to retrieve student data' });
    }
  });

  app.post('/api/submitSlotData', async (req, res) => {
    try {
        const { slotId,eventName, scale, remarks, rollno, date, venue } = req.body;

        
        if (!slotId || !scale || !remarks || !rollno || !date || !venue) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        
        const feedback = new SlotFeedback({
            slotId,
            eventName,
            scale,
            remarks,
            rollno,
            date,
            venue,
        });

        await feedback.save();
        res.status(200).json({ message: 'Slot feedback saved successfully' });
    } catch (error) {
        console.error('Error saving slot feedback:', error);
        res.status(500).json({ message: 'Failed to save feedback' });
    }
});

app.get('/booked-slots', async (req, res) => {
  const { rollno } = req.query;

  try {
    if (!rollno) {
      return res.status(400).json({ error: 'Roll number is required' });
    }

    const bookedSlots = await Booking.find({ rollno, booked: true })
      .sort({ createdAt: -1 }) // Sort by latest booking
      .limit(5); // Limit to 5 bookings

    res.status(200).json(bookedSlots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve booked slots' });
  }
});

app.get('/slot-feedback',async(req,res)=>{
  const{rollno}=req.query;
  try{
    const feedback= await SlotFeedback.find({rollno});
    res.json(feedback);
  }
  catch(err){
    res.status(500).json({message:'Error fetching feedback'})
  }
})



















  




  









  function authenticateToken(req, res, next) {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
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