import React from 'react';
import { Layout } from 'antd';
import Navbar from '@/components/Navbar';
import HomeLayout from '@/components/HomeLayout';
import { useSession } from 'next-auth/react';
import { useUserSession } from '@/hooks/useUserSession';
import { User } from '@/models/User';

const HomePage = () => {
  // const user = {
  //   name: 'Lucian Grey',
  //   email: 'lucian@gmail.com',
  //   role: 'Admin',
  //   avatarUrl: 'https://joeschmoe.io/api/v1/random',
  // };
  
  const notificationsCount = 9;

  const { user: loggedInUser, isLoading } = useUserSession();
  // console.log(loggedInUser?.role, isLoading);
  const userRole = loggedInUser?.role;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar user={loggedInUser as unknown as Partial<User>} notificationsCount={notificationsCount} />
      <HomeLayout role={userRole as string}/>
    </Layout>
  );
};

export default HomePage;
