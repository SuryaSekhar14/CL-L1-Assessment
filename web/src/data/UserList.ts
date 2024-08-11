export const users = [
  { id: "1", 
    role: "admin",
    name: "Administrator",
    email: "user1@example.com",
    pass: "111",
    project: {
          projectId: "1",
          projectRole: "admin"
      }
  },
  {
    id: "2", 
    role: "staff",
    name: "Surya Sekhar Datta",
    email: "user2@example.com",
    pass: "222",
    project: {
          projectId: "1",
          projectRole: "contributor"
      }
  },
  {
    id: "3", 
    role: "staff",
    name: "Kartik Dey",
    email: "user3@example.com",
    pass: "333",
    project: {
          projectId: "1",
          projectRole: "approver"
      }
  },
  {
    id: "4", 
    role: "staff",
    name: "Andy Robson",
    email: "user4@example.com",
    pass: "444",
    project: {
        projectId: "1",
          projectRole: "reviewer"
      }
  },
];