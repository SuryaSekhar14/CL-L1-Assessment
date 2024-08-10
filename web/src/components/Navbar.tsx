import React from 'react';
import { Layout, Menu, Dropdown, Avatar, Breadcrumb, Badge } from 'antd';
import { HomeOutlined, BellOutlined, LogoutOutlined } from '@ant-design/icons';
import { User } from '@/models/User';
import { createAvatar } from '@/components/helper/createAvatar';
import { signOut } from 'next-auth/react';

const { Header } = Layout;

interface NavbarProps {
  user: Partial<User>;
  notificationsCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ user, notificationsCount }) => {
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

  return (
    <Header className="header" style={{ background: '#fff', padding: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Breadcrumb>
            <Breadcrumb.Item href="">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Projects</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge count={notificationsCount} offset={[-30, 0]}>
            <BellOutlined style={{ fontSize: '20px', cursor: 'pointer', marginRight: '32px' }} />
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
