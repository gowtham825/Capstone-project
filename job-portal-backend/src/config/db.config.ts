// db.config.ts
// This file establishes the database connection pool for the entire application

import mysql from 'mysql2/promise';  // Promise-based MySQL client
import dotenv from 'dotenv';         // For loading environment variables
import path from 'path';             // For resolving file paths

// Load environment variables from .env file in the root directory
// This allows configuring database connection details securely
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Log configuration for debugging purposes
// Helpful during initial setup and troubleshooting
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : 'not set'); // Security: Don't log actual password

// Create a connection pool
// A pool maintains multiple connections for better performance and reliability
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',     // Database server location
  user: process.env.DB_USER || 'root',          // Database username
  password: process.env.DB_PASSWORD || '1234',  // Database password
  database: process.env.DB_NAME || 'job_portal', // Database name
  waitForConnections: true,     // Wait for connection when none available
  connectionLimit: 10,          // Maximum number of connections in pool
  queueLimit: 0,                // Unlimited queue size
  connectTimeout: 10000         // 10 seconds timeout for connection attempts
});

export default pool;  // Export the pool for use throughout the application