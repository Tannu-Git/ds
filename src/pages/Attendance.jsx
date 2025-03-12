import React, { useState, useEffect } from 'react';
import { Card, QRCode, Space, Typography, Button, Modal, message, Table, Select } from 'antd';
import { QrcodeOutlined, ScanOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';

const { Title } = Typography;

const Attendance = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [qrValue, setQrValue] = useState('');
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  
  // Fix: Properly destructure auth state
  const { user, role } = useSelector((state) => state.auth);

  // Add columns definition
  const columns = [
    {
      title: 'Employee',
      dataIndex: ['Employee', 'emp_name'],
      key: 'emp_name',
    },
    {
      title: 'Date & Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'IN' ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {status}
        </span>
      )
    }
  ];

  // Add QR code generation function
  const generateQRCode = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/attendance/generate-qr`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setQrValue(response.data.qrCode);
    } catch (error) {
      console.error('QR Generation error:', error);
      message.error('Failed to generate QR code');
    }
  };

  // Add scanning functionality
  const startScanning = () => {
    setIsScanning(true);
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(async (decodedText) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/attendance/verify-qr`,
          { qrData: decodedText },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (response.data.valid) {
          message.success('Attendance marked successfully!');
          scanner.clear();
          setIsScanning(false);
          // Refresh attendance data
          fetchAttendance();
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'Failed to verify QR code');
      }
    });
    setScanner(scanner);
  };

  return (
    <div className="space-y-6">
      <Title level={2}>Attendance Management</Title>
      {role === 'admin' && (
        <>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="QR Code Generator">
              <Space>
                <Button type="primary" onClick={generateQRCode} icon={<QrcodeOutlined />}>
                  Generate QR Code
                </Button>
                <Button onClick={() => startScanning()} icon={<ScanOutlined />}>
                  Scan QR Code
                </Button>
              </Space>
              {qrValue && (
                <div style={{ marginTop: 16 }}>
                  <QRCode value={qrValue} size={256} />
                </div>
              )}
            </Card>
            <Card title="All Employees Attendance">
              <Table 
                columns={columns} 
                dataSource={attendanceHistory}
                rowKey={(record) => `${record.emp_id}-${record.timestamp}`}
              />
            </Card>
          </Space>
        </>
      )}
      
      {/* ... rest of your existing JSX ... */}

      <Modal
        title="QR Code Scanner"
        open={isScanning}
        onCancel={() => {
          setIsScanning(false);
          scanner?.clear();
        }}
        footer={null}
      >
        <div id="reader"></div>
      </Modal>
    </div>
  );
};

export default Attendance;