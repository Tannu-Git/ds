import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Space } from 'antd';
import { motion } from 'framer-motion';
import { useTheme } from './theme-provider';

const FormDialog = ({
  title,
  open,
  onClose,
  onSubmit,
  fields,
  initialValues,
  loading,
  submitText = 'Submit',
}) => {
  const [form] = Form.useForm();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      label: field.label,
      name: field.name,
      rules: field.rules || [{ required: true, message: `Please input ${field.label}!` }],
    };

    switch (field.type) {
      case 'select':
        return (
          <Form.Item key={field.name} {...commonProps}>
            <Select
              placeholder={`Select ${field.label.toLowerCase()}`}
              options={field.options}
              className="w-full"
            />
          </Form.Item>
        );
      case 'date':
        return (
          <Form.Item key={field.name} {...commonProps}>
            <DatePicker className="w-full" />
          </Form.Item>
        );
      case 'dateRange':
        return (
          <Form.Item key={field.name} {...commonProps}>
            <DatePicker.RangePicker className="w-full" />
          </Form.Item>
        );
      default:
        return (
          <Form.Item key={field.name} {...commonProps}>
            <Input placeholder={`Enter ${field.label.toLowerCase()}`} />
          </Form.Item>
        );
    }
  };

  return (
    <Modal
      title={
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold"
        >
          {title}
        </motion.div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      className={isDark ? 'dark-theme' : ''}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          className="mt-4"
        >
          {fields.map(renderField)}
          <Form.Item className="mb-0 mt-4">
            <Space className="w-full justify-end">
              <Button onClick={onClose}>
                Cancel
              </Button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {submitText}
                </Button>
              </motion.div>
            </Space>
          </Form.Item>
        </Form>
      </motion.div>
    </Modal>
  );
};

export default FormDialog;