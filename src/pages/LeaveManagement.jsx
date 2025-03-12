import React, { useState } from 'react';
import { Table, Button, Space, Tag, message } from 'antd';
import { motion } from 'framer-motion';
import { useTheme } from '../components/ui/theme-provider';
import FormDialog from '../components/ui/form-dialog';
import { useSelector, useDispatch } from 'react-redux';

const LeaveManagement = () => {
  const dispatch = useDispatch();
  const { leaves, loading } = useSelector((state) => state.leaves);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const formFields = [
    { name: 'employee_name', label: 'Employee Name', type: 'text' },
    { name: 'leave_type', label: 'Leave Type', type: 'select', options: [
      { value: 'annual', label: 'Annual Leave' },
      { value: 'sick', label: 'Sick Leave' },
      { value: 'personal', label: 'Personal Leave' },
      { value: 'unpaid', label: 'Unpaid Leave' },
    ]},
    { name: 'start_date', label: 'Start Date', type: 'date' },
    { name: 'end_date', label: 'End Date', type: 'date' },
    { name: 'reason', label: 'Reason', type: 'text' },
  ];

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee_name',
      key: 'employee_name',
    },
    {
      title: 'Type',
      dataIndex: 'leave_type',
      key: 'leave_type',
      render: (type) => (
        <motion.span
          className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          {type}
        </motion.span>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <Tag 
            color={status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'error'}
            className={`px-3 py-1 rounded-full text-sm font-medium ${status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}
          >
            {status.toUpperCase()}
          </Tag>
        </motion.div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  type="primary"
                  onClick={() => handleApprove(record)}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-none shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Approve
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  type="primary" 
                  danger
                  onClick={() => handleReject(record)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-none shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Reject
                </Button>
              </motion.div>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleApprove = async (record) => {
    try {
      // API call would go here
      const updatedLeave = { ...record, status: 'approved' };
      // dispatch(updateLeaveSuccess(updatedLeave));
      message.success('Leave request approved successfully!');
    } catch (error) {
      message.error('Failed to approve leave request');
    }
  };

  const handleReject = async (record) => {
    try {
      // API call would go here
      const updatedLeave = { ...record, status: 'rejected' };
      // dispatch(updateLeaveSuccess(updatedLeave));
      message.error('Leave request rejected!');
    } catch (error) {
      message.error('Failed to reject leave request');
    }
  };

  const handleRequestLeave = () => {
    setIsRequestDialogOpen(true);
  };

  const handleRequestSubmit = async (values) => {
    try {
      const newLeave = {
        ...values,
        leave_id: Date.now().toString(),
        status: 'pending',
      };
      // API call would go here
      // dispatch(addLeaveSuccess(newLeave));
      message.success('Leave request submitted successfully!');
      setIsRequestDialogOpen(false);
    } catch (error) {
      message.error('Failed to submit leave request');
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
            Leave Management
          </motion.h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="primary" 
              onClick={handleRequestLeave}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 border-none h-10 px-6 font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              Request Leave
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
            dataSource={leaves}
            rowKey="leave_id"
            className="[&_.ant-table]:!bg-transparent"
            rowClassName={() => 'hover:!bg-slate-100/50 dark:hover:!bg-slate-800/50 transition-colors duration-200'}
          />
        </motion.div>
      </motion.div>

      <FormDialog
        title="Request Leave"
        open={isRequestDialogOpen}
        onClose={() => setIsRequestDialogOpen(false)}
        onSubmit={handleRequestSubmit}
        fields={formFields}
        loading={loading}
        submitText="Submit Request"
      />
    </div>
  );
};

export default LeaveManagement;