import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { motion } from 'framer-motion';
import { useTheme } from '../components/ui/theme-provider';

const TimeTracking = () => {
  const timeRecords = [];
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee_name',
      key: 'employee_name',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Clock In',
      dataIndex: 'clock_in',
      key: 'clock_in',
    },
    {
      title: 'Clock Out',
      dataIndex: 'clock_out',
      key: 'clock_out',
    },
    {
      title: 'Total Hours',
      dataIndex: 'total_hours',
      key: 'total_hours',
      render: (hours) => (
        <motion.span
          className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          {hours} hrs
        </motion.span>
      ),
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
          <Tag color={status === 'completed' ? 'success' : 'warning'}
               className={`px-3 py-1 rounded-full text-sm font-medium ${status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              type="primary"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none shadow-md hover:shadow-lg transition-all duration-200"
            >
              Edit
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              type="primary" 
              danger
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-none shadow-md hover:shadow-lg transition-all duration-200"
            >
              Delete
            </Button>
          </motion.div>
        </Space>
      ),
    },
  ];

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
            Time Tracking
          </motion.h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="primary" 
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 border-none h-10 px-6 font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              Add Time Record
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
            dataSource={timeRecords}
            rowKey="id"
            className="[&_.ant-table]:!bg-transparent"
            rowClassName={() => 'hover:!bg-slate-100/50 dark:hover:!bg-slate-800/50 transition-colors duration-200'}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TimeTracking;