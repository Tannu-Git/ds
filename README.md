# Employee Management System

A comprehensive employee management system built with React, Ant Design, and MySQL.

## Features

- Employee CRUD operations
- Department management
- Leave management
- Time tracking
- User authentication
- QR Code-based attendance tracking
- Role-based access control (Admin/Employee)

## Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

## Backend API Endpoints

### Authentication
- POST /api/auth/login - User login with role-based access
- POST /api/auth/logout - User logout

### Attendance
- POST /api/attendance/scan - Scan QR code for attendance
- GET /api/attendance/:emp_id - Get employee attendance history
- POST /api/attendance/generate-qr - Generate QR code for employee

### Employees
- GET /api/employees - Get all employees
- GET /api/employees/:id - Get employee by ID
- POST /api/employees - Create new employee
- PUT /api/employees/:id - Update employee
- DELETE /api/employees/:id - Delete employee

### Departments
- GET /api/departments - Get all departments
- GET /api/departments/:id - Get department by ID
- POST /api/departments - Create new department
- PUT /api/departments/:id - Update department
- DELETE /api/departments/:id - Delete department

### Leave Management
- GET /api/leaves - Get all leave requests
- POST /api/leaves - Create leave request
- PUT /api/leaves/:id - Update leave request
- DELETE /api/leaves/:id - Delete leave request

## Database Schema

### Employees Table
```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_name VARCHAR(100) NOT NULL,
    emp_email VARCHAR(100) UNIQUE NOT NULL,
    emp_address TEXT,
    dept_id INT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);
```

### Departments Table
```sql
CREATE TABLE departments (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Leave Requests Table
```sql
CREATE TABLE leave_requests (
    leave_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id INT,
    leave_type ENUM('SICK', 'VACATION', 'PERSONAL') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
);
```

### Time Tracking
- GET /api/time-tracking/:emp_id - Get employee time tracking records
  - Response: [{ "date": string, "total_hours": number, "tasks": [{ "description": string, "hours": number }] }]
- POST /api/time-tracking - Create time tracking entry
  - Request: { "emp_id": number, "task": string, "hours": number }
  - Response: { "tracking_id": number, "message": string }
- PUT /api/time-tracking/:id - Update time tracking entry
  - Request: { "task": string, "hours": number }
  - Response: { "message": string }
- GET /api/time-tracking/reports - Generate time tracking reports (Admin only)
  - Query: { "start_date": string, "end_date": string, "dept_id": number? }
  - Response: { "total_hours": number, "employees": [{ "emp_id": number, "name": string, "hours": number }] }

### Time Tracking Table
```sql
CREATE TABLE time_tracking (
    time_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id INT,
    time_in DATETIME NOT NULL,
    time_out DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
);
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=emp_management
JWT_SECRET=your_jwt_secret
```