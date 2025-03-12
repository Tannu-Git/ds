import React,{useEffect} from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values) => {
    try {
      dispatch(loginStart());
      const response = await api.post('/api/auth/login', values);
      
      const userData = {
        ...response.data.employee,
        token: response.data.token,
        role: response.data.employee.role // Use role from server response
      };
      
      localStorage.setItem('token', response.data.token);
      dispatch(loginSuccess(userData));
      message.success('Login successful');
      
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
      message.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 dark:opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 dark:opacity-30 animate-float animation-delay-2000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 bg-[size:20px_20px] opacity-20"></div>
      </div>

      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-2xl border border-slate-200/50 dark:border-slate-700/50 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.h1 
            className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400"
            animate={{ 
              backgroundPosition: ["0%", "100%"],
              backgroundSize: ["100%", "200%"]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            Welcome Back
          </motion.h1>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="space-y-6"
          >
            <Form.Item
              label={<span className="text-slate-700 dark:text-slate-300 font-medium">Username</span>}
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input 
                className="h-11 rounded-lg border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-opacity-50 hover:border-purple-400 dark:hover:border-purple-500" 
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-slate-700 dark:text-slate-300 font-medium">Password</span>}
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                className="h-11 rounded-lg border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-opacity-50 hover:border-purple-400 dark:hover:border-purple-500" 
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-11 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] focus:scale-[0.98]"
              >
                Sign In
              </Button>
            </Form.Item>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 dark:text-red-400 text-center text-sm bg-red-50 dark:bg-red-900/30 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </Form>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;