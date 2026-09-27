const { tasks } = require("../data/store");

const areDependenciesComplete = (task) => {
  if (!task.dependencies || task.dependencies.length === 0) {
    return true;
  }

  return task.dependencies.every((dependencyId) => {
    const dependencyTask = tasks.get(dependencyId);

    if (!dependencyTask) {
      return false;
    }

    return dependencyTask.status === "Done";
  });
};

const isTaskBlocked = (task) => {
  return !areDependenciesComplete(task);
};

module.exports = {
  areDependenciesComplete,
  isTaskBlocked,
};