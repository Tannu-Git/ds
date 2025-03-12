const bcrypt = require('bcryptjs');
const { Department, Employee } = require('../models');

const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await Employee.destroy({ where: {} });
    await Department.destroy({ where: {} });

    // Seed departments
    const departments = [
      { dept_name: 'Human Resources', description: 'HR department handling employee management' },
      { dept_name: 'Information Technology', description: 'IT department for technical operations' },
      { dept_name: 'Finance', description: 'Finance and accounting department' },
      { dept_name: 'Marketing', description: 'Marketing and communications department' }
    ];

    console.log('Seeding departments...');
    const createdDepartments = await Department.bulkCreate(departments);

    // Seed admin user (super admin)
    console.log('Seeding admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    await Employee.create({
      emp_name: 'Admin User',
      emp_email: 'admin@example.com',
      emp_address: 'Admin Office',
      username: 'admin',
      password_hash: adminPassword,
      dept_id: createdDepartments[0].dept_id,
      role: 'admin',
      is_manager: false
    });

    // Seed manager (department head)
    console.log('Seeding manager...');
    const managerPassword = await bcrypt.hash('password123', 10);
    await Employee.create({
      emp_name: 'John Doe',
      emp_email: 'john@example.com',
      emp_address: '123 Main St',
      username: 'johndoe',
      password_hash: managerPassword,
      dept_id: createdDepartments[1].dept_id,
      role: 'manager',
      is_manager: true
    });

    // Seed regular employees
    const employees = [
      {
        emp_name: 'Jane Smith',
        emp_email: 'jane@example.com',
        emp_address: '456 Oak Ave',
        username: 'janesmith',
        password_hash: await bcrypt.hash('password123', 10),
        dept_id: createdDepartments[1].dept_id, // Same department as John Doe (manager)
        role: 'employee',
        is_manager: false
      },
      {
        emp_name: 'Bob Wilson',
        emp_email: 'bob@example.com',
        emp_address: '789 Pine St',
        username: 'bobwilson',
        password_hash: await bcrypt.hash('password123', 10),
        dept_id: createdDepartments[2].dept_id,
        role: 'employee',
        is_manager: false
      }
    ];

    console.log('Seeding employees...');
    await Employee.bulkCreate(employees);

    console.log('Database seeding completed successfully!');
    console.log('Roles created: admin (super admin), manager (department head), employee');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = seedDatabase;