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
