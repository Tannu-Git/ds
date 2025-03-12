const { Employee, Department } = require('../models');
const seedDatabase = require('../seeders');
const sequelize = require('../config/database');

const checkSeeds = async () => {
  try {
    console.log('\n=== Checking and Seeding Data ===\n');

    // Drop all tables and recreate them with their relationships
    await sequelize.sync({ force: true });
    
    // Run the seeder
    await seedDatabase();

    // Check departments
    const departments = await Department.findAll();
    console.log('Departments:', departments.map(d => ({
      id: d.dept_id,
      name: d.dept_name
    })));

    // Check employees with credentials
    const employees = await Employee.findAll({
      include: ['department'],
      attributes: { exclude: ['password_hash'] }
    });
    console.log('\nEmployees and Login Credentials:');
    employees.forEach(e => {
      console.log({
        id: e.emp_id,
        name: e.emp_name,
        username: e.username,
        password: e.username === 'admin' ? 'admin123' : 'password123', // Default passwords from seeder
        department: e.department?.dept_name
      });
    });

  } catch (error) {
    console.error('Error checking/seeding data:', error);
  }
};

module.exports = checkSeeds;