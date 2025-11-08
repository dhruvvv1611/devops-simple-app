import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks.js';


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(
  {
    origin: '*',
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack, next);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

console.log("MONGO_URI:", process.env.MONGO_URI);

// Database connection
console.log('Attempting to connect to MongoDB...');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4, // Force IPv4
})
  .then(() => {
    const connection = mongoose.connection;
    console.log('✅ Connected to MongoDB');
    console.log(`📦 Database name: ${connection.name}`);
    console.log(`🌐 Host: ${connection.host}`);
    console.log(`🧩 Port: ${connection.port || 'default (MongoDB Atlas)'}`);
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  });



// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Changed again to - Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
