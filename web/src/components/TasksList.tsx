import React, { useState, useEffect } from 'react';
import { Button, Layout, Row, Col, Card, message, Tag, Typography, Badge } from 'antd';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import { Task } from '@/models/Tasks';
import { useSession } from 'next-auth/react';
import { useUserSession } from '@/hooks/useUserSession';

const { Content } = Layout;
const { Title } = Typography;

interface TasksListProps {
  projectId: string;
  projectName: string;
}

const TasksList: React.FC<TasksListProps> = ({ projectId, projectName }) => {
  const { data: session } = useSession(); 
  const { user, isLoading } = useUserSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) return;

      try {
        const response = await fetch(`/api/tasks?projectId=${projectId}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        message.error('Error loading tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  const tasksToDo = tasks.filter(task => task.status === 'pending');
  const tasksInProgress = tasks.filter(task => task.status === 'active');
  const tasksCompleted = tasks.filter(task => task.status === 'completed');

  const updateTaskAsCompleted = async (taskId: number) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          taskId,
          updates: { status: 'completed' },
          projectId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        message.success('Task marked as completed');
        setTasks(data.tasks);
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to mark task as completed');
      }
    } catch (error) {
      message.error('Failed to mark task as completed');
    }
  };

  const handleAddTask = () => {
    // Logic to add a new task
    message.info('Add Task button clicked');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Navbar 
        user={{
          name: session?.user?.name || '',
          role: 'admin',
          email: session?.user?.email || ''
        }} 
        notificationsCount={2} 
      />
      <Content style={{ margin: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ marginBottom: '24px', textAlign: 'left' }}>{projectName}</Title>
          {user?.project.projectRole === 'approver' && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddTask}
            >
              Add Task
            </Button>
          )}
        </div>
        <Row gutter={24}>
          <Col span={8}>
            <Title level={4} style={{ marginBottom: '16px' }}>To Do <Badge count={tasksToDo.length} showZero color="#595959" /> </Title>

            <Row>
              {tasksToDo.map(task => (
                <Col key={task.id} span={12} style={{ padding: 5 }}>
                  <Card 
                    key={task.id} 
                    style={{ marginBottom: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', maxWidth: '100%' }}
                  >
                    <h3 style={{ fontSize: '16px', fontWeight: '500' }}>{task.title}</h3>
                    <p style={{ margin: '8px 0', color: '#595959' }}>Assigned to: {task.assignedTo}</p>
                    <p style={{ margin: '0', color: '#8c8c8c' }}>{task.description}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          <Col span={8}>
            <Title level={4} style={{ marginBottom: '16px' }}>In Progress <Badge count={tasksInProgress.length} showZero color="#E667FF" /></Title>

            <Row>
              {tasksInProgress.map(task => (
                <Col key={task.id} span={12} style={{ padding: 5 }}>
                  <Card 
                    key={task.id} 
                    style={{ marginBottom: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', maxWidth: '100%' }}
                  >
                    <h3 style={{ fontSize: '16px', fontWeight: '500' }}>{task.title}</h3>
                    <p style={{ margin: '8px 0', color: '#595959' }}>Assigned to: {task.assignedTo}</p>
                    <p style={{ margin: '0', color: '#8c8c8c' }}>{task.description}</p>
                    {task.assignedTo === user?.id && (
                      <Button 
                        type="primary" 
                        icon={<CheckOutlined />} 
                        style={{ marginTop: 10 }}
                        onClick={() => updateTaskAsCompleted(task.id)} 
                      >
                        Done
                      </Button>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          <Col span={8}>
            <Title level={4} style={{ marginBottom: '16px' }}>Completed <Badge count={tasksCompleted.length} showZero color="#52C41A" /></Title>

            <Row>
              {tasksCompleted.map(task => (
                <Col key={task.id} span={12} style={{ padding: 5 }}>
                  <Card 
                    key={task.id} 
                    style={{ marginBottom: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', maxWidth: '100%' }}
                  >
                    <h3 style={{ fontSize: '16px', fontWeight: '500' }}>{task.title}</h3>
                    <p style={{ margin: '8px 0', color: '#595959' }}>Completed by {task.assignedTo}</p>
                    <p style={{ margin: '0', color: '#8c8c8c' }}>{task.description}</p>
                    <Tag color="green" icon={<CheckOutlined />}>Completed</Tag>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default TasksList;
