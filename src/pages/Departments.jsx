import React, { useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addDepartmentStart, addDepartmentSuccess, addDepartmentFailure, updateDepartmentStart, updateDepartmentSuccess, updateDepartmentFailure, deleteDepartmentStart, deleteDepartmentSuccess, deleteDepartmentFailure } from '../store/slices/departmentSlice';
import { motion } from 'framer-motion';
import { useTheme } from '../components/ui/theme-provider';
import FormDialog from '../components/ui/form-dialog';

const Departments = () => {
  const dispatch = useDispatch();
  const { departments, loading } = useSelector((state) => state.departments);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const formFields = [
    { name: 'name', label: 'Department Name', type: 'text' },
    { name: 'manager', label: 'Manager', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ]},
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'dept_id',
      key: 'dept_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: 'Employee Count',
      dataIndex: 'employee_count',
      key: 'employee_count',
      render: (count) => (
        <motion.span
          className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          {count || 0}
        </motion.span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <motion.span
          className={`px-3 py-1 rounded-full text-sm font-medium ${status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          {status?.charAt(0).toUpperCase() + status?.slice(1) || 'N/A'}
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
              onClick={() => handleDelete(record.dept_id)}
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
    setSelectedDepartment(record);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (deptId) => {
    try {
      dispatch(deleteDepartmentStart());
      // API call would go here
      dispatch(deleteDepartmentSuccess(deptId));
      message.success('Department deleted successfully');
    } catch (error) {
      dispatch(deleteDepartmentFailure(error.message));
      message.error('Failed to delete department');
    }
  };

  const handleAddSubmit = async (values) => {
    try {
      dispatch(addDepartmentStart());
      const newDepartment = {
        ...values,
        dept_id: Date.now().toString(), // Temporary ID generation
        employee_count: 0,
      };
      // API call would go here
      dispatch(addDepartmentSuccess(newDepartment));
      message.success('Department added successfully');
      setIsAddDialogOpen(false);
    } catch (error) {
      dispatch(addDepartmentFailure(error.message));
      message.error('Failed to add department');
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      dispatch(updateDepartmentStart());
      const updatedDepartment = {
        ...selectedDepartment,
        ...values,
      };
      // API call would go here
      dispatch(updateDepartmentSuccess(updatedDepartment));
      message.success('Department updated successfully');
      setIsEditDialogOpen(false);
    } catch (error) {
      dispatch(updateDepartmentFailure(error.message));
      message.error('Failed to update department');
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
            Departments
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
              Add Department
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
            dataSource={departments}
            loading={loading}
            rowKey="dept_id"
            className="[&_.ant-table]:!bg-transparent"
            rowClassName={() => 'hover:!bg-slate-100/50 dark:hover:!bg-slate-800/50 transition-colors duration-200'}
          />
        </motion.div>
      </motion.div>

      <FormDialog
        title="Add Department"
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddSubmit}
        fields={formFields}
        loading={loading}
        submitText="Add Department"
      />

      <FormDialog
        title="Edit Department"
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        fields={formFields}
        initialValues={selectedDepartment}
        loading={loading}
        submitText="Update Department"
      />
    </div>
  );
};

export default Departments;