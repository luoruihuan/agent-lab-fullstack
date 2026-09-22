import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { api } from '../../services/api';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      api.getSettings().then(res => {
        form.setFieldsValue({
          openaiBaseUrl: res.openaiBaseUrl || 'https://api.openai.com/v1',
          openaiApiKey: '',
          defaultModel: res.defaultModel || 'gpt-4o-mini',
        });
      }).catch(err => {
        message.error('获取设置失败: ' + err.message);
      });
    }
  }, [open, form]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await api.updateSettings({
        openaiBaseUrl: values.openaiBaseUrl,
        openaiApiKey: values.openaiApiKey || undefined,
        defaultModel: values.defaultModel,
      });
      message.success('设置保存成功');
      onClose();
    } catch (err: any) {
      if (err.errorFields) return;
      message.error('保存失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="设置" open={open} onCancel={onClose} onOk={onOk} confirmLoading={loading}>
      <Form form={form} layout="vertical">
        <Form.Item label="OpenAI Base URL" name="openaiBaseUrl">
          <Input placeholder="https://api.openai.com/v1" />
        </Form.Item>
        <Form.Item label="OpenAI API Key" name="openaiApiKey" extra="留空则不修改现有的 Key">
          <Input.Password placeholder="sk-..." />
        </Form.Item>
        <Form.Item label="默认模型" name="defaultModel">
          <Input placeholder="gpt-4o-mini" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SettingsModal;
