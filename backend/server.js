const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const eventRoutes = require('./routes/event');
const authRoutes = require('./routes/auth');

dotenv.config();



const app = express();
app.use(express.json());
// app.use(cors({
//     origin: '*', // Allows all origins (make sure to secure this for production)
// }));
app.use(cors());
app.use('/api/events', eventRoutes);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB Connection Failed:', err));

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});