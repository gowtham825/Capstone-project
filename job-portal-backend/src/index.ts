// index.ts
// Main application entry point

import express from 'express';
import cors from 'cors';            // Cross-Origin Resource Sharing middleware
import dotenv from 'dotenv';        // For loading environment variables
import jobRoutes from './routes/job.routes';
import applicationRoutes from './routes/application.routes';
import pool from './config/db.config';

dotenv.config();  // Load environment variables

const app = express();  // Create Express application
const PORT = process.env.PORT || 3000;  // Get port from environment or use default

// Test database connection before starting server
// This ensures the app doesn't start if the database is unavailable
pool.query('SELECT 1')
  .then(() => {
    console.log('Database connection successful');
    
    // Middleware setup
    app.use(cors());              // Enable CORS for all routes
    app.use(express.json());      // Parse JSON request bodies

    // Register route handlers
    app.use('/api', jobRoutes);           // Mount job routes at /api
    app.use('/api', applicationRoutes);   // Mount application routes at /api

    // Global error handling middleware with detailed logging
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error details:', err);
      console.error('Stack trace:', err.stack);
      
      // Return friendly error message to client
      // In production, hide detailed error information
      res.status(500).json({ 
        message: 'Something went wrong!', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
      });
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    // If database connection fails, log error and exit
    console.error('Database connection failed, server not started:', err);
    process.exit(1);  // Exit with error code
  });