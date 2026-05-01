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

// 🔐 THE MIGHTY DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 MONGODB CONNECTED SUCCESSFULLY!'))
  .catch(err => console.log('❌ DATABASE ERROR:', err));

// =====================================
// 📝 ALL SCHEMAS
// =====================================

// 1. USER SCHEMA
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paymentDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null }
});
const User = mongoose.model('User', UserSchema);

// 2. VIDEO SCHEMA
const VideoSchema = new mongoose.Schema({
    title: String,
    videoId: String,
    description: String,
    createdAt: { type: Date, default: Date.now }
});
const Video = mongoose.model('Video', VideoSchema);

// 3. SETTINGS SCHEMA
const SettingSchema = new mongoose.Schema({
    paymentRequired: { type: Boolean, default: false }
});
const Setting = mongoose.model('Setting', SettingSchema);

// =====================================
// 🚪 ALL ROUTES
// =====================================

// REGISTER ROUTE
app.post('/api/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send({ message: "User Saved!" });
    } catch (error) {
        res.status(500).send(error);
    }
});

// 🔑 LOGIN ROUTE — WITH AUTO EXPIRY CHECK!
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // ❌ User not found
        if (!user) {
            return res.status(404).json({
                message: "This account is not registered in our database."
            });
        }

        // ❌ Wrong password
        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid credentials. Please verify your password."
            });
        }

        // ⏰ AUTO EXPIRY CHECK ON LOGIN!
        if (user.isPaid && user.expiryDate) {
            const today = new Date();
            const expiry = new Date(user.expiryDate);

            if (today > expiry) {
                // 🔴 EXPIRED! Auto-revoke access!
                user.isPaid = false;
                user.paymentDate = null;
                user.expiryDate = null;
                await user.save();

                return res.status(403).json({
                    message: "Your 30-day subscription has expired. Please renew to continue.",
                    expired: true
                });
            }
        }

        // ✅ Send FULL user data including expiryDate to frontend!
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isPaid: user.isPaid,
            paymentDate: user.paymentDate,
            expiryDate: user.expiryDate  // 🆕 THIS IS KEY! Sends expiry to localStorage!
        });

    } catch (error) {
        res.status(500).json({
            message: "Our security systems are currently verifying. Please try again."
        });
    }
});

// FETCH ALL STUDENTS FOR ADMIN
app.get('/api/students', async (req, res) => {
    try {
        const students = await User.find();
        res.json(students);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ✅ APPROVE/DISAPPROVE — CHECKS PAYMENT MODE!
app.put('/api/students/:id/approve', async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        student.isPaid = !student.isPaid;

        // Check payment mode first!
        const setting = await Setting.findOne();
        const paymentRequired = setting ? setting.paymentRequired : false;

        if (student.isPaid) {
            student.paymentDate = new Date();
            // Only set expiry in payment mode!
            if (paymentRequired) {
                //student.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                student.expiryDate = new Date(Date.now() + 2 * 60 * 1000);
            } else {
                student.expiryDate = null;
            }
        } else {
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

// 🆕 AUTO EXPIRE ROUTE — flips expired students to PENDING in admin!
app.put('/api/students/auto-expire', async (req, res) => {
    try {
        const now = new Date();

        // Find all paid students whose expiry date has passed
        const expiredStudents = await User.find({
            isPaid: true,
            expiryDate: { $lt: now }
        });

        // Auto disapprove all expired students
        for (const student of expiredStudents) {
            student.isPaid = false;
            student.paymentDate = null;
            student.expiryDate = null;
            await student.save();
        }

        res.json({
            message: `${expiredStudents.length} students auto-expired!`,
            expiredCount: expiredStudents.length
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// UPLOAD VIDEO ROUTE
app.post('/api/videos/upload', async (req, res) => {
    try {
        const newVideo = new Video(req.body);
        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (error) {
        res.status(500).send(error);
    }
});

// FETCH VIDEOS FOR STUDENTS
app.get('/api/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: 1 });
        res.json(videos);
    } catch (error) {
        res.status(500).send(error);
    }
});

// GET SETTINGS
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

// UPDATE SETTINGS
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

// HOME ROUTE
app.get('/', (req, res) => res.send("MARO ACADEMY SERVER IS LIVE! 🚀"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🦾 Server running on ${PORT}`));