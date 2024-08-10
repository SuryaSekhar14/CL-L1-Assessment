import { getProjectMembers } from './Project';
import { initialTasks } from '../data/TaskList';

// Define the Task interface
export interface Task {
  id: number;
  title: string;
  description: string;
  group: number;
  assignedTo: string;
  isCompleted: boolean;
  status: string;
}

// Task ID counter for generating unique IDs
export const Task = {
  idCounter: 1,
};

// In-memory task storage (associated with projects)
let tasks: { [projectId: string]: Task[] } = {};

// Initialize tasks for a specific project
export function initializeProjectTasks(projectId: string): Task[] {
  // Reset the task ID counter
  Task.idCounter = 1;

  const members = getProjectMembers(projectId);
  if (!members) {
    return [];
  }

  const projectTasks = initialTasks.map(task => {
    let assignedTo = '';

    // Assign the correct user based on the task persona
    switch (task.persona) {
      case 'contributor':
        assignedTo = members.contributor;
        break;
      case 'approver':
        assignedTo = members.approver;
        break;
      case 'reviewer':
        assignedTo = members.reviewer;
        break;
      case 'admin':
        assignedTo = members.admin;
        break;
    }

    return {
      ...task,
      id: Task.idCounter++, // Assign unique ID
      assignedTo,
      isCompleted: false,
      status: task.group === 1 ? 'active' : 'pending', // Group 1 tasks are 'active', others are 'pending'
    };
  });

  tasks[projectId] = projectTasks; // Store tasks associated with the project
  return projectTasks;
}

// Get tasks for a specific project, optionally filtered by status
export function getTasks(projectId: string = '1', status?: string): Task[] {
  // If projectId is not provided, default to '1'
  const projectTasks = tasks[projectId] || [];

  // If projectTasks is empty and projectId is '1', return the initial tasks
  if (projectId === '1' && projectTasks.length === 0) {
    return initialTasks.map(task => ({
      ...task,
      id: Task.idCounter++, // Ensure unique ID assignment
      status: task.group === 1 ? 'active' : 'pending', // Default to active for group 1, pending for others
      isCompleted: false,
      assignedTo: '', // Default to no assignment
    }));
  }

  // If no status is provided, return all tasks
  if (!status) {
    return projectTasks;
  }

  // Otherwise, filter tasks by the provided status
  return projectTasks.filter(task => task.status === status);
}

// Mark a task as completed
export function completeTask(projectId: string, taskId: number): boolean {
  const projectTasks = tasks[projectId];
  if (!projectTasks) return false;

  const taskIndex = projectTasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return false;

  const task = projectTasks[taskIndex];

  if (task.status !== 'active') {
    return false; // Task can only be completed if it is active
  }

  task.isCompleted = true;
  task.status = 'completed';

  // Check if all tasks in the current group are completed
  const currentGroup = task.group;
  const allCurrentGroupTasksCompleted = projectTasks
    .filter(t => t.group === currentGroup)
    .every(t => t.isCompleted);

  // If all tasks in the current group are completed, activate the next group
  if (allCurrentGroupTasksCompleted) {
    activateNextGroup(projectId, currentGroup + 1);
  }

  return true;
}

// Activate the next group of tasks if all current tasks are completed
function activateNextGroup(projectId: string, nextGroup: number): void {
  const projectTasks = tasks[projectId];
  if (!projectTasks) return;

  projectTasks.forEach(task => {
    if (task.group === nextGroup) {
      task.status = 'active';
    }
  });
}

// Update a task's title
export function updateTaskTitle(projectId: string, taskId: number, newTitle: string): boolean {
  const projectTasks = tasks[projectId];
  if (!projectTasks) return false;

  const taskIndex = projectTasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return false;

  projectTasks[taskIndex].title = newTitle;
  return true;
}

// Delete tasks for a specific project
export function deleteTasksForProject(projectId: string): void {
  delete tasks[projectId];
}
