const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./Backend/Routes/user')
const paymentRoutes = require('./Backend/Routes/payment')
const connectDB = require('./Backend/Configs/database'); // Đảm bảo đường dẫn đúng
const cors = require('cors');

dotenv.config();
const app = express();

// Sử dụng CORS
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/user', userRoutes);
app.use('/api/payment', paymentRoutes)
 
// Start server

app.get("/", (req, res) => {
    res.render('test')
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
