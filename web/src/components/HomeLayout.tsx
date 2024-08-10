import React, { useState } from 'react';
import { Layout, Row, Col, Card, Tabs, Input, Button, Progress, Avatar, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined, BookFilled } from '@ant-design/icons';
import CreateProjectModal from './CreateProjectModal';
import { createAvatar } from '@/components/helper/createAvatar';
import { useUserSession } from '@/hooks/useUserSession';

const { Content } = Layout;
const { TabPane } = Tabs;

const HomeLayout: React.FC<{ role: string }> = ({ role }) => {
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const user = {
    name: 'Lucian Grey',
    email: 'luciangrey02@gmail.com',
    avatarUrl: 'https://joeschmoe.io/api/v1/random',
  };

  const onCreate = (values: any) => {
    console.log('Received values from the form: ', values);
    setVisible(false);
  };

  const projects = [
    { name: 'Web Development', progress: 20, tasksCompleted: 2, totalTasks: 10, members: ['K', 'R', 'U'] },
    { name: 'UI/UX Course', progress: 50, tasksCompleted: 5, totalTasks: 10, members: ['K', 'R', 'U'] },
    { name: 'AI and Machine Learning', progress: 100, tasksCompleted: 10, totalTasks: 10, members: ['K', 'R', 'U'] },
    { name: 'DevOps', progress: 20, tasksCompleted: 2, totalTasks: 10, members: ['K', 'R', 'U'] },
    { name: 'System Design', progress: 50, tasksCompleted: 5, totalTasks: 10, members: ['K', 'R', 'U'] },
    { name: 'Front-End Development', progress: 100, tasksCompleted: 10, totalTasks: 10, members: ['K', 'R', 'U'] },
  ];

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
            {filteredProjects.map((project, index) => (
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
                >
                  <p>Progress</p>
                  <Progress percent={project.progress} status={project.progress === 100 ? 'success' : 'active'} />
                  <p>{`${project.tasksCompleted}/${project.totalTasks} Tasks`}</p>
                  <div style={{ marginTop: '12px' }}>
                    <Avatar.Group>
                      {project.members.map((member, idx) => (
                        <Tooltip title={`Member ${idx + 1}`} key={idx}>
                          <Avatar style={{ backgroundColor: idx === 0 ? '#f56a00' : idx === 1 ? '#7265e6' : '#ffbf00', marginRight: '8px' }}>
                            {member}
                          </Avatar>
                        </Tooltip>
                      ))}
                    </Avatar.Group>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>
        <TabPane tab="Assigned to Me" key="2">
          {/* Add content for Assigned to Me */}
        </TabPane>
        <TabPane tab="Bookmarked" key="3">
          <Row gutter={[16, 16]}>
            {filteredProjects
              .filter(project => bookmarked.includes(project.name))
              .map((project, index) => (
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
                  >
                    <p>Progress</p>
                    <Progress percent={project.progress} status={project.progress === 100 ? 'success' : 'active'} />
                    <p>{`${project.tasksCompleted}/${project.totalTasks} Tasks`}</p>
                    <div style={{ marginTop: '12px' }}>
                      <Avatar.Group>
                        {project.members.map((member, idx) => (
                          <Tooltip title={`Member ${idx + 1}`} key={idx}>
                            <Avatar style={{ backgroundColor: idx === 0 ? '#f56a00' : idx === 1 ? '#7265e6' : '#ffbf00', marginRight: '8px' }}>
                              {member}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </Avatar.Group>
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </TabPane>
      </Tabs>
      <CreateProjectModal
        visible={visible}
        onCreate={onCreate}
        onCancel={() => setVisible(false)}
        user={user}
      />
    </Content>
  );
};

export default HomeLayout;
