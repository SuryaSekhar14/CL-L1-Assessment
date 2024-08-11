import React from 'react';
import { Layout, Menu, Dropdown, Avatar, Breadcrumb, Badge, message } from 'antd';
import { HomeOutlined, BellOutlined, LogoutOutlined } from '@ant-design/icons';
import { User } from '@/models/User';
import { createAvatar } from '@/components/helper/createAvatar';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const { Header } = Layout;

interface NavbarProps {
  user: Partial<User>;
  notificationsCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ user, notificationsCount }) => {
  const router = useRouter();

  const menu = (
    <Menu>
      <Menu.Item key="0">
        {user?.email} <br /> ({user?.role})
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="1"
        icon={<LogoutOutlined />}
        onClick={() => signOut({ callbackUrl: '/login' })}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  const avatar = createAvatar(user?.name as string, 32);

  const breadcrumbItems = [
    <Breadcrumb.Item href="/" key="home">
      <HomeOutlined />
    </Breadcrumb.Item>,
    <Breadcrumb.Item key="projects">
      Projects
    </Breadcrumb.Item>,
  ];

  if (router.pathname.startsWith('/project/')) {
    breadcrumbItems.push(
      <Breadcrumb.Item key="tasks">
        Tasks
      </Breadcrumb.Item>
    );
  }

  return (
    <Header className="header" style={{ background: '#fff', padding: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Breadcrumb>
            {breadcrumbItems}
          </Breadcrumb>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge count={notificationsCount} offset={[-30, 0]}>
            <BellOutlined 
              style={{ fontSize: '20px', cursor: 'pointer', marginRight: '32px' }} 
              onClick={() => message.info("Meow")}
            />
          </Badge>
          <Dropdown overlay={menu} trigger={['click']}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              {avatar}
              <span style={{ marginLeft: '8px' }}>{user?.name}</span>
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
