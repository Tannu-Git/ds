const jwt = require('jsonwebtoken');
const { Employee } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findOne({ where: { emp_id: decoded.id } });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Add employee and role to request object
    req.token = token;
    req.employee = employee;
    req.role = employee.role; // Make sure role is set
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = auth;