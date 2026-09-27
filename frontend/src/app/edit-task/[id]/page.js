"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTasks, getUsers, updateTask } from "../../../lib/api";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();

  const taskId = params.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("To Do");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [dependencies, setDependencies] = useState([]);

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await getUsers();
        const tasksData = await getTasks();

        const currentTask = tasksData.tasks.find(
          (task) => task.id === taskId
        );

        if (!currentTask) {
          setError("Task not found");
          setLoading(false);
          return;
        }

        setUsers(usersData.users);
        setTasks(tasksData.tasks);

        setTitle(currentTask.title);
        setDescription(currentTask.description);
        setPriority(currentTask.priority);
        setStatus(currentTask.status);
        setAssignedUserId(currentTask.assignedUserId || "");
        setDependencies(currentTask.dependencies || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [taskId]);

  const handleDependencyChange = (dependencyId) => {
    setDependencies((current) => {
      if (current.includes(dependencyId)) {
        return current.filter((id) => id !== dependencyId);
      }

      return [...current, dependencyId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await updateTask(taskId, {
        title,
        description,
        priority,
        status,
        assignedUserId: assignedUserId || null,
        dependencies,
      });

      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-700">
          Loading task...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Task
          </h1>

          <p className="mt-2 text-sm text-gray-700">
            Update your task details
          </p>
        </div>

        {error && (
          <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Task Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* Assign User */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Assign User
            </label>

            <select
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
            >
              <option value="">
                Select a user
              </option>

              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Dependencies */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Dependencies
            </label>

            {tasks.filter((task) => task.id !== taskId).length === 0 ? (
              <p className="text-sm text-gray-700">
                No other tasks available.
              </p>
            ) : (
              <div className="space-y-2 rounded-lg border border-gray-300 p-3">
                {tasks
                  .filter((task) => task.id !== taskId)
                  .map((task) => (
                    <label
                      key={task.id}
                      className="flex items-center gap-3 text-sm text-gray-900"
                    >
                      <input
                        type="checkbox"
                        checked={dependencies.includes(task.id)}
                        onChange={() =>
                          handleDependencyChange(task.id)
                        }
                      />

                      <span>{task.title}</span>
                    </label>
                  ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-1/2 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-1/2 rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}