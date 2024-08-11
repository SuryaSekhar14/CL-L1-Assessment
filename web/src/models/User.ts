import { users as initialUsers } from '@/data/UserList';

export interface ProjectAssignment {
  projectId: string;
  projectRole: string;
}

export interface User {
  id: string;
  role: string;
  name: string;
  email: string;
  pass: string;
  project: ProjectAssignment
}

let users: User[] = [];

export const User = {
  idCounter: Math.max(...initialUsers.map(user => parseInt(user.id, 10)), 0) + 1,
};

export function initializeUsers() {
  users = [...initialUsers];
}

export function getUsers(): User[] {
  if (users.length === 0) {
    initializeUsers();
  }
  return users;
}

export function addUser(id: string, role: 'admin' | 'staff' = 'staff', name: string = '', email: string = '', pass: string = ''): User {
  const newUser: User = {
    id,
    role,
    name,
    email,
    pass,
    project: { projectId: '', projectRole: '' },
  };
  users.push(newUser);
  return newUser;
}

export function getUserById(id: string): User | undefined {
  if (users.length === 0) {
    initializeUsers();
  }
  
  return users.find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

export function updateUserRole(userId: string, newRole: 'admin' | 'contributor' | 'reviewer' | 'approver', projectId: string): { message: string, user?: User } {
  const user = getUserById(userId);
  if (user) {
    user.project = { projectId, projectRole: newRole };
    return { message: 'Role updated', user };
  }
  return { message: 'User not found' };
}

export function isAdmin(userId: string): boolean {
  const user = getUserById(userId);
  return user?.role === 'admin' || false;
}
