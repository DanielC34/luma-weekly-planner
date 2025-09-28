import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { openai } from "../../lib/openai";
import { Task } from "../../app/generated/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests for plan generation
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // STEP 1: Fetch all tasks from the database
    // Order by priority descending so high priority tasks are considered first
    const tasks = await prisma.task.findMany({
      orderBy: { priority: "desc" },
    });

    // Validate that we have tasks to work with
    if (tasks.length === 0) {
      return res.status(400).json({
        error:
          "No tasks found. Please add some tasks before generating a plan.",
      });
    }

    // STEP 2: Prepare the AI prompt with task information
    // Convert each task into a readable format for the AI, including deadline information
    const taskDescriptions = tasks
      .map((task) => {
        let taskInfo = `- ${task.title} (${task.priority} priority, ${task.estimatedMinutes} minutes)`;

        if (task.deadline) {
          const deadlineDate = new Date(task.deadline);
          const now = new Date();
          const diffInHours =
            (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);

          taskInfo += ` - DEADLINE: ${deadlineDate.toLocaleDateString()} at ${deadlineDate.toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          )}`;

          if (diffInHours < 0) {
            taskInfo += ` (OVERDUE by ${Math.abs(
              Math.round(diffInHours)
            )} hours)`;
          } else if (diffInHours < 24) {
            taskInfo += ` (URGENT - due in ${Math.round(diffInHours)} hours)`;
          } else if (diffInHours < 72) {
            taskInfo += ` (due in ${Math.round(diffInHours / 24)} days)`;
          }
        }

        if (task.description) {
          taskInfo += `: ${task.description}`;
        }

        return taskInfo;
      })
      .join("\n");

    // Create a comprehensive prompt for the AI planner
    const prompt = `
You are an AI weekly planner assistant. Your job is to create an optimal weekly schedule.

TASK: Distribute the following tasks into a 7-day weekly plan (Monday–Sunday).

CRITICAL CONSTRAINTS:
- DEADLINE PRIORITY: Tasks with deadlines MUST be scheduled before their deadline date
- OVERDUE TASKS: Any overdue tasks should be scheduled immediately (today or tomorrow)
- URGENT TASKS: Tasks due within 24 hours should be prioritized for today
- Balance workload across days (try not to exceed 6 hours of tasks per day)
- Prioritize higher priority tasks earlier in the week
- Consider task duration and complexity
- Spread similar tasks across different days when possible
- Leave some buffer time for unexpected tasks

REQUIRED OUTPUT FORMAT:
Return the result strictly as a JSON object with this exact structure:

{
  "Monday": [ { "id": number, "title": string, "priority": string, "estimatedMinutes": number } ],
  "Tuesday": [ { "id": number, "title": string, "priority": string, "estimatedMinutes": number } ],
  "Wednesday": [ { "id": number, "title": string, "priority": string, "estimatedMinutes": number } ],
  "Thursday": [ { "id": number, "title": string, "priority": string, "estimatedMinutes": number } ],
  "Friday": [ { "id": number, "title": string, "priority": string, "estimatedMinutes": number } ],
  "Saturday": [ { "id": number, "title": string, "priority": string, "estimatedMinutes": number } ],
  "Sunday": [ { "id": number, "title": string, "priority": string, "estimatedMinutes": number } ]
}

TASKS TO SCHEDULE:
${taskDescriptions}
    `;

    // STEP 3: Call OpenAI API to generate the weekly plan
    console.log("🤖 Calling OpenAI to generate weekly plan...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective model for development
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // Ensure JSON response
      temperature: 0.7, // Balance between creativity and consistency
      max_tokens: 2000, // Sufficient for weekly plan response
    });

    // Parse the AI response
    const aiResponse = response.choices[0].message?.content;
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    const weeklyPlan = JSON.parse(aiResponse);
    console.log("✅ AI generated weekly plan successfully");

    // STEP 4: Save the generated plan to the database
    const plan = await prisma.plan.create({
      data: { weekJson: weeklyPlan },
    });

    // Return success response with the generated plan
    return res.status(201).json({
      id: plan.id,
      weekJson: plan.weekJson,
      createdAt: plan.createdAt,
      message: "AI-powered weekly plan generated successfully!",
    });
  } catch (error) {
    // Handle different types of errors
    console.error("❌ Error generating plan:", error);

    // Check if it's an OpenAI API error
    if (error instanceof Error && error.message.includes("API key")) {
      return res.status(500).json({
        error:
          "OpenAI API key not configured. Please check your environment variables.",
      });
    }

    // Check if it's a JSON parsing error
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        error: "Failed to parse AI response. Please try again.",
      });
    }

    // Generic error response
    return res.status(500).json({
      error: "Failed to generate plan. Please try again.",
    });
  }
}
