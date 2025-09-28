import React, { useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import GeneratePlan from "../components/GeneratePlan";
import PlanDisplay from "../components/PlanDisplay";
import { Task } from "../app/generated/prisma";

interface PlanResponse {
  id: number;
  weekJson: Record<string, Task[]>;
  createdAt: string;
  message: string;
}

const HomePage: React.FC = () => {
  const [refreshSignal, setRefreshSignal] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<Record<
    string,
    Task[]
  > | null>(null);

  const handleTaskAdded = (task: Task) => {
    // Trigger refresh of the task list
    setRefreshSignal((prev) => !prev);
  };

  const handlePlanGenerated = (plan: PlanResponse) => {
    // Store the generated plan
    setGeneratedPlan(plan.weekJson);
  };

  return (
    <>
      <Head>
        <title>Luma - Stay organized effortlessly</title>
        <meta name="description" content="AI-powered weekly planner that helps you organize tasks and create optimal schedules effortlessly." />
      </Head>
      <Layout>
        <div className="px-4 py-6 sm:px-0">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Luma
          </h1>
          <p className="text-lg text-gray-500 mb-4">
            Stay organized effortlessly.
          </p>
          <p className="text-base text-gray-600">
            Your intelligent companion for planning and organizing your weekly
            tasks and goals.
          </p>
        </div>

        {/* Task Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Add Task Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add New Task
            </h2>
            <TaskForm onAdded={handleTaskAdded} />
          </div>

          {/* Task List */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Tasks
            </h2>
            <TaskList refreshSignal={refreshSignal} />
          </div>
        </div>

        {/* Plan Generation Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Generate Weekly Plan
          </h2>
          <p className="text-gray-600 mb-4">
            Create an AI-powered weekly schedule based on your tasks and
            priorities.
          </p>
          <GeneratePlan onPlanGenerated={handlePlanGenerated} />

          {/* Display the generated plan */}
          {generatedPlan && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Weekly Plan
              </h3>
              <PlanDisplay plan={generatedPlan} />
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Smart Planning
            </h3>
            <p className="text-gray-600">
              AI-powered task organization and priority management for optimal
              productivity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Time Tracking
            </h3>
            <p className="text-gray-600">
              Monitor your progress and optimize your time allocation across
              different activities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analytics
            </h3>
            <p className="text-gray-600">
              Get insights into your productivity patterns and areas for
              improvement.
            </p>
          </div>
        </div>
      </div>
      </Layout>
    </>
  );
};

export default HomePage;
