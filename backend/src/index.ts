import express from "express";
import mongoose from "mongoose";
import cors from 'cors';

import pollRoutes from './Routes/pollRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next(); // If you forget this, the browser will spin forever!
});


app.get('/', (req, res) => {
  res.send('Polling System API is running! 🚀');
});
app.use('/api/polls', pollRoutes);

mongoose
  .connect(MONGODB_URI!, { family: 4 })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });