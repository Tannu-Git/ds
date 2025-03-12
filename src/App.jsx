import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Layout, ConfigProvider, theme as antdTheme, message } from 'antd';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import LeaveManagement from './pages/LeaveManagement';
import TimeTracking from './pages/TimeTracking';
import Attendance from './pages/Attendance';
import Login from './pages/Login';
import { ThemeProvider, useTheme } from './components/ui/theme-provider';

const { Content } = Layout;

// RequireAuth component to protect routes
const RequireAuth = ({ children, allowedRoles = [] }) => {
  const { user, role } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Wrapper component to apply Ant Design theme based on our theme context
const ThemedApp = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Configure message globally
  message.config({
    top: 60,
    duration: 3,
    maxCount: 3,
    prefixCls: isDark ? 'dark-message' : 'light-message',
  });

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? '#6366f1' : '#4f46e5', // Indigo that works well in both modes
          borderRadius: 12,
          colorText: isDark ? '#f1f5f9' : '#0f172a',
          colorTextSecondary: isDark ? '#cbd5e1' : '#475569',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        },
        components: {
          Table: {
            colorBgContainer: isDark ? '#1e1e2d' : '#ffffff',
            colorText: isDark ? '#f1f5f9' : '#0f172a',
            colorBorderSecondary: isDark ? '#2d2d3d' : '#e2e8f0',
            colorFillAlter: isDark ? '#27273b' : '#f8fafc',
          },
          Card: {
            colorBgContainer: isDark ? '#1e1e2d' : '#ffffff',
            colorTextHeading: isDark ? '#f8fafc' : '#0f172a',
            boxShadow: isDark 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
          },
          Button: {
            colorPrimaryHover: isDark ? '#818cf8' : '#4338ca',
            colorPrimaryActive: isDark ? '#6366f1' : '#3730a3',
            colorBgContainer: isDark ? '#27273b' : '#ffffff',
            colorText: isDark ? '#f1f5f9' : '#0f172a',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          },
          Menu: {
            darkItemBg: '#0f0f1a',
            darkItemHoverBg: '#1e1e2d',
            darkItemSelectedBg: '#4f46e5',
            itemBg: '#ffffff',
            itemHoverBg: '#f1f5f9',
            itemSelectedBg: '#e0e7ff',
          },
          Layout: {
            bodyBg: isDark ? '#0f0f1a' : '#f8fafc',
            headerBg: isDark ? '#1e1e2d' : '#ffffff',
            siderBg: isDark ? '#0f0f1a' : '#ffffff',
          },
          Input: {
            colorBgContainer: isDark ? '#27273b' : '#ffffff',
            colorText: isDark ? '#f1f5f9' : '#0f172a',
            colorBorder: isDark ? '#2d2d3d' : '#e2e8f0',
            borderRadius: '0.75rem',
          },
          Select: {
            colorBgContainer: isDark ? '#27273b' : '#ffffff',
            colorText: isDark ? '#f1f5f9' : '#0f172a',
            colorBorder: isDark ? '#2d2d3d' : '#e2e8f0',
            borderRadius: '0.75rem',
          }
        }
      }}
    >
      <div className={`${isDark ? 'dark' : 'light'} transition-colors duration-300`}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <Layout style={{ minHeight: '100vh' }} className={`${isDark ? 'bg-[#0f0f1a]' : 'bg-slate-50'} transition-colors duration-300`}>
                    <Sidebar />
                    <Layout className={`${isDark ? 'bg-[#0f0f1a]' : 'bg-slate-50'} transition-colors duration-300`}>
                      <Content 
                        className={`m-6 p-6 ${
                          isDark ? 'bg-[#1e1e2d] text-white' : 'bg-white text-slate-900'
                        } rounded-xl shadow-lg backdrop-blur-sm backdrop-filter transition-all duration-300 hover:shadow-xl`}
                      >
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/attendance" element={<Attendance />} />
                          <Route path="/employees" element={<Employees />} />
                          <Route path="/departments" element={<Departments />} />
                          <Route path="/leave-management" element={<LeaveManagement />} />
                          <Route path="/time-tracking" element={<TimeTracking />} />
                        </Routes>
                      </Content>
                    </Layout>
                  </Layout>
                </RequireAuth>
              }
            />
          </Routes>
        </Router>
      </div>
    </ConfigProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Add your token verification logic here
    }
  }, [dispatch]);

  return <ThemedApp />;
};

export default App;