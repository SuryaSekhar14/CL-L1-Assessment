// export const users = [
//   { id: "1", role: "admin" },
//   { id: "2", role: "staff" },
//   { id: "3", role: "staff" },
//   { id: "4", role: "staff" },
//   // Add more users as needed
// ];

export const users = [
  { id: "1", 
    role: "admin",
    name: "User1",
    email: "user1@example.com",
    pass: "111",
    project: [
      {
          projectId: "123",
          projectRole: "admin"
      },
      {
          projectId: "456",
          projectRole: "admin"
      }
    ]
  },
  {
    id: "2", 
    role: "staff",
    name: "User2",
    email: "user2@example.com",
    pass: "222",
    project: [
      {
          projectId: "456",
          projectRole: "contributor"
      }
    ]
  },
  {
    id: "3", 
    role: "staff",
    name: "User3",
    email: "user3@example.com",
    pass: "333",
    project: [
      {
          projectId: "123",
          projectRole: "contributor"
      },
      {
          projectId: "789",
          projectRole: "contributor"
      }
    ]
  },
  {
    id: "4", 
    role: "staff",
    name: "User4",
    email: "user4@example.com",
    pass: "444",
    project: [
      {
        projectId: "789",
          projectRole: "reviewer"
      }
    ]
  },
];