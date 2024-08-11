import { projects as initialProjects } from '@/data/projectList';
import { getUserById, isAdmin, updateUserRole } from './User';
import { Task, initializeProjectTasks, getTasks, deleteTasksForProject } from './Tasks';

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

let projects: Project[] = [];

export const Project = {
  idCounter: 1,
};

export function getProjects(): Project[] {
  if (projects.length === 0) {
    initializeProjects();
  }
  return projects;
}

export function createProject(
  name: string,
  contributorId: string,
  approverId: string,
  reviewerId: string,
  userId: string,
): Project {
  // if (!isAdmin(userId)) {
  //   console.log(isAdmin(userId));
  //   return null;
  // }

  const projectTasks: Task[] = initializeProjectTasks(Project.idCounter.toString());
  // console.log(projectTasks);

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

  updateUserRole(contributorId, 'contributor', newProject.id);
  updateUserRole(approverId, 'approver', newProject.id);
  updateUserRole(reviewerId, 'reviewer', newProject.id);
  updateUserRole(userId, 'admin', newProject.id);

  return newProject;
}

export function getProjectMembers(projectId: string) {
  const sourceProjects = projects.length > 0 ? projects : initialProjects;

  const project = sourceProjects.find(p => p.id === projectId);
  return project ? project.members : null;
}

export function getProjectNameById(projectId: string): string | null {
  const sourceProjects = projects.length > 0 ? projects : initialProjects;

  const project = sourceProjects.find(p => p.id === projectId);
  return project ? project.name : null;
}

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

export function initializeProjects() {
  projects = initialProjects.map(project => {
    const projectTasks: Task[] = initializeProjectTasks(project.id);

    return {
      ...project,
      tasks: projectTasks,
    };
  });

  Project.idCounter = projects.length + 1;
}
