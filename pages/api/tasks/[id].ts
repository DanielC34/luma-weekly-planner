import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Task ID is required" });
  }

  const taskId = parseInt(id);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  // DELETE request: delete a task
  if (req.method === "DELETE") {
    try {
      await prisma.task.delete({
        where: { id: taskId },
      });
      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      return res.status(404).json({ error: "Task not found" });
    }
  }

  // GET request: fetch a specific task
  if (req.method === "GET") {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      });

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch task" });
    }
  }

  // PUT request: update a task
  if (req.method === "PUT") {
    const { title, description, priority, estimatedMinutes, deadline } =
      req.body;

    // validation: deadline should be a valid date if provided
    let deadlineDate = undefined;
    if (deadline !== undefined) {
      if (deadline === null || deadline === "") {
        deadlineDate = null; // Clear the deadline
      } else {
        deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
          return res
            .status(400)
            .json({ error: "Invalid deadline date format" });
        }
      }
    }

    try {
      const task = await prisma.task.update({
        where: { id: taskId },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(priority && { priority }),
          ...(estimatedMinutes && {
            estimatedMinutes: Number(estimatedMinutes),
          }),
          ...(deadline !== undefined && { deadline: deadlineDate }),
        },
      });

      return res.status(200).json(task);
    } catch (error) {
      return res.status(404).json({ error: "Task not found" });
    }
  }

  // If method is not supported
  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
