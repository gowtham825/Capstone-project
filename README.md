# 🚀 JobConnect - Modern Job Portal

A comprehensive full-stack web application connecting employers and job seekers with a streamlined application process.

![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-Angular%20%7C%20Node.js%20%7C%20MySQL-orange)


## 👋 Meet Our Team

This project is proudly developed by:
- **Gowtham K** - Team Representative
- **Suthani K**
- **Akhil S T**

We're excited to bring you this job portal application and welcome your feedback!

## 💼 Overview

JobConnect is a modern job portal platform that bridges the gap between employers and job seekers. Built with Angular, Node.js (TypeScript), and MySQL, this application offers a seamless experience for posting job listings and submitting applications without requiring user authentication.

## ✨ Key Features

### For Employers
- **Post Job Listings** with detailed information including title, company, location, and more
- **Manage Listings** with easy edit and delete functionality
- **Track Applications** submitted for each job listing
- **No Login Required** - post jobs without authentication barriers

### For Job Seekers
- **Browse Available Jobs** with a clean, intuitive interface
- **View Detailed Job Information** before applying
- **Simple Application Process** requiring only basic information
- **Track Submitted Applications** for future reference

## 🛠️ Technology Stack

### Frontend
- **Framework**: Angular 16
- **UI Library**: Angular Material
- **Language**: TypeScript
- **State Management**: Angular Services

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **API**: RESTful architecture

### Database
- **RDBMS**: MySQL

## 📁 Project Structure
.
├── backend/                # Server-side code
│   ├── src/
│   │   ├── controllers/    # API route handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Custom middleware
│   │   ├── interfaces/     # TypeScript interfaces
│   │   ├── utils/          # Helper functions
│   │   └── index.ts        # Entry point
│   ├── .env.example        # Environment variables template
│   └── package.json        # Backend dependencies
│
└── frontend/               # Client-side application
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── job-list/
│   │   │   ├── job-details/
│   │   │   ├── job-form/
│   │   │   ├── application-form/
│   │   │   └── applications-list/
│   │   ├── services/
│   │   │   ├── job.service.ts
│   │   │   └── application.service.ts
│   │   ├── models/
│   │   │   ├── job.model.ts
│   │   │   └── application.model.ts
│   │   └── shared/      # Shared components
│   ├── assets/          # Static resources
│   └── environments/    # Environment configurations
├── angular.json         # Angular configuration
└── package.json         # Frontend dependencies

## 🚀 Installation Guide

### Prerequisites
- Node.js (v14+) and npm installed
- MySQL server (v8+) running
- Angular CLI installed globally

### Backend Setup
1. Navigate to the backend directory:
cd backend

2. Install dependencies:
npm install

3. Create a `.env` file based on `.env.example`:
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=job_portal
PORT=3000

4. Create the database schema:
CREATE DATABASE job_portal;
USE job_portal;
CREATE TABLE jobs (
id INT PRIMARY KEY AUTO_INCREMENT,
job_title VARCHAR(255) NOT NULL,
company_name VARCHAR(255) NOT NULL,
location VARCHAR(255) NOT NULL,
job_type ENUM('Full-time', 'Part-time', 'Contract', 'Internship') NOT NULL,
salary_range VARCHAR(255),
job_description TEXT NOT NULL,
application_deadline DATE NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE applications (
id INT PRIMARY KEY AUTO_INCREMENT,
job_id INT,
applicant_name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

5. Start the server:
npm run dev

### Frontend Setup
1. Navigate to the frontend directory:
cd frontend

2. Install dependencies:
npm install

3. Start the development server:
ng serve

4. Open your browser at `http://localhost:4200`

## 📊 API Reference

### Job Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/jobs` | Get all job listings |
| POST   | `/api/jobs` | Create a new job listing |
| GET    | `/api/jobs/:id` | Get a specific job listing |
| PUT    | `/api/jobs/:id` | Update job details |
| DELETE | `/api/jobs/:id` | Delete a job listing |

### Application Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/applications` | Get all applications |
| POST   | `/api/jobs/:id/apply` | Apply for a job |
| GET    | `/api/applications/:id` | Get a specific application |

## 📋 Application Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/jobs` | JobListComponent | Main page displaying all job listings |
| `/jobs/new` | JobFormComponent | Form to post a new job |
| `/jobs/edit/:id` | JobFormComponent | Edit an existing job |
| `/jobs/:id` | JobDetailsComponent | View detailed job information |
| `/jobs/:id/apply` | JobApplicationFormComponent | Submit application for a job |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.



---

## 📞 Contact

For any questions or suggestions, please reach out at pingtogowtham1@gmail.com
