const Employee = require('./Employee');
const Department = require('./Department');

// Define associations
Employee.belongsTo(Department, { foreignKey: 'dept_id', as: 'department' });
Department.hasMany(Employee, { foreignKey: 'dept_id', as: 'employees' });

module.exports = {
  Employee,
  Department
};