// pages/projects/[projectId].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProjectNameById } from '@/models/Project';
import TasksList from '@/components/TasksList';

const ProjectTasksPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const [projectName, setProjectName] = useState<string | null>(null);

  useEffect(() => {
    if (projectId && typeof projectId === 'string') {
      const name = getProjectNameById(projectId);
      setProjectName(name);
    }
  }, [projectId]);

  if (!projectId || !projectName) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div>
      <h1>{projectName}</h1>
      <TasksList projectId={projectId as string} />
    </div>
  );
};

export default ProjectTasksPage;
