const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
//app.use(cors());
const allowedOrigins = [
  'http://localhost:3000',
  /\.vercel\.app$/  // This matches ALL your Vercel preview links
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// 🔐 THE MIGHTY DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 MONGODB CONNECTED SUCCESSFULLY!'))
  .catch(err => console.log('❌ DATABASE ERROR:', err));

// 📝 1. USER SCHEMA
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: { type: String, required: true },
    isPaid: { type: Boolean, default: false } 
});
const User = mongoose.model('User', UserSchema);

// 🎬 2. VIDEO SCHEMA (For your Math Tutorials)
const VideoSchema = new mongoose.Schema({
    title: String,
    videoId: String,
    description: String,
    createdAt: { type: Date, default: Date.now }
});
const Video = mongoose.model('Video', VideoSchema);

// 🚪 REGISTER ROUTE
app.post('/api/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send({ message: "User Saved!" });
    } catch (error) {
        res.status(500).send(error);
    }
});
// 🔑 LOGIN ROUTE
// 🔑 UPDATED LOGIN ROUTE IN SERVER.JS
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Instead of "user not found", we say something more professional
            return res.status(404).json({ message: "This account is not registered in our database." });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials. Please verify your password." });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Our security systems are currently verifying. Please try again." });
    }
});


// 🔑 3. LOGIN ROUTE (The Entrance Gate)
/*app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json(user); // Sends everything including isPaid status
        } else {
            res.status(401).json({ message: "Invalid email or password! ❌" });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});*/

// ✅ FETCH ALL STUDENTS FOR ADMIN
app.get('/api/students', async (req, res) => {
    try {
        const students = await User.find();
        res.json(students);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ✅ APPROVE/DISAPPROVE A STUDENT
app.put('/api/students/:id/approve', async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        student.isPaid = !student.isPaid;
        await student.save();
        res.json({ message: "Status Updated!", isPaid: student.isPaid });
    } catch (error) {
        res.status(500).send(error);
    }
});

// 📤 4. NEW: UPLOAD VIDEO ROUTE
app.post('/api/videos/upload', async (req, res) => {
    try {
        const newVideo = new Video(req.body);
        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (error) {
        res.status(500).send(error);
    }
});

// 📥 5. NEW: FETCH VIDEOS FOR STUDENTS
app.get('/api/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: 1 }); // Sort by oldest first
        res.json(videos);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/', (req, res) => res.send("MARO ACADEMY SERVER IS LIVE! 🚀"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🦾 Server running on ${PORT}`));
