import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, addUser, updateUserRole } from '@/models/User';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      try {
        const users = getUsers();
        res.status(200).json({ message: 'Users fetched', users });
      } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
      }
      break;

    case 'POST':
      try {
        const { id, role = 'staff', name = '', email = '', pass = '' } = req.body;
        if (!id) { 
          res.status(400).json({ message: 'Missing id' });
          return;
        }
        const user = addUser(id, role, name, email, pass);
        res.status(201).json({ message: 'User added', user });
      } catch (error) {
        res.status(500).json({ message: 'Error adding user', error });
      }
      break;

    case 'PUT':
      try {
        const { userId, newRole, projectId } = req.body;
        if (!userId || !newRole || !projectId) {
          res.status(400).json({ message: 'Missing userId, newRole, or projectId' });
          return;
        }
        const updatedUser = updateUserRole(userId, newRole, projectId);
        if (!updatedUser.user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }
        res.status(200).json({ message: 'Role updated', user: updatedUser.user });
      } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
};

export default handler;
