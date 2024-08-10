import { users as initialUsers } from '@/data/UserList';

// Define the types
export interface ProjectAssignment {
  projectId: string;
  projectRole: 'admin' | 'contributor' | 'reviewer' | 'approver';
}

export interface User {
  id: string;
  role: 'admin' | 'staff';
  name: string;
  email: string;
  pass: string;
  project: ProjectAssignment; // Single object representing the project assignment
}

// In-memory user storage, initially empty
let users: User[] = [];

// User counter for new IDs
export const User = {
  idCounter: Math.max(...initialUsers.map(user => parseInt(user.id, 10)), 0) + 1
};

// Initialize users with predefined data
export function initializeUsers() {
  users = [...initialUsers];
}

// Get all users, initialize if users array is empty
export function getUsers(): User[] {
  if (users.length === 0) {
    initializeUsers();
  }
  return users;
}

// Add a new user
export function addUser(id: string, role: 'admin' | 'staff' = 'staff', name: string = '', email: string = '', pass: string = ''): User {
  const newUser: User = {
    id,
    role,
    name,
    email,
    pass,
    project: { projectId: '', projectRole: 'admin' }
  };
  users.push(newUser);
  return newUser;
}

// Get user by ID
export function getUserById(id: string): User | undefined {
  if (users.length === 0) {
    initializeUsers();
  }
  
  return users.find(u => u.id === id);
}

// Get user by email (for authentication)
export function getUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

// Update user role for a specific project
export function updateUserRole(userId: string, newRole: 'admin' | 'contributor' | 'reviewer' | 'approver', projectId: string): { message: string, user?: User } {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.project = { projectId, projectRole: newRole };
    return { message: 'Role updated', user };
  }
  return { message: 'User not found' };
}

// Check if a user is an admin
export function isAdmin(userId: string): boolean {
  const user = getUserById(userId);
  return user?.role === 'admin' || false;
}
