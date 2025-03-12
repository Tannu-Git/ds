import React from 'react';
import { Layout, Menu, Typography, Divider } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  DashboardOutlined,
  TeamOutlined,
  BranchesOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ui/theme-provider';
import { logout } from '../store/slices/authSlice';

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = () => {
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Define menu items
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      access: ['admin', 'employee']
    },
    {
      key: '/attendance',
      icon: <QrcodeOutlined />,
      label: 'Attendance',
      access: ['admin', 'employee']
    },
    {
      key: '/employees',
      icon: <TeamOutlined />,
      label: 'Employees',
      access: ['admin']
    },
    {
      key: '/departments',
      icon: <BranchesOutlined />,
      label: 'Departments',
      access: ['admin']
    },
    {
      key: '/leave-management',
      icon: <CalendarOutlined />,
      label: 'Leave Management',
      access: ['admin', 'employee']
    },
    {
      key: '/time-tracking',
      icon: <ClockCircleOutlined />,
      label: 'Time Tracking',
      access: ['admin', 'employee']
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      className: 'mt-auto'
    }
  ];

  // Filter menu items based on role, with safety check
  const filteredMenuItems = menuItems.filter(item => 
    role && item.access && item.access.includes(role)
  );

  const handleMenuClick = (item) => {
    if (item.key === '/logout') {
      navigate('/login');
      return;
    }
    navigate(item.key);
  };

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        boxShadow: isDark ? '2px 0 8px rgba(0,0,0,0.5)' : '2px 0 8px rgba(0,0,0,0.15)'
      }}
      className={isDark ? 'bg-slate-900' : ''}
    >
      <div style={{
        height: 64,
        margin: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Title level={4} style={{ color: '#fff', margin: 0 }}>EMS</Title>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={filteredMenuItems}
        onClick={({ key }) => navigate(key)}
        style={{
          borderRight: 0,
          background: 'transparent'
        }}
      />
      <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
      <div className="px-4 py-2 flex justify-center">
        <ThemeToggle />
      </div>
    </Sider>
  );
};

export default Sidebar;