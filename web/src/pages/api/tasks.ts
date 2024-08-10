// src/pages/api/tasks.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getTasks, getTasksForProject } from '@/models/Tasks';
import { getUserById } from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      let { status, projectId } = req.query;

      // Default to projectId "1" if not provided
      if (!projectId || typeof projectId !== 'string') {
        projectId = '1';
      }

      const tasks = getTasksForProject(projectId);

      if (status && typeof status === 'string') {
        const filteredTasks = tasks.filter(task => task.status === status);
        res.status(200).json({ message: 'Tasks fetched', tasks: filteredTasks });
      } else {
        res.status(200).json({ message: 'Tasks fetched', tasks });
      }
      break;
    }

    case 'PUT': {
      const { userId, taskId, updates, projectId } = req.body;

      if (!userId || !taskId || !projectId || !updates) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }

      const user = getUserById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const projectRole = user.project.projectRole;
      if (user.project.projectId !== projectId) {
        res.status(403).json({ message: 'Forbidden: User is not assigned to this project' });
        return;
      }

      const projectTasks = getTasksForProject(projectId);
      const task = projectTasks.find(t => t.id === taskId);
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      // Check if the user is allowed to update the task
      if (projectRole !== 'approver') {
        res.status(403).json({ message: 'Forbidden: Only approvers can update tasks' });
        return;
      }

      Object.assign(task, updates);
      res.status(200).json({ message: 'Task updated', tasks: getTasksForProject(projectId) });
      break;
    }

    case 'DELETE': {
      const { userId, taskId, projectId } = req.body;

      if (!userId || !taskId || !projectId) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }

      const user = getUserById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const projectRole = user.project.projectRole;
      if (user.project.projectId !== projectId) {
        res.status(403).json({ message: 'Forbidden: User is not assigned to this project' });
        return;
      }

      // Check if the user is allowed to delete the task
      if (projectRole !== 'approver') {
        res.status(403).json({ message: 'Forbidden: Only approvers can delete tasks' });
        return;
      }

      const projectTasks = getTasksForProject(projectId);
      const taskIndex = projectTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      projectTasks.splice(taskIndex, 1);
      res.status(200).json({ message: 'Task deleted', tasks: projectTasks });
      break;
    }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
