import type { NextApiRequest, NextApiResponse } from 'next';
import { getTasks, completeTask, updateTaskTitle } from '@/models/Tasks';
import { getUserById } from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      let { status, projectId } = req.query;

      if (!projectId || typeof projectId !== 'string') {
        projectId = '1';
      }

      const tasks = getTasks(projectId);

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
      if (user?.role !== 'admin' && user?.project?.projectId !== projectId) {
        res.status(403).json({ message: 'Forbidden: Only assigned user can mark the task as complete' });
        return;
      }

      const projectTasks = getTasks(projectId);
      const task = projectTasks.find(t => t.id === taskId);
      if (!task) {
        res.status(404).json({ message: 'Task not Found' });
        return;
      }

      if (updates.status === 'completed') {
        const success = completeTask(projectId, taskId);
        if (!success) {
          res.status(400).json({ message: 'Failed to mark task as completed' });
          return;
        }
      } else if (updates.title) {
        const ableTo = user?.project.projectRole === 'approver' || user?.role === 'admin';

        if (!ableTo) {
          res.status(403).json({ message: 'Forbidden: Only approvers can update tasks' });
          return;
        }

        const success = updateTaskTitle(projectId, taskId, updates.title);
        if (!success) {
          res.status(400).json({ message: 'Failed to update task title' });
          return;
        }
      } else {
        if (user?.project.projectRole !== 'approver' && user?.project.projectRole !== 'admin' && user?.role !== 'admin') {
          res.status(403).json({ message: 'Forbidden: Only assigned user can mark the task as complete' });
          return;
        }
        Object.assign(task, updates);
      }

      res.status(200).json({ message: 'Task updated', tasks: getTasks(projectId) });
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
    
      if (user.role !== 'admin' && user.project?.projectId !== projectId) {
        res.status(403).json({ message: 'Forbidden: User is not assigned to this project' });
        return;
      }

      if (user.project.projectRole !== 'approver' && user.role !== 'admin') {
        res.status(403).json({ message: 'Forbidden: Only approvers can delete tasks' });
        return;
      }
    
      const projectTasks = getTasks(projectId);
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
