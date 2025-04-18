import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from './routes/job.routes';
import applicationRoutes from './routes/application.routes';
import pool from './config/db.config';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Test database connection before starting server
pool.query('SELECT 1')
  .then(() => {
    console.log('Database connection successful');
    
    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api', jobRoutes);
    app.use('/api', applicationRoutes);

    // Error handling middleware with more detailed logging
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error details:', err);
      console.error('Stack trace:', err.stack);
      res.status(500).json({ 
        message: 'Something went wrong!', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed, server not started:', err);
    process.exit(1);
  });