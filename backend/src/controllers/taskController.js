// const { tasks, users } = require("../data/store");
// const {
//   areDependenciesComplete,
//   isTaskBlocked,
// } = require("../utils/taskUtils");

// const priorities = ["Low", "Medium", "High"];
// const statuses = ["To Do", "In Progress", "Done"];

// // Create task
// const createTask = (req, res) => {
//   const {
//     title,
//     description,
//     priority,
//     status,
//     assignedUserId,
//     dependencies,
//   } = req.body;

//   if (!title) {
//     return res.status(400).json({
//       message: "Task title is required",
//     });
//   }

//   if (!priorities.includes(priority)) {
//     return res.status(400).json({
//       message: "Invalid priority",
//     });
//   }

//   if (!statuses.includes(status)) {
//     return res.status(400).json({
//       message: "Invalid status",
//     });
//   }

//   if (assignedUserId && !users.has(assignedUserId)) {
//     return res.status(400).json({
//       message: "Assigned user not found",
//     });
//   }

//   const taskDependencies = dependencies || [];

//   for (const dependencyId of taskDependencies) {
//     if (!tasks.has(dependencyId)) {
//       return res.status(400).json({
//         message: "One or more dependency tasks do not exist",
//       });
//     }
//   }

//   const id = Date.now().toString();

//   const task = {
//     id,
//     title,
//     description: description || "",
//     priority,
//     status,
//     assignedUserId: assignedUserId || null,
//     dependencies: taskDependencies,
//     createdAt: new Date().toISOString(),
//   };

//   if (status === "Done" && !areDependenciesComplete(task)) {
//     return res.status(400).json({
//       message: "Task cannot be completed because dependencies are not complete",
//     });
//   }

//   tasks.set(id, task);

//   res.status(201).json({
//     message: "Task created successfully",
//     task,
//   });
// };


// // Get all tasks
// const getAllTasks = (req, res) => {
//   const allTasks = [...tasks.values()];

//   res.json({
//     tasks: allTasks,
//   });
// };


// // Get tasks for a user
// const getUserTasks = (req, res) => {
//   const { userId } = req.params;

//   const userTasks = [...tasks.values()].filter(
//     (task) => task.assignedUserId === userId
//   );

//   res.json({
//     tasks: userTasks,
//   });
// };


// // Get blocked tasks
// const getBlockedTasks = (req, res) => {
//   const blockedTasks = [...tasks.values()].filter((task) =>
//     isTaskBlocked(task)
//   );

//   res.json({
//     tasks: blockedTasks,
//   });
// };


// // Update task
// const updateTask = (req, res) => {
//   const { id } = req.params;

//   const task = tasks.get(id);

//   if (!task) {
//     return res.status(404).json({
//       message: "Task not found",
//     });
//   }

//   const {
//     title,
//     description,
//     priority,
//     status,
//     assignedUserId,
//     dependencies,
//   } = req.body;

//   if (priority && !priorities.includes(priority)) {
//     return res.status(400).json({
//       message: "Invalid priority",
//     });
//   }

//   if (status && !statuses.includes(status)) {
//     return res.status(400).json({
//       message: "Invalid status",
//     });
//   }

//   if (assignedUserId && !users.has(assignedUserId)) {
//     return res.status(400).json({
//       message: "Assigned user not found",
//     });
//   }

//   const newDependencies =
//     dependencies !== undefined ? dependencies : task.dependencies;

//   for (const dependencyId of newDependencies) {
//     if (dependencyId === id) {
//       return res.status(400).json({
//         message: "A task cannot depend on itself",
//       });
//     }

//     if (!tasks.has(dependencyId)) {
//       return res.status(400).json({
//         message: "One or more dependency tasks do not exist",
//       });
//     }
//   }

//   const updatedTask = {
//     ...task,
//     title: title !== undefined ? title : task.title,
//     description:
//       description !== undefined ? description : task.description,
//     priority: priority || task.priority,
//     status: status || task.status,
//     assignedUserId:
//       assignedUserId !== undefined
//         ? assignedUserId
//         : task.assignedUserId,
//     dependencies: newDependencies,
//   };

//   if (
//     updatedTask.status === "Done" &&
//     !areDependenciesComplete(updatedTask)
//   ) {
//     return res.status(400).json({
//       message: "Task cannot be completed because dependencies are not complete",
//     });
//   }

//   tasks.set(id, updatedTask);

//   res.json({
//     message: "Task updated successfully",
//     task: updatedTask,
//   });
// };


// // Delete task
// const deleteTask = (req, res) => {
//   const { id } = req.params;

//   if (!tasks.has(id)) {
//     return res.status(404).json({
//       message: "Task not found",
//     });
//   }

//   tasks.delete(id);

//   res.json({
//     message: "Task deleted successfully",
//   });
// };


// // Complete task
// const completeTask = (req, res) => {
//   const { id } = req.params;

//   const task = tasks.get(id);

//   if (!task) {
//     return res.status(404).json({
//       message: "Task not found",
//     });
//   }

//   if (!areDependenciesComplete(task)) {
//     return res.status(400).json({
//       message: "Task cannot be completed because dependencies are not complete",
//     });
//   }

