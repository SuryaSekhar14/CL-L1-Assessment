import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Tabs, Input, Button, Progress, Avatar, Tooltip, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined, BookFilled, CheckOutlined } from '@ant-design/icons';
import CreateProjectModal from './CreateProjectModal';
import { createAvatar } from '@/components/helper/createAvatar';
import { useRouter } from 'next/router';
import { useUserSession } from '@/hooks/useUserSession';

const { Content } = Layout;
const { TabPane } = Tabs;

interface Project {
  id: string;
  name: string;
  members: {
    contributor: string;
    approver: string;
    reviewer: string;
    admin: string;
  };
  tasks: {
    id: string;
    title: string;
    status: 'active' | 'pending' | 'completed';
    assignedTo: string;
  }[];
}

const HomeLayout: React.FC<{ role: string }> = ({ role }) => {
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        message.error('Error loading projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const onCreate = (values: any) => {
    console.log('Received values from the form: ', values);
    setVisible(false);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleBookmark = (projectName: string) => {
    setBookmarked(prev =>
      prev.includes(projectName)
        ? prev.filter(name => name !== projectName)
        : [...prev, projectName]
    );
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <Content style={{ padding: '24px' }}>
      <h1>Projects</h1>
      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input.Search
              placeholder="Search for a project"
              style={{ width: '300px', marginRight: '16px' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {role === "admin" ? (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
                New Project
              </Button>
            ) : null}
          </div>
        }
      >
        <TabPane tab="All" key="1">
          <Row gutter={[16, 16]}>
            {filteredProjects.map((project, index) => {
              const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
              const totalTasks = project.tasks.length;
              const progress = (completedTasks / totalTasks) * 100;

              // Extract member names from the members object
              const memberNames = Object.values(project.members);

              return (
                <Col span={8} key={index}>
                  <Card
                    title={project.name}
                    extra={
                      bookmarked.includes(project.name)
                        ? <BookFilled onClick={() => toggleBookmark(project.name)} style={{ cursor: 'pointer' }} />
                        : <BookOutlined onClick={() => toggleBookmark(project.name)} style={{ cursor: 'pointer' }} />
                    }
                    actions={
                      role === "admin" ? 
                          [<EditOutlined key="edit" />,
                          <DeleteOutlined key="delete" />] 
                        : 
                          []
                      }
                    onClick={() => router.push(`/project/${project.id}`)}  // Navigate to the dynamic route
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: 0 }}>Progress</p>
                      <p style={{ margin: 0 }}>{`${completedTasks}/${totalTasks} Tasks`}</p>
                    </div>
                    <Progress 
                      percent={progress} 
                      status={progress === 100 ? 'success' : 'active'} 
                      format={percent => (percent === 100 ? <CheckOutlined /> : `${percent}%`)}
                    />
                    <div style={{ marginTop: '12px' }}>
                      <Avatar.Group>
                        {memberNames.map((member, idx) => (
                          <Tooltip title={member} key={idx}>
                            {createAvatar(member, 40, idx === 0 ? '#f56a00' : idx === 1 ? '#7265e6' : '#ffbf00')}
                          </Tooltip>
                        ))}
                      </Avatar.Group>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </TabPane>
        <TabPane tab="Assigned to Me" key="2">
          {/* Add content for Assigned to Me */}
        </TabPane>
        <TabPane tab="Bookmarked" key="3">
          <Row gutter={[16, 16]}>
            {filteredProjects
              .filter(project => bookmarked.includes(project.name))
              .map((project, index) => {
                const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
                const totalTasks = project.tasks.length;
                const progress = (completedTasks / totalTasks) * 100;

                // Extract member names from the members object
                const memberNames = Object.values(project.members);

                return (
                  <Col span={8} key={index}>
                    <Card
                      title={project.name}
                      extra={
                        <BookFilled onClick={() => toggleBookmark(project.name)} style={{ cursor: 'pointer' }} />
                      }
                      actions={
                        [
                        <EditOutlined key="edit" />,
                        <DeleteOutlined key="delete" />,
                      ]
                    }
                      onClick={() => router.push(`/project/${project.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ margin: 0 }}>Progress</p>
                        <p style={{ margin: 0 }}>{`${completedTasks}/${totalTasks} Tasks`}</p>
                      </div>
                      <Progress 
                        percent={progress} 
                        status={progress === 100 ? 'success' : 'active'} 
                        format={percent => (percent === 100 ? <CheckOutlined /> : `${percent}%`)}
                      />
                      <div style={{ marginTop: '12px' }}>
                        <Avatar.Group>
                          {memberNames.map((member, idx) => (
                            <Tooltip title={member} key={idx}>
                              {createAvatar(member, 40, idx === 0 ? '#f56a00' : idx === 1 ? '#7265e6' : '#ffbf00')}
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      </div>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </TabPane>
      </Tabs>
      <CreateProjectModal
        visible={visible}
        onCreate={onCreate}
        onCancel={() => setVisible(false)}
      />
    </Content>
  );
};

export default HomeLayout;
