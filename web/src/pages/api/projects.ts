import type { NextApiRequest, NextApiResponse } from 'next';
import { getProjects, createProject, deleteProject, initializeProjects } from '@/models/Project';
import { initializeProjectTasks } from '@/models/Tasks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      res.status(200).json({ message: 'Projects fetched', projects: getProjects() });
      break;

    case 'POST': {
      const { name, contributorId, approverId, reviewerId, userId } = req.body;
        const newProject = createProject(name, userId, contributorId, approverId, reviewerId);
      if (newProject) {
        initializeProjectTasks(newProject.id);
        res.status(201).json({ message: 'Project created', project: newProject });
      } else {
        res.status(403).json({ message: 'Forbidden: Only admins can manage projects' });
      }
      break;
    }

    case 'DELETE': {
      const { projectId, userId } = req.body;
    //   res.status(200).json({ projectId, userId});
      const deleted = deleteProject(projectId, userId);
      if (deleted) {
        res.status(200).json({ message: 'Project deleted' });
      } else {
        res.status(403).json({ message: 'Forbidden: Only admins can manage projects' });
      }
      break;
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
