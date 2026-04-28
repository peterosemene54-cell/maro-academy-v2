const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// This is the message we will see when the website is live!
app.get('/', (req, res) => {
    res.send("MARO ACADEMY SERVER IS LIVE AND GLOBAL! 🚀");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🦾 Server is running on port ${PORT}`);
});
