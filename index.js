import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js'; 

dotenv.config();

const app = express();

// Add COOP, COEP headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// CORS config
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3000/auth'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.get('/', (req, res) => {
  res.send('APP IS RUNNING'); 
}); 
// Routes
app.use('/posts', postRoutes);
app.use('/user' , userRoutes);

const PORT = process.env.PORT || 5000;

// Prevent multiple servers on same port
import http from 'http';
const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// Optional: silence deprecated useFindAndModify warning
mongoose.set('strictQuery', true);






