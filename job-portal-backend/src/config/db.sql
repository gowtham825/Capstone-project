-- db.sql
-- SQL script to initialize database schema

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS job_portal;

-- Switch to the job_portal database
USE job_portal;

-- Create jobs table with necessary fields for job listings
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,                -- Unique identifier for each job
  job_title VARCHAR(255) NOT NULL,                  -- Job position title
  company_name VARCHAR(255) NOT NULL,               -- Company offering the job
  location VARCHAR(255) NOT NULL,                   -- Job location
  job_type ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote') NOT NULL, -- Type of employment
  salary_range VARCHAR(255),                        -- Optional salary information
  job_description TEXT NOT NULL,                    -- Detailed job description
  application_deadline DATE NOT NULL,               -- Last date to apply
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- When the job was posted
);

-- Create applications table to store job applications
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,                -- Unique identifier for each application
  job_id INT NOT NULL,                              -- Foreign key to the job
  applicant_name VARCHAR(255) NOT NULL,             -- Name of the applicant
  email VARCHAR(255) NOT NULL,                      -- Email of the applicant
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- When the application was submitted
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE -- Links to jobs table, deletes applications when job is deleted
);