"use client";

import { Task } from "../app/generated/prisma";

interface PlanDisplayProps {
  plan: Record<string, Task[]>;
}

export default function PlanDisplay({ plan }: PlanDisplayProps) {
  if (!plan) return null;

  // Helper function to format time duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }
  };

  // Helper function to format deadline
  const formatDeadline = (deadline: Date | null) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    return (
      deadlineDate.toLocaleDateString() +
      " " +
      deadlineDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(plan).map(([day, tasks]) => {
        const totalMinutes = tasks.reduce(
          (sum, task) => sum + task.estimatedMinutes,
          0
        );
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place

        return (
          <div key={day} className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg text-gray-900">{day}</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {totalHours}h total
              </span>
            </div>

            {tasks.length === 0 ? (
              <p className="text-gray-500 italic">No tasks scheduled</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="p-2 bg-gray-50 rounded border-l-4 border-blue-400"
                  >
                    <div className="font-medium text-gray-900">
                      {task.title}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                        {task.priority}
                      </span>
                      <span>⏱️ {formatDuration(task.estimatedMinutes)}</span>
                      {task.deadline && (
                        <span className="text-orange-600 font-medium">
                          📅 {formatDeadline(task.deadline)}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
