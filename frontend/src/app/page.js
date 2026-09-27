"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getUserTasks,
  completeTask,
  deleteTask,
} from "../lib/api";

export default function Home() {
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Priority filter
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const currentUser = JSON.parse(storedUser);

    setUser(currentUser);

    loadTasks(currentUser.id);
  }, []);

  const loadTasks = async (userId) => {
    try {
      setError("");

      const data = await getUserTasks(userId);

      setTasks(data.tasks);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      setError("");

      await completeTask(id);

      if (user) {
        await loadTasks(user.id);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      await deleteTask(id);

      if (user) {
        await loadTasks(user.id);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Statistics
  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "To Do"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  // Filter tasks by priority
  const filteredTasks =
    priorityFilter === "All"
      ? tasks
      : tasks.filter(
          (task) => task.priority === priorityFilter
        );

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Smart Task Manager
            </h1>

            <p className="mt-2 text-gray-700">
              Manage your tasks, priorities and dependencies.
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-4">

              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Logged in as
                </p>

                <p className="font-medium text-gray-900">
                  {user.name}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>

            </div>
          )}

        </div>

        {/* Error */}
        {error && (
          <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-700">
              Total Tasks
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalTasks}
            </p>
          </div>

          {/* To Do */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-700">
              To Do
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {todoTasks}
            </p>
          </div>

          {/* In Progress */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-700">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {inProgressTasks}
            </p>
          </div>

          {/* Completed */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-700">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {completedTasks}
            </p>
          </div>

        </div>

        {/* Tasks section */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          {/* Tasks Header */}
          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                My Tasks
              </h2>

              <p className="mt-1 text-sm text-gray-700">
                Tasks assigned to you will appear here.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">

              <button
                onClick={() => router.push("/blocked-tasks")}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Blocked Tasks
              </button>

              <button
                onClick={() => router.push("/create-task")}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                + Create Task
              </button>

            </div>

          </div>

          {/* Priority Filter */}
          <div className="mt-6 flex flex-wrap items-center gap-2">

            <span className="mr-2 text-sm font-medium text-gray-700">
              Filter by Priority:
            </span>

            {["All", "Low", "Medium", "High"].map((priority) => (
              <button
                key={priority}
                onClick={() => setPriorityFilter(priority)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  priorityFilter === priority
                    ? "bg-black text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {priority}
              </button>
            ))}

          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-60 items-center justify-center">
              <p className="text-sm text-gray-700">
                Loading tasks...
              </p>
            </div>
          )}

          {/* No tasks */}
          {!loading && tasks.length === 0 && (
            <div className="flex min-h-60 items-center justify-center">

              <div className="text-center">

                <h3 className="text-lg font-medium text-gray-900">
                  No tasks assigned
                </h3>

                <p className="mt-1 text-sm text-gray-700">
                  Tasks assigned to you will appear here.
                </p>

              </div>

            </div>
          )}

          {/* No matching filtered tasks */}
          {!loading &&
            tasks.length > 0 &&
            filteredTasks.length === 0 && (
              <div className="flex min-h-60 items-center justify-center">

                <div className="text-center">

                  <h3 className="text-lg font-medium text-gray-900">
                    No matching tasks
                  </h3>

                  <p className="mt-1 text-sm text-gray-700">
                    There are no tasks with{" "}
                    {priorityFilter.toLowerCase()} priority.
                  </p>

                </div>

              </div>
            )}

          {/* Task list */}
          {!loading && filteredTasks.length > 0 && (
            <div className="mt-6 space-y-4">

              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-gray-200 p-5"
                >

                  {/* Task header */}
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="mt-1 text-sm text-gray-700">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                      {task.status}
                    </span>

                  </div>

                  {/* Task information */}
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-800">

                    <span className="rounded-lg bg-gray-100 px-3 py-1">
                      Priority: {task.priority}
                    </span>

                    {task.dependencies &&
                      task.dependencies.length > 0 && (
                        <span className="rounded-lg bg-gray-100 px-3 py-1">
                          Dependencies:{" "}
                          {task.dependencies.length}
                        </span>
                      )}

                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex gap-3">

                    {/* Complete */}
                    {task.status !== "Done" && (
                      <button
                        onClick={() => handleComplete(task.id)}
                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                      >
                        Mark Complete
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      onClick={() =>
                        router.push(`/edit-task/${task.id}`)
                      }
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}