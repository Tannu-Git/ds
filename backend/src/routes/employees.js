const express = require('express');
const { Employee, Department } = require('../models');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

// Get all employees - role-based access
router.get('/', auth, async (req, res) => {
  try {
    let employees;
    
    if (req.employee.role === 'admin') {
      // Admin sees all employees
      employees = await Employee.findAll({
        include: [{ model: Department, as: 'department' }],
        attributes: { exclude: ['password_hash'] }
      });
    } else if (req.employee.role === 'manager') {
      // Manager sees employees in their department
      employees = await Employee.findAll({
        where: { dept_id: req.employee.dept_id },
        include: [{ model: Department, as: 'department' }],
        attributes: { exclude: ['password_hash'] }
      });
    } else {
      // Regular employee sees only themselves
      employees = await Employee.findAll({
        where: { emp_id: req.employee.emp_id },
        include: [{ model: Department, as: 'department' }],
        attributes: { exclude: ['password_hash'] }
      });
    }
    
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employee by ID - role-based access
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user has permission to view this employee
    if (req.employee.role !== 'admin' && 
        req.employee.role !== 'manager' && 
        req.employee.emp_id !== parseInt(req.params.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // For managers, check if employee is in their department
    if (req.employee.role === 'manager') {
      const requestedEmployee = await Employee.findByPk(req.params.id);
      if (!requestedEmployee || requestedEmployee.dept_id !== req.employee.dept_id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const employee = await Employee.findByPk(req.params.id, {
      include: [{ model: Department, as: 'department' }],
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new employee - admin and manager only
router.post('/', auth, roleAuth(['admin', 'manager']), async (req, res) => {
  try {
    // If manager, can only create employees in their department
    if (req.employee.role === 'manager' && req.body.dept_id !== req.employee.dept_id) {
      return res.status(403).json({ message: 'You can only create employees in your department' });
    }
    
    const employee = await Employee.create(req.body);
    const { password_hash, ...employeeData } = employee.toJSON();
    res.status(201).json(employeeData);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email or username already exists' });
    }
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update employee - role-based access
router.put('/:id', auth, async (req, res) => {
  try {
    const employeeToUpdate = await Employee.findByPk(req.params.id);
    
    if (!employeeToUpdate) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Check permissions
    if (req.employee.role === 'admin') {
      // Admin can update any employee
    } else if (req.employee.role === 'manager') {
      // Manager can only update employees in their department
      if (employeeToUpdate.dept_id !== req.employee.dept_id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Prevent manager from changing department
      if (req.body.dept_id && req.body.dept_id !== req.employee.dept_id) {
        return res.status(403).json({ message: 'Cannot change employee to a different department' });
      }
    } else {
      // Regular employees can only update themselves
      if (parseInt(req.params.id) !== req.employee.emp_id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Prevent employee from changing sensitive fields
      delete req.body.role;
      delete req.body.dept_id;
    }
    
    await employeeToUpdate.update(req.body);
    const { password_hash, ...employeeData } = employeeToUpdate.toJSON();
    res.json(employeeData);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email or username already exists' });
    }
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete employee - admin only
router.delete('/:id', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await employee.destroy();
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employees by department - for managers
router.get('/department/:deptId', auth, async (req, res) => {
  try {
    // Check if user has permission to view this department
    if (req.employee.role !== 'admin' && 
        req.employee.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // For managers, check if they're requesting their own department
    if (req.employee.role === 'manager' && 
        parseInt(req.params.deptId) !== req.employee.dept_id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const employees = await Employee.findAll({
      where: { dept_id: req.params.deptId },
      include: [{ model: Department, as: 'department' }],
      attributes: { exclude: ['password_hash'] }
    });
    
    res.json(employees);
  } catch (error) {
    console.error('Error fetching department employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;