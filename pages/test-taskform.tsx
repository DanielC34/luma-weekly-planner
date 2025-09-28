import React, { useState } from "react";
import Layout from "../components/Layout";
import TaskForm from "../components/TaskForm";
import { Task } from "../app/generated/prisma";

const TestTaskFormPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskAdded = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Luma - Test TaskForm Component
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Task
          </h2>
          <TaskForm onAdded={handleTaskAdded} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tasks ({tasks.length})
          </h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks added yet.</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Priority: {task.priority} | Estimated:{" "}
                        {task.estimatedMinutes} minutes
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(task.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TestTaskFormPage;
