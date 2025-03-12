const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Employee } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });

    const employee = await Employee.findOne({ where: { username } });
    console.log('Found employee:', employee ? 'Yes' : 'No');

    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, employee.password_hash);
    console.log('Password match:', isValidPassword);
    console.log('User role:', employee.role); // Print role

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: employee.emp_id,
        role: employee.role,
        dept_id: employee.dept_id
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      employee: {
        emp_id: employee.emp_id,
        emp_name: employee.emp_name,
        dept_id: employee.dept_id,
        role: employee.role
      }
    });

  } catch (error) {
    console.log('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User logout
router.post('/logout', auth, async (req, res) => {
  try {
    // In a real-world application, you might want to invalidate the token here
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;