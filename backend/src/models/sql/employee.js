const { query } = require('../../config/db');
const bcrypt = require('bcryptjs');

const employeeQueries = {
  // Get all employees with their departments
  getAllEmployees: async () => {
    const sql = `
      SELECT e.*, d.dept_name 
      FROM employees e 
      LEFT JOIN departments d ON e.dept_id = d.dept_id
    `;
    return await query(sql);
  },

  // Get employee by ID
  getEmployeeById: async (empId) => {
    const sql = 'SELECT * FROM employees WHERE emp_id = ?';
    const results = await query(sql, [empId]);
    return results[0];
  },

  // Get employee by username
  getEmployeeByUsername: async (username) => {
    const sql = 'SELECT * FROM employees WHERE username = ?';
    const results = await query(sql, [username]);
    return results[0];
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    const hashedPassword = await bcrypt.hash(employeeData.password_hash, 10);
    const sql = `
      INSERT INTO employees 
      (emp_name, emp_email, emp_address, dept_id, username, password_hash) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      employeeData.emp_name,
      employeeData.emp_email,
      employeeData.emp_address,
      employeeData.dept_id,
      employeeData.username,
      hashedPassword
    ]);
    return { emp_id: result.insertId, ...employeeData };
  },

  // Update employee
  updateEmployee: async (empId, employeeData) => {
    let sql = 'UPDATE employees SET ';
    const params = [];
    const updates = [];

    if (employeeData.emp_name) {
      updates.push('emp_name = ?');
      params.push(employeeData.emp_name);
    }
    if (employeeData.emp_email) {
      updates.push('emp_email = ?');
      params.push(employeeData.emp_email);
    }
    if (employeeData.emp_address) {
      updates.push('emp_address = ?');
      params.push(employeeData.emp_address);
    }
    if (employeeData.dept_id) {
      updates.push('dept_id = ?');
      params.push(employeeData.dept_id);
    }
    if (employeeData.password_hash) {
      updates.push('password_hash = ?');
      const hashedPassword = await bcrypt.hash(employeeData.password_hash, 10);
      params.push(hashedPassword);
    }

    sql += updates.join(', ') + ' WHERE emp_id = ?';
    params.push(empId);

    await query(sql, params);
    return await employeeQueries.getEmployeeById(empId);
  },

  // Delete employee
  deleteEmployee: async (empId) => {
    const sql = 'DELETE FROM employees WHERE emp_id = ?';
    return await query(sql, [empId]);
  },

  // Verify password
  verifyPassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  }
};

module.exports = employeeQueries;