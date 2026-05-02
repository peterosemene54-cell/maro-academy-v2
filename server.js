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

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 MONGODB CONNECTED SUCCESSFULLY!'))
  .catch(err => console.log('❌ DATABASE ERROR:', err));

// =====================================
// 📝 ALL SCHEMAS
// =====================================
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paymentDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    // 🆕 TRACKS IF STUDENT HAS LOGGED IN!
    firstLoginDate: { type: Date, default: null },
    hasLoggedIn: { type: Boolean, default: false }
});
const User = mongoose.model('User', UserSchema);

const VideoSchema = new mongoose.Schema({
    title: String,
    videoId: String,
    description: String,
    createdAt: { type: Date, default: Date.now }
});
const Video = mongoose.model('Video', VideoSchema);

const SettingSchema = new mongoose.Schema({
    paymentRequired: { type: Boolean, default: false }
});
const Setting = mongoose.model('Setting', SettingSchema);

// =====================================
// 🚪 ALL ROUTES
// =====================================

// REGISTER
app.post('/api/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send({ message: "User Saved!" });
    } catch (error) {
        res.status(500).send(error);
    }
});

// 🔑 LOGIN — TIMER STARTS HERE ON FIRST LOGIN!
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "This account is not registered in our database."
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid credentials. Please verify your password."
            });
        }

        // ⏰ AUTO EXPIRY CHECK
        if (user.isPaid && user.expiryDate) {
            const today = new Date();
            const expiry = new Date(user.expiryDate);
            if (today > expiry) {
                user.isPaid = false;
                user.paymentDate = null;
                user.expiryDate = null;
                user.hasLoggedIn = false;
                user.firstLoginDate = null;
                await user.save();
                return res.status(403).json({
                    message: "Your 30-day subscription has expired. Please renew to continue.",
                    expired: true
                });
            }
        }

        // 🆕 TIMER STARTS ON FIRST LOGIN — NOT ON APPROVAL!
        if (user.isPaid && !user.hasLoggedIn) {
            // This is their FIRST login after being approved!
            user.hasLoggedIn = true;
            user.firstLoginDate = new Date();
            // NOW set the expiry — 30 days from first login!
            user.expiryDate = new Date(Date.now() + 2 * 60 * 1000); // 2 mins for testing!
            // user.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days production!
            await user.save();
        }

        // ✅ Send COMPLETE user data including expiryDate!
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isPaid: user.isPaid,
            paymentDate: user.paymentDate,
            expiryDate: user.expiryDate,
            hasLoggedIn: user.hasLoggedIn,
            firstLoginDate: user.firstLoginDate
        });

    } catch (error) {
        res.status(500).json({
            message: "Our security systems are currently verifying. Please try again."
        });
    }
});

// FETCH ALL STUDENTS
app.get('/api/students', async (req, res) => {
    try {
        const students = await User.find();
        res.json(students);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ✅ APPROVE/DISAPPROVE — NO EXPIRY DATE SET HERE ANYMORE!
// Timer only starts when student logs in for first time!
app.put('/api/students/:id/approve', async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        student.isPaid = !student.isPaid;

        if (student.isPaid) {
            // Just approve — NO expiry date yet!
            // Expiry starts on first login!
            student.paymentDate = new Date();
            student.expiryDate = null;      // ← No expiry yet!
            student.hasLoggedIn = false;    // ← Reset login status!
            student.firstLoginDate = null;  // ← Reset first login!
        } else {
            // Disapproving — clear everything!
            student.paymentDate = null;
            student.expiryDate = null;
            student.hasLoggedIn = false;
            student.firstLoginDate = null;
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

// AUTO EXPIRE ROUTE
app.put('/api/students/auto-expire', async (req, res) => {
    try {
        const now = new Date();
        const expiredStudents = await User.find({
            isPaid: true,
            expiryDate: { $lt: now }
        });

        for (const student of expiredStudents) {
            student.isPaid = false;
            student.paymentDate = null;
            student.expiryDate = null;
            student.hasLoggedIn = false;
            student.firstLoginDate = null;
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

// VIDEO ROUTES
app.post('/api/videos/upload', async (req, res) => {
    try {
        const newVideo = new Video(req.body);
        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: 1 });
        res.json(videos);
    } catch (error) {
        res.status(500).send(error);
    }
});

// SETTINGS ROUTES
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
// ✅ NEW: INDIVIDUAL AUTO-EXPIRE (Fixes the "Waiting" bug)
app.put('/api/students/auto-expire/:id', async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) return res.status(404).send("Student not found");

        // Clear everything for THIS specific student only
        student.isPaid = false;
        student.paymentDate = null;
        student.expiryDate = null;
        student.hasLoggedIn = false;
        student.firstLoginDate = null;

        await student.save();
        console.log(`✨ Admin Sync: ${student.name} has been auto-disapproved.`);
        
        res.json({ message: "Individual status updated on Admin page!" });
    } catch (error) {
        res.status(500).send(error);
    }
});
