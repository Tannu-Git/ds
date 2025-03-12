import React from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from './ui/theme-provider';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <Button
        type="text"
        icon={isDark ? <BulbOutlined /> : <BulbFilled />}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ 
          color: isDark ? '#fff' : '#000',
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          boxShadow: isDark ? '0 0 10px rgba(255,255,255,0.1)' : '0 0 10px rgba(0,0,0,0.05)'
        }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      />
    </Tooltip>
  );
};

export default ThemeToggle;