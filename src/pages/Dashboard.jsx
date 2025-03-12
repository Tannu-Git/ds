import React, { useEffect, useRef } from 'react';
import { Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useTheme } from '../components/ui/theme-provider';
import { fetchEmployees } from '../store/slices/employeesSlice';

// Enhanced StatCard with professional styling and better dark mode
const StatCard = ({ title, value, icon, color, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { theme } = useTheme();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, delay: delay * 0.1 + 0.3 }
        }
      }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        boxShadow: theme === 'dark' 
          ? "0 20px 30px -10px rgba(0, 0, 0, 0.5), 0 10px 20px -8px rgba(0, 0, 0, 0.5)" 
          : "0 20px 30px -10px rgba(0, 0, 0, 0.1), 0 10px 20px -8px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="w-full h-full"
    >
      <div className="relative p-6 overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm h-full">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`smallGrid-${title}`} width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#smallGrid-${title})`} />
          </svg>
        </div>
        
        <div className="relative z-10 flex items-center space-x-5">
          <div className={`p-4 rounded-lg ${color} flex items-center justify-center shadow-lg`}>
            {React.cloneElement(icon, { className: "text-2xl text-white" })}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 tracking-wide">{title}</p>
            <motion.h3 
              className="text-3xl font-bold text-slate-800 dark:text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay * 0.1 + 0.5, duration: 0.5 }}
            >
              {value}
            </motion.h3>
          </div>
        </div>
        
        {/* Subtle accent line */}
        <div className={`absolute bottom-0 left-0 h-1 ${color} w-full opacity-80`}></div>
        
        {/* Subtle top highlight for depth */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"></div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { employees, loading } = useSelector((state) => state.employees);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);
  const controls = useAnimation();
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true });
  const { theme } = useTheme();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <div className="p-8 relative overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Professional background effects */}
      <div className="absolute inset-0 z-0">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Subtle gradient orbs - more professional in dark mode */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 dark:opacity-[0.07] animate-blob"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 dark:opacity-[0.07] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-cyan-400 dark:bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 dark:opacity-[0.07] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          className="mb-12"
        >
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white tracking-tight mb-2"
          >
            Welcome, {user?.emp_name || 'User'}
          </motion.h1>
          <motion.div 
            variants={{
              hidden: { opacity: 0, width: 0 },
              visible: { opacity: 1, width: "100px" }
            }}
            transition={{ duration: 0.8 }}
            className="h-1 bg-blue-600 dark:bg-blue-500 mb-6"
          ></motion.div>
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-medium"
          >
            Welcome to your employee management dashboard. Monitor and manage your workforce efficiently.
          </motion.p>
        </motion.div>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Total Employees"
              value={employees.length}
              icon={<TeamOutlined />}
              color="bg-blue-600"
              delay={1}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Active Employees"
              value={employees.filter(emp => emp.status === 'active').length}
              icon={<UserOutlined />}
              color="bg-emerald-600"
              delay={2}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="On Leave"
              value={0}
              icon={<CalendarOutlined />}
              color="bg-amber-600"
              delay={3}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Time Tracking"
              value={0}
              icon={<ClockCircleOutlined />}
              color="bg-violet-600"
              delay={4}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;