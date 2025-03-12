const { query } = require('../../config/db');

const departmentQueries = {
  // Get all departments
  getAllDepartments: async () => {
    const sql = 'SELECT * FROM departments';
    return await query(sql);
  },

  // Get department by ID with employees
  getDepartmentById: async (deptId) => {
    const sql = `
      SELECT d.*, e.emp_id, e.emp_name, e.emp_email, e.emp_address
      FROM departments d
      LEFT JOIN employees e ON d.dept_id = e.dept_id
      WHERE d.dept_id = ?
    `;
    const results = await query(sql, [deptId]);
    if (results.length === 0) return null;

    const department = {
      dept_id: results[0].dept_id,
      dept_name: results[0].dept_name,
      description: results[0].description,
      created_at: results[0].created_at,
      updated_at: results[0].updated_at,
      employees: []
    };

    results.forEach(row => {
      if (row.emp_id) {
        department.employees.push({
          emp_id: row.emp_id,
          emp_name: row.emp_name,
          emp_email: row.emp_email,
          emp_address: row.emp_address
        });
      }
    });

    return department;
  },

  // Create new department
  createDepartment: async (departmentData) => {
    const sql = `
      INSERT INTO departments 
      (dept_name, description) 
      VALUES (?, ?)
    `;
    const result = await query(sql, [
      departmentData.dept_name,
      departmentData.description
    ]);
    return { dept_id: result.insertId, ...departmentData };
  },

  // Update department
  updateDepartment: async (deptId, departmentData) => {
    const sql = `
      UPDATE departments 
      SET dept_name = ?, description = ?, updated_at = NOW()
      WHERE dept_id = ?
    `;
    await query(sql, [
      departmentData.dept_name,
      departmentData.description,
      deptId
    ]);
    return await departmentQueries.getDepartmentById(deptId);
  },

  // Delete department
  deleteDepartment: async (deptId) => {
    const sql = 'DELETE FROM departments WHERE dept_id = ?';
    return await query(sql, [deptId]);
  }
};

module.exports = departmentQueries;