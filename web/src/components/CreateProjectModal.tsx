import React from 'react';
import { Modal, Form, Button, Avatar, Typography, Input } from 'antd';

const { Title } = Typography;
const { Search } = Input;

interface CreateProjectModalProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ visible, onCreate, onCancel, user }) => {
  const [form] = Form.useForm();

  const onSearch = (value: string) => {
    console.log('Searching:', value);
    // Implement search functionality here
  };

  return (
    <Modal
      visible={visible}
      title="Create a new project"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onCreate(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()} disabled>
          Create
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="create_project_form"
        // onFieldsChange={() => {
        //   const fields = form.getFieldsError();
        //   const hasError = fields.some(field => field.errors.length > 0);
        //   const hasEmptyField = fields.some(field => !field.value);
        //   form.setFieldsValue({ createDisabled: hasError || hasEmptyField });
        // }}
      >
        <Form.Item
          name="projectName"
          label="1. Enter a name for the project"
          rules={[{ required: true, message: 'Please enter the project name' }]}
        >
          <Input placeholder="For eg, Web Development" />
        </Form.Item>
        <Form.Item label="2. Select project members">
          <p style={{ color: 'gray', marginBottom: '24px' }}>
            You need to select a contributor, reviewer and approver to be able to create the project.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Avatar src={user.avatarUrl || "https://joeschmoe.io/api/v1/random"} style={{ marginRight: '8px' }} size="large" />
            <div style={{ flexGrow: 1 }}>
              <strong>{user.name}</strong>
              <br />
              <span>{user.email}</span>
            </div>
            <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>Admin</span>
          </div>
          <Form.Item
            name="contributor"
            rules={[{ required: true, message: 'Please select a contributor' }]}
          >
            <Search placeholder="Search by name or email" onSearch={onSearch} enterButton />
          </Form.Item>
          <Form.Item
            name="reviewer"
            rules={[{ required: true, message: 'Please select a reviewer' }]}
          >
            <Search placeholder="Search by name or email" onSearch={onSearch} enterButton />
          </Form.Item>
          <Form.Item
            name="approver"
            rules={[{ required: true, message: 'Please select an approver' }]}
          >
            <Search placeholder="Search by name or email" onSearch={onSearch} enterButton />
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;
