const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 THE MIGHTY DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 MONGODB CONNECTED SUCCESSFULLY!'))
  .catch(err => console.log('❌ DATABASE ERROR:', err));

// 📝 USER SCHEMA
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

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

app.get('/', (req, res) => res.send("MARO ACADEMY SERVER IS LIVE! 🚀"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🦾 Server running on ${PORT}`));

// ✅ NEW: ROUTE TO FETCH ALL STUDENTS FOR ADMIN
app.get('/api/students', async (req, res) => {
    try {
        const students = await User.find();
        res.json(students);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ✅ NEW: ROUTE TO APPROVE/DISAPPROVE A STUDENT
app.put('/api/students/:id/approve', async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        student.isPaid = !student.isPaid; // This flips the status (True/False)
        await student.save();
        res.json({ message: "Status Updated!", isPaid: student.isPaid });
    } catch (error) {
        res.status(500).send(error);
    }
});
