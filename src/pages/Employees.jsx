import React, { useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { deleteEmployeeStart, deleteEmployeeSuccess, deleteEmployeeFailure, addEmployeeStart, addEmployeeSuccess, addEmployeeFailure, updateEmployeeStart, updateEmployeeSuccess, updateEmployeeFailure } from '../store/slices/employeeSlice';
import { motion } from 'framer-motion';
import { useTheme } from '../components/ui/theme-provider';
import FormDialog from '../components/ui/form-dialog';
import { employeeApi } from '../utils/api';

const Employees = () => {
  const dispatch = useDispatch();
  const { employees, loading } = useSelector((state) => state.employees);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const formFields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'text', rules: [{ required: true, type: 'email' }] },
    { name: 'department', label: 'Department', type: 'select', options: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'hr', label: 'Human Resources' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
    ]},
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ]},
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'emp_id',
      key: 'emp_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <motion.span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status && status.toLowerCase() === 'active' 
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          {status || 'N/A'}
        </motion.span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              type="primary"
              onClick={() => handleEdit(record)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none shadow-md hover:shadow-lg transition-all duration-200"
            >
              Edit
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              type="primary" 
              danger 
              onClick={() => handleDelete(record.emp_id)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-none shadow-md hover:shadow-lg transition-all duration-200"
            >
              Delete
            </Button>
          </motion.div>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedEmployee(record);
    setIsEditDialogOpen(true);
  };

  // Add data fetching
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeApi.getAll();
        dispatch(setEmployees(response.data));
      } catch (error) {
        message.error('Failed to fetch employees');
      }
    };

    fetchEmployees();
  }, [dispatch]);

  const handleDelete = async (empId) => {
    try {
      dispatch(deleteEmployeeStart());
      await employeeApi.delete(empId);
      dispatch(deleteEmployeeSuccess(empId));
      message.success('Employee deleted successfully');
    } catch (error) {
      dispatch(deleteEmployeeFailure(error.message));
      message.error('Failed to delete employee');
    }
  };

  const handleAddSubmit = async (values) => {
    try {
      dispatch(addEmployeeStart());
      const response = await employeeApi.create(values);
      dispatch(addEmployeeSuccess(response.data));
      message.success('Employee added successfully');
    } catch (error) {
      dispatch(addEmployeeFailure(error.message));
      message.error('Failed to add employee');
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      dispatch(updateEmployeeStart());
      const updatedEmployee = {
        ...selectedEmployee,
        ...values,
      };
      // API call would go here
      dispatch(updateEmployeeSuccess(updatedEmployee));
      message.success('Employee updated successfully');
    } catch (error) {
      dispatch(updateEmployeeFailure(error.message));
      message.error('Failed to update employee');
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-slate-200/50 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-xl"></div>
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 bg-[size:20px_20px] opacity-[0.05]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400"
          >
            Employees
          </motion.h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="primary" 
              onClick={handleAdd}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 border-none h-10 px-6 font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              Add Employee
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
        >
          <Table
            columns={columns}
            dataSource={employees}
            loading={loading}
            rowKey="emp_id"
            className="[&_.ant-table]:!bg-transparent"
            rowClassName={() => 'hover:!bg-slate-100/50 dark:hover:!bg-slate-800/50 transition-colors duration-200'}
          />
        </motion.div>
      </motion.div>

      <FormDialog
        title="Add Employee"
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddSubmit}
        fields={formFields}
        loading={loading}
        submitText="Add Employee"
      />

      <FormDialog
        title="Edit Employee"
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        fields={formFields}
        initialValues={selectedEmployee}
        loading={loading}
        submitText="Update Employee"
      />
    </div>
  );
};

export default Employees;