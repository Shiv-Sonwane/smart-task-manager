"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBlockedTasks, getTasks } from "../../lib/api";

export default function BlockedTasksPage() {
  const router = useRouter();

  const [blockedTasks, setBlockedTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlockedTasks = async () => {
      try {
        const blockedData = await getBlockedTasks();
        const tasksData = await getTasks();

        setBlockedTasks(blockedData.tasks);
        setAllTasks(tasksData.tasks);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadBlockedTasks();
  }, []);

  const getDependencyTitle = (dependencyId) => {
    const dependencyTask = allTasks.find(
      (task) => task.id === dependencyId
    );

    return dependencyTask
      ? dependencyTask.title
      : "Unknown task";
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Blocked Tasks
            </h1>

            <p className="mt-2 text-gray-700">
              Tasks that cannot be completed because their dependencies
              are incomplete.
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Dashboard
          </button>

        </div>

        {/* Error */}
        {error && (
          <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-700">
              Loading blocked tasks...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && blockedTasks.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">

            <h2 className="text-xl font-semibold text-gray-900">
              No blocked tasks
            </h2>

            <p className="mt-2 text-sm text-gray-700">
              All tasks are currently available to be completed.
            </p>

          </div>
        )}

        {/* Blocked Tasks */}
        {!loading && blockedTasks.length > 0 && (
          <div className="space-y-5">

            {blockedTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >

                {/* Task Header */}
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {task.title}
                    </h2>

                    {task.description && (
                      <p className="mt-2 text-sm text-gray-700">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                    Blocked
                  </span>

                </div>

                {/* Task Information */}
                <div className="mt-5 flex flex-wrap gap-3 text-sm">

                  <span className="rounded-lg bg-gray-100 px-3 py-1 text-gray-800">
                    Priority: {task.priority}
                  </span>

                  <span className="rounded-lg bg-gray-100 px-3 py-1 text-gray-800">
                    Status: {task.status}
                  </span>

                </div>

                {/* Dependencies */}
                <div className="mt-5">

                  <h3 className="text-sm font-semibold text-gray-900">
                    Waiting for:
                  </h3>

                  <div className="mt-2 space-y-2">

                    {task.dependencies.map((dependencyId) => (
                      <div
                        key={dependencyId}
                        className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700"
                      >
                        {getDependencyTitle(dependencyId)}
                      </div>
                    ))}

                  </div>

                </div>

                {/* Edit Button */}
                <div className="mt-5">

                  <button
                    onClick={() =>
                      router.push(`/edit-task/${task.id}`)
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Edit Task
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}