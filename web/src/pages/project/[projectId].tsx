import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProjectNameById } from '@/models/Project';
import TasksList from '@/components/TasksList';

const ProjectTasksPage = () => {
  const { query } = useRouter();
  const projectId = query.projectId as string;
  const [projectName, setProjectName] = useState<string | null>(null);

  useEffect(() => {
    if (projectId && typeof projectId === 'string') {
      const name = getProjectNameById(projectId);
      setProjectName(name);
    }
  }, [projectId]);

  if (!projectId) {
    return <div>Project ID not found... {projectId} {projectName}</div>;
  }

  return (
    <div>
      <TasksList projectId={projectId} projectName={projectName as string} />
    </div>
  );
};

export default ProjectTasksPage;
