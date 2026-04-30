const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  /\.vercel\.app$/
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// 🔐 DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 MONGODB CONNECTED SUCCESSFULLY!'))
  .catch(err => console.log('❌ DATABASE ERROR:', err));

// 📝 1. USER SCHEMA
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    // 🆕 EXPIRY DATES
    paymentDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null }
});
const User = mongoose.model('User', UserSchema);

// 🎬 2. VIDEO SCHEMA
const VideoSchema = new mongoose.Schema({
    title: String,
    videoId: String,
    description: String,
    createdAt: { type: Date, default: Date.now }
});
const Video = mongoose.model('Video', VideoSchema);

// 🆕 3. SETTINGS SCHEMA (For free/paid mode switch)
const SettingSchema = new mongoose.Schema({
    paymentRequired: { type: Boolean, default: false }
});
const Setting = mongoose.model('Setting', SettingSchema);

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
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
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

// ✅ FETCH ALL STUDENTS FOR ADMIN
app.get('/api/students', async (req, res) => {
    try {
        const students = await User.find();
        res.json(students);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ✅ APPROVE/DISAPPROVE — NOW WITH 30 DAY EXPIRY!
app.put('/api/students/:id/approve', async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        student.isPaid = !student.isPaid;

        // 🆕 SET EXPIRY DATE WHEN APPROVING
        if (student.isPaid) {
            student.paymentDate = new Date();
            // 30 days from now
            student.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        } else {
            // Clear dates when disapproving
            student.paymentDate = null;
            student.expiryDate = null;
        }

        await student.save();
        res.json({ 
            message: "Status Updated!", 
            isPaid: student.isPaid,
            expiryDate: student.expiryDate 
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// 📤 UPLOAD VIDEO ROUTE
app.post('/api/videos/upload', async (req, res) => {
    try {
        const newVideo = new Video(req.body);
        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (error) {
        res.status(500).send(error);
    }
});

// 📥 FETCH VIDEOS FOR STUDENTS
app.get('/api/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: 1 });
        res.json(videos);
    } catch (error) {
        res.status(500).send(error);
    }
});

// 🆕 GET SETTINGS (Free/Paid mode)
app.get('/api/settings', async (req, res) => {
    try {
        let setting = await Setting.findOne();
        if (!setting) {
            setting = await Setting.create({ paymentRequired: false });
        }
        res.json(setting);
    } catch (error) {
        res.status(500).send(error);
    }
});

// 🆕 UPDATE SETTINGS (Flip free/paid mode)
app.put('/api/settings', async (req, res) => {
    try {
        let setting = await Setting.findOne();
        if (!setting) {
            setting = new Setting({ paymentRequired: req.body.paymentRequired });
        } else {
            setting.paymentRequired = req.body.paymentRequired;
        }
        await setting.save();
        res.json(setting);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/', (req, res) => res.send("MARO ACADEMY SERVER IS LIVE! 🚀"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🦾 Server running on ${PORT}`));