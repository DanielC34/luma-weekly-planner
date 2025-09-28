import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET request: fetch all tasks
  if (req.method === "GET") {
    const tasks = await prisma.task.findMany({
      orderBy: [
        { deadline: "asc" }, // tasks with deadlines first, ordered by deadline
        { priority: "desc" }, // then by priority
        { createdAt: "desc" }, // finally by creation date
      ],
    });
    return res.status(200).json(tasks);
  }

  // POST request: create a new task
  if (req.method === "POST") {
    const { title, description, priority, estimatedMinutes, deadline } =
      req.body;

    // validation: title is required
    if (!title) {
      return res.status(400).json({ error: "Task title is required" });
    }

    // validation: deadline should be a valid date if provided
    let deadlineDate = null;
    if (deadline) {
      deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        return res.status(400).json({ error: "Invalid deadline date format" });
      }
    }

    // create task in the database
    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        priority: priority || "medium",
        estimatedMinutes: Number(estimatedMinutes) || 30,
        deadline: deadlineDate,
      },
    });

    return res.status(201).json(task);
  }

  // If method is not GET or POST
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
