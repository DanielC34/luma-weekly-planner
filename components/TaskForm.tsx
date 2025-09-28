"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Task } from "../app/generated/prisma";

interface TaskFormProps {
  onAdded: (task: Task) => void;
}

export default function TaskForm({ onAdded }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    // Validate minutes (must be less than 60)
    if (minutes >= 60) {
      alert("Minutes must be less than 60. Please adjust your time input.");
      return;
    }

    // Convert hours and minutes to total minutes
    const totalMinutes = hours * 60 + minutes;

    // Combine date and time into a single deadline datetime
    let deadline = null;
    if (deadlineDate) {
      if (deadlineTime) {
        // Combine date and time
        deadline = new Date(`${deadlineDate}T${deadlineTime}`).toISOString();
      } else {
        // Date only, set to end of day
        deadline = new Date(`${deadlineDate}T23:59:59`).toISOString();
      }
    }

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        priority,
        estimatedMinutes: totalMinutes,
        deadline,
      }),
    });

    const task = await res.json();
    onAdded(task);

    // Reset form
    setTitle("");
    setPriority("medium");
    setHours(0);
    setMinutes(30);
    setDeadlineDate("");
    setDeadlineTime("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* First row: Title and Priority */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
          required
        />
        <Select value={priority} onValueChange={(val) => setPriority(val)}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Second row: Time Estimation */}
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Time
          </label>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1">
              <Input
                type="number"
                placeholder="0"
                value={hours}
                onChange={(e) => setHours(Math.max(0, Number(e.target.value)))}
                className="w-16"
                min="0"
                max="23"
              />
              <span className="text-sm text-gray-600">hours</span>
            </div>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                placeholder="30"
                value={minutes}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 60) {
                    // Auto-convert 60+ minutes to hours
                    const newHours = hours + Math.floor(value / 60);
                    const newMinutes = value % 60;
                    setHours(newHours);
                    setMinutes(newMinutes);
                  } else {
                    setMinutes(Math.max(0, value));
                  }
                }}
                className="w-16"
                min="0"
                max="59"
              />
              <span className="text-sm text-gray-600">minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Third row: Deadline Date and Time */}
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deadline Date (Optional)
          </label>
          <Input
            type="date"
            value={deadlineDate}
            onChange={(e) => setDeadlineDate(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deadline Time (Optional)
          </label>
          <Input
            type="time"
            value={deadlineTime}
            onChange={(e) => setDeadlineTime(e.target.value)}
            className="w-full"
            disabled={!deadlineDate}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="bg-blue-600 text-white h-10">
            Add Task
          </Button>
        </div>
      </div>
    </form>
  );
}
