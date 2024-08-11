import React from 'react';
import { Modal, Form, Button, Avatar, Typography, Input, message } from 'antd';
import { createAvatar } from './helper/createAvatar';
import { useUserSession } from '@/hooks/useUserSession';

const { Title } = Typography;
const { Search } = Input;

interface CreateProjectModalProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const { user: loggedInUser } = useUserSession();

  const avatar = createAvatar(loggedInUser?.name as string, 38);

  const handleCreateProject = async () => {
    const values = form.getFieldsValue();

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.projectName,
          contributorId: values.contributor,
          reviewerId: values.reviewer,
          approverId: values.approver,
          userId: loggedInUser?.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        message.success('Project created successfully');
        onCreate(data.project);
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to create project');
      }
    } catch (error) {
      message.error('Failed to create project');
    }
  };

  return (
    <Modal
      visible={visible}
      title="Create a new project"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleCreateProject}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleCreateProject}>
          Create
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="create_project_form"
      >
        <Form.Item
          name="projectName"
          label="1. Enter a name for the project"
        >
          <Input placeholder="For eg, Web Development" />
        </Form.Item>
        <Form.Item label="2. Select project members">
          <p style={{ color: 'gray', marginBottom: '24px' }}>
            You need to select a contributor, reviewer, and approver to be able to create the project.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            {avatar}
            <div style={{ flexGrow: 1, marginLeft: '12px' }}>
              <strong>{loggedInUser?.name}</strong>
              <br />
              <span>{loggedInUser?.email}</span>
            </div>
            <span style={{ marginLeft: 'auto' }}>Admin</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Form.Item
              name="contributor"
              style={{ flexGrow: 1, marginBottom: 0 }}
            >
              <Search 
                placeholder="Search by name or email" 
                style={{ width: '400px' }} // Set width to 400px
              />
            </Form.Item>
            <span style={{ marginLeft: 'auto'}}>Contributor</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Form.Item
              name="reviewer"
              style={{ flexGrow: 1, marginBottom: 0 }}
            >
              <Search 
                placeholder="Search by name or email" 
                style={{ width: '400px' }} // Set width to 400px
              />
            </Form.Item>
            <span style={{ marginLeft: 'auto'}}>Reviewer</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Form.Item
              name="approver"
              style={{ flexGrow: 1, marginBottom: 0 }}
            >
              <Search 
                placeholder="Search by name or email" 
                style={{ width: '400px' }} // Set width to 400px
              />
            </Form.Item>
            <span style={{ marginLeft: 'auto'}}>Approver</span>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;