//   task.status = "Done";

//   tasks.set(id, task);

//   res.json({
//     message: "Task completed successfully",
//     task,
//   });
// };


// module.exports = {
//   createTask,
//   getAllTasks,
//   getUserTasks,
//   getBlockedTasks,
//   updateTask,
//   deleteTask,
//   completeTask,
// };


const { tasks, users } = require("../data/store");
const {
  areDependenciesComplete,
  isTaskBlocked,
} = require("../utils/taskUtils");

const priorities = ["Low", "Medium", "High"];
const statuses = ["To Do", "In Progress", "Done"];

// Create task
const createTask = (req, res) => {
  const {
    title,
    description,
    priority,
    status,
    assignedUserId,
    dependencies,
  } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Task title is required",
    });
  }

  if (!priorities.includes(priority)) {
    return res.status(400).json({
      message: "Invalid priority",
    });
  }

  if (!statuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }

  if (assignedUserId && !users.has(assignedUserId)) {
    return res.status(400).json({
      message: "Assigned user not found",
    });
  }

  const taskDependencies = dependencies || [];

  for (const dependencyId of taskDependencies) {
    if (!tasks.has(dependencyId)) {
      return res.status(400).json({
        message: "One or more dependency tasks do not exist",
      });
    }
  }

  const id = Date.now().toString();

  const task = {
    id,
    title,
    description: description || "",
    priority,
    status,
    assignedUserId: assignedUserId || null,
    dependencies: taskDependencies,
    createdAt: new Date().toISOString(),
  };

  if (status === "Done" && !areDependenciesComplete(task)) {
    return res.status(400).json({
      message:
        "Task cannot be completed because dependencies are not complete",
    });
  }

  tasks.set(id, task);

  res.status(201).json({
    message: "Task created successfully",
    task,
  });
};


// Get all tasks
const getAllTasks = (req, res) => {
  const allTasks = [...tasks.values()];

  res.json({
    tasks: allTasks,
  });
};


// Get tasks for a user
const getUserTasks = (req, res) => {
  const { userId } = req.params;

  const userTasks = [...tasks.values()].filter(
    (task) => task.assignedUserId === userId
  );

  res.json({
    tasks: userTasks,
  });
};


// Get blocked tasks
const getBlockedTasks = (req, res) => {
  const blockedTasks = [...tasks.values()].filter((task) =>
    isTaskBlocked(task)
  );

  res.json({
    tasks: blockedTasks,
  });
};


// Update task
const updateTask = (req, res) => {
  const { id } = req.params;

  const task = tasks.get(id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const {
    title,
    description,
    priority,
    status,
    assignedUserId,
    dependencies,
  } = req.body;

  if (priority && !priorities.includes(priority)) {
    return res.status(400).json({
      message: "Invalid priority",
    });
  }

  if (status && !statuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }

  if (assignedUserId && !users.has(assignedUserId)) {
    return res.status(400).json({
      message: "Assigned user not found",
    });
  }

  const newDependencies =
    dependencies !== undefined ? dependencies : task.dependencies;

  for (const dependencyId of newDependencies) {
    if (dependencyId === id) {
      return res.status(400).json({
        message: "A task cannot depend on itself",
      });
    }

    if (!tasks.has(dependencyId)) {
      return res.status(400).json({
        message: "One or more dependency tasks do not exist",
      });
    }
  }

  const updatedTask = {
    ...task,
    title: title !== undefined ? title : task.title,
    description:
      description !== undefined ? description : task.description,
    priority: priority || task.priority,
    status: status || task.status,
    assignedUserId:
      assignedUserId !== undefined
        ? assignedUserId
        : task.assignedUserId,
    dependencies: newDependencies,
  };

  if (
    updatedTask.status === "Done" &&
    !areDependenciesComplete(updatedTask)
  ) {
    return res.status(400).json({
      message:
        "Task cannot be completed because dependencies are not complete",
    });
  }

  tasks.set(id, updatedTask);

  res.json({
    message: "Task updated successfully",
    task: updatedTask,
  });
};


// Delete task
const deleteTask = (req, res) => {
  const { id } = req.params;

  const task = tasks.get(id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  // Check if another task depends on this task
  const dependentTask = [...tasks.values()].find(
    (otherTask) =>
      otherTask.id !== id &&
      otherTask.dependencies &&
      otherTask.dependencies.includes(id)
  );

  if (dependentTask) {
    return res.status(400).json({
      message: `Cannot delete this task because "${dependentTask.title}" depends on it`,
    });
  }

  tasks.delete(id);

  res.json({
    message: "Task deleted successfully",
  });
};


// Complete task
const completeTask = (req, res) => {
  const { id } = req.params;

  const task = tasks.get(id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  if (!areDependenciesComplete(task)) {
    return res.status(400).json({
      message:
        "Task cannot be completed because dependencies are not complete",
    });
  }

  task.status = "Done";

  tasks.set(id, task);

  res.json({
    message: "Task completed successfully",
    task,
  });
};


module.exports = {
  createTask,
  getAllTasks,
  getUserTasks,
  getBlockedTasks,
  updateTask,
  deleteTask,
  completeTask,
};