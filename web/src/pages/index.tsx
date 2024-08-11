import React from 'react';
import { Layout } from 'antd';
import Navbar from '@/components/Navbar';
import HomeLayout from '@/components/HomeLayout';
import { useUserSession } from '@/hooks/useUserSession';
import { User } from '@/models/User';

const HomePage = () => {
  // const user = {
  //   name: 'Surya Sekhar Datta',
  //   email: 'surya@gmail.com',
  //   role: 'Admin',
  //   avatarUrl: 'https://suryasekhardatta.com',
  // };
  
  const notificationsCount = 9;

  const { user: loggedInUser } = useUserSession();
  const userRole = loggedInUser?.role;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar user={loggedInUser as unknown as Partial<User>} notificationsCount={notificationsCount} />
      <HomeLayout role={userRole as string} user={loggedInUser as User}/>
    </Layout>
  );
};

export default HomePage;
