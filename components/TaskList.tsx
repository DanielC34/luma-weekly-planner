"use client";

import { Task } from "../app/generated/prisma";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface TaskListProps {
  refreshSignal?: boolean; // optional, can trigger refresh
}

export default function TaskList({ refreshSignal }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshSignal]);

  const deleteTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

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

  // Helper function to format deadline and determine urgency
  const formatDeadline = (deadline: Date | null) => {
    if (!deadline) return null;

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffInHours =
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    const dateStr = deadlineDate.toLocaleDateString();
    const timeStr = deadlineDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    let urgency = "normal";
    if (diffInHours < 24) urgency = "urgent";
    else if (diffInHours < 72) urgency = "soon";

    return {
      display: `${dateStr} at ${timeStr}`,
      urgency,
      isOverdue: diffInHours < 0,
    };
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const deadlineInfo = formatDeadline(task.deadline);

        return (
          <div
            key={task.id}
            className={`flex justify-between items-start p-3 border rounded-lg ${
              deadlineInfo?.isOverdue
                ? "border-red-300 bg-red-50"
                : deadlineInfo?.urgency === "urgent"
                ? "border-orange-300 bg-orange-50"
                : deadlineInfo?.urgency === "soon"
                ? "border-yellow-300 bg-yellow-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">
                  {task.title}
                </span>
                <Badge
                  variant={
                    task.priority === "high"
                      ? "destructive"
                      : task.priority === "medium"
                      ? "secondary"
                      : "default"
                  }
                >
                  {task.priority}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>⏱️ {formatDuration(task.estimatedMinutes)}</span>

                {deadlineInfo && (
                  <span
                    className={`flex items-center gap-1 ${
                      deadlineInfo.isOverdue
                        ? "text-red-600 font-semibold"
                        : deadlineInfo.urgency === "urgent"
                        ? "text-orange-600 font-medium"
                        : deadlineInfo.urgency === "soon"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    📅 {deadlineInfo.display}
                    {deadlineInfo.isOverdue && " (OVERDUE)"}
                    {deadlineInfo.urgency === "urgent" &&
                      !deadlineInfo.isOverdue &&
                      " (URGENT)"}
                  </span>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTask(task.id)}
              className="ml-2 text-gray-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
