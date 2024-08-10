// src/models/Project.ts

import { projects as initialProjects } from '@/data/projectList';
import { getUserById, isAdmin, updateUserRole } from './User';
import { Task, initializeProjectTasks, getTasks, deleteTasksForProject } from './Tasks';

// Define the Project interface
export interface Project {
  id: string;
  name: string;
  members: {
    contributor: string;
    approver: string;
    reviewer: string;
    admin: string;
  };
  tasks: Task[]; 
}

// In-memory project storage
let projects: Project[] = [];

// Project ID counter for generating unique IDs
export const Project = {
  idCounter: 1,
};

// Get all projects, initialize if projects array is empty
export function getProjects(): Project[] {
  if (projects.length === 0) {
    initializeProjects();
  }
  return projects;
}

// Create a new project
export function createProject(
  name: string,
  contributorId: string,
  approverId: string,
  reviewerId: string,
  userId: string,
): Project | null {
  // Use isAdmin to check if the user is an admin
  if (!isAdmin(userId)) {
    console.log(isAdmin(userId));
    return null; // Return null if the user is not an admin
  }

  const projectTasks: Task[] = initializeProjectTasks(Project.idCounter.toString());

  const newProject: Project = {
    id: Project.idCounter.toString(),
    name,
    members: {
      contributor: contributorId,
      approver: approverId,
      reviewer: reviewerId,
      admin: userId,
    },
    tasks: projectTasks,
  };

  projects.push(newProject);
  Project.idCounter += 1;

  // Update users with the new project assignment
  updateUserRole(contributorId, 'contributor', newProject.id);
  updateUserRole(approverId, 'approver', newProject.id);
  updateUserRole(reviewerId, 'reviewer', newProject.id);
  updateUserRole(userId, 'admin', newProject.id);

  return newProject;
}

// Get project members by project ID
export function getProjectMembers(projectId: string) {
  // Use projects array if initialized; otherwise, fallback to initialProjects
  const sourceProjects = projects.length > 0 ? projects : initialProjects;

  const project = sourceProjects.find(p => p.id === projectId);
  return project ? project.members : null;
}

// Get project name by project ID
export function getProjectNameById(projectId: string): string | null {
  // Use projects array if initialized; otherwise, fallback to initialProjects
  const sourceProjects = projects.length > 0 ? projects : initialProjects;

  const project = sourceProjects.find(p => p.id === projectId);
  return project ? project.name : null;
}

// Delete a project by ID
export function deleteProject(projectId: string, adminId: string): boolean {
  const adminUser = getUserById(adminId);
  if (!adminUser || adminUser.role !== 'admin') {
    return false;
  }

  const projectIndex = projects.findIndex(p => p.id === projectId);
  if (projectIndex === -1) {
    return false;
  }

  deleteTasksForProject(projectId);
  projects.splice(projectIndex, 1);
  return true;
}

// Initialize projects with predefined data
export function initializeProjects() {
  projects = initialProjects.map(project => {
    // Initialize tasks for this project using its ID
    const projectTasks: Task[] = initializeProjectTasks(project.id);

    return {
      ...project,
      tasks: projectTasks, // Ensure tasks are assigned to the project
    };
  });

  Project.idCounter = projects.length + 1; // Adjust the counter to avoid ID collisions
}
