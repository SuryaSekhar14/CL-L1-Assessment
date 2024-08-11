import { getProjectMembers } from './Project';
import { initialTasks } from '../data/TaskList';

export interface Task {
  id: number;
  title: string;
  description: string;
  group: number;
  assignedTo: string | undefined;
  isCompleted: boolean;
  status: string;
}

export const Task = {
  idCounter: 1,
};

let tasks: { [projectId: string]: Task[] } = {};

export function initializeProjectTasks(
  projectId: string, 
  contributorId?: string, 
  approverId?: string, 
  reviewerId?: string, 
  userId?: string
): Task[] {
  Task.idCounter = 1;

  // const members = getProjectMembers(projectId);
  // if (!members && parseInt(projectId, 10) < 7) {
  //   console.log('Project members not found');
  //   return [];
  // }

  const projectTasks = initialTasks.map(task => {
    let assignedTo: string | undefined = '';

    switch (task.persona) {
      case 'contributor':
        assignedTo = contributorId;
        break;
      case 'approver':
        assignedTo = approverId;
        break;
      case 'reviewer':
        assignedTo = reviewerId;
        break;
      case 'admin':
        assignedTo = userId;
        break;
    }

    return {
      ...task,
      id: Task.idCounter++, 
      assignedTo,
      isCompleted: false,
      status: task.group === 1 ? 'active' : 'pending', 
    };
  });

  tasks[projectId] = projectTasks; 
  return projectTasks;
}

export function getTasks(projectId: string = '1', status?: string): Task[] {
  const projectTasks = tasks[projectId] || [];

  if (projectId === '1' && projectTasks.length === 0) {
    return initialTasks.map(task => ({
      ...task,
      id: Task.idCounter++, 
      status: task.group === 1 ? 'active' : 'pending', 
      isCompleted: false,
      assignedTo: '',
    }));
  }

  if (!status) {
    return projectTasks;
  }

  return projectTasks.filter(task => task.status === status);
}

export function completeTask(projectId: string, taskId: number): boolean {
  const projectTasks = tasks[projectId];
  if (!projectTasks) return false;

  const taskIndex = projectTasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return false;

  const task = projectTasks[taskIndex];

  if (task.status !== 'active') {
    return false;
  }

  task.isCompleted = true;
  task.status = 'completed';

  const currentGroup = task.group;
  const allCurrentGroupTasksCompleted = projectTasks
    .filter(t => t.group === currentGroup)
    .every(t => t.isCompleted);

  if (allCurrentGroupTasksCompleted) {
    activateNextGroup(projectId, currentGroup + 1);
  }

  return true;
}

function activateNextGroup(projectId: string, nextGroup: number): void {
  const projectTasks = tasks[projectId];
  if (!projectTasks) return;

  projectTasks.forEach(task => {
    if (task.group === nextGroup) {
      task.status = 'active';
    }
  });
}

export function updateTaskTitle(projectId: string, taskId: number, newTitle: string): boolean {
  const projectTasks = tasks[projectId];
  if (!projectTasks) return false;

  const taskIndex = projectTasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return false;

  projectTasks[taskIndex].title = newTitle;
  return true;
}

export function deleteTasksForProject(projectId: string): void {
  delete tasks[projectId];
}
