import { useSession } from 'next-auth/react';
import { users } from '@/data/UserList';

export const useUserSession = () => {
  const { data: session, status } = useSession();

  const u = session?.user;
  
  const user = users.find(user => user.email === u?.email);
  const isLoading = status === 'loading';

  return { user, isLoading };
};