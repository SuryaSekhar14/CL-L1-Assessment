import { createMocks } from "node-mocks-http";
import handler from "@/pages/api/tasks";
import { initializeProjectTasks, getTasks, Task } from "@/models/Tasks";
import { initializeUsers, getUsers } from "@/models/User";
import { Project, createProject, getProjects } from "@/models/Project";

beforeEach(() => {
    Project.idCounter =1;
    Task.idCounter=1;
    (getProjects() as any[]).length = 0;
    (getTasks() as any[]).length = 0;
    (getUsers() as any[]).length = 0;
    initializeUsers()
});

describe("Tasks API", () => {
  it("fetches active tasks", async () => {
    const project = createProject("Project", "1", "2", "3", "1");
    initializeProjectTasks(project.id);

    const { req, res } = createMocks({
      method: "GET",
      query: { status: "active" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data.tasks.every((task) => task.status === "active")).toBe(true);
    expect(data.tasks.length).toBe(2); // Ensure there are two active tasks
  });

 
    it("marks a task as complete if the user is the assigned user", async () => {
      const project = createProject("Project", "2", "3", "4", "1");
      initializeProjectTasks(project.id);

      let { req, res } = createMocks({
        method: "PUT",
        body: {
          taskId: 1,
          updates: { status: "completed" },
          userId: "1",
          projectId: project.id,
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      let data = res._getJSONData();
      expect(data.tasks.find((task) => task.id === 1).status).toBe("completed");

      ({ req, res } = createMocks({
        method: "PUT",
        body: {
          taskId: 2,
          updates: { status: "completed" },
          userId: "2",
          projectId: project.id,
        },
      }));

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      data = res._getJSONData();
      expect(data.tasks.find((task) => task.id === 2).status).toBe("completed");

      // Verify that tasks in the next group are activated
      expect(
        data.tasks.find((task) => task.group === 2 && task.status === "active")
      ).toBeTruthy();
    });
  

  it("fails to mark a task as complete if the user is not the assigned user", async () => {
    const project = createProject("Project", "2", "3", "4", "1");
    initializeProjectTasks(project.id);

    const { req, res } = createMocks({
      method: "PUT",
      body: {
        taskId: 1,
        updates: { status: "completed" },
        userId: "reviewer1",
        projectId: project.id,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    const data = res._getJSONData();
    expect(data.message).toBe(
      "Forbidden: Only assigned user can mark the task as complete"
    );
  });

  it("updates a task if the user is an approver", async () => {
    const project = createProject("Project", "2", "3", "4", "1");
    initializeProjectTasks(project.id);

    const { req, res } = createMocks({
      method: "PUT",
      body: {
        taskId: 1,
        updates: { title: "Updated Title" },
        userId: "3",
        projectId: project.id,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data.tasks.find((task) => task.id === 1).title).toBe(
      "Updated Title"
    );
  });

  it("fails to update a task if the user is not an approver", async () => {
    const project = createProject("Project", "2", "3", "4", "1");
    initializeProjectTasks(project.id);

    const { req, res } = createMocks({
      method: "PUT",
      body: {
        taskId: 1,
        updates: { title: "Updated Title" },
        userId: "2",
        projectId: project.id,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    const data = res._getJSONData();
    expect(data.message).toBe("Forbidden: Only approvers can update tasks");
  });

  it("activates group 2 only if all tasks in group 1 are completed", async () => {
    const project = createProject("Project", "2", "3", "4", "1");
    initializeProjectTasks(project.id);

    let { req, res } = createMocks({
      method: "PUT",
      body: { taskId: 1, updates: { status: "completed" }, userId: "1", projectId: project.id, },
    });
    await handler(req, res);

    ({ req, res } = createMocks({
      method: "PUT",
      body: {
        taskId: 2,
        updates: { status: "completed" },
        userId: "2",
        projectId: project.id,
      },
    }));

    await handler(req, res);

    const data = res._getJSONData();
    expect(
      data.tasks.find((task) => task.group === 2 && task.status === "active")
    ).toBeTruthy();
  });

  it("does not activate group 3 if group 2 is not completed", async () => {
    const project = createProject("Project", "2", "3", "4", "1");
    initializeProjectTasks(project.id);

    // Complete all tasks in group 1
    let { req, res } = createMocks({
      method: "PUT",
      body: { taskId: 1, updates: { status: "completed" }, userId: "admin", projectId: project.id, },
    });
    await handler(req, res);
    req = createMocks({
      method: "PUT",
      body: {
        taskId: 2,
        updates: { status: "completed" },
        userId: "2",
        projectId: project.id,
      },
    }).req;
    res = createMocks().res;
    await handler(req, res);

    // Verify that group 3 tasks are not activated
    const data = res._getJSONData();
    expect(
      data.tasks.find((task) => task.group === 3 && task.status === "active")
    ).toBeFalsy();
  });

  it("deletes a task if the user is an approver", async () => {
    const project = createProject("Project", "2", "3", "4", "1");
    initializeProjectTasks(project.id);

    const { req, res } = createMocks({
      method: "DELETE",
      body: { taskId: 1, userId: "3", projectId: project.id },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data.message).toBe("Task deleted");
  });

  it("fails to delete a task if the user is not an approver", async () => {
    const project = createProject("Project", "2", "3", "4", "1");
    initializeProjectTasks(project.id);

    const { req, res } = createMocks({
      method: "DELETE",
      body: { taskId: 1, userId: "2", projectId: project.id },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    const data = res._getJSONData();
    expect(data.message).toBe("Forbidden: Only approvers can delete tasks");
  });
});
