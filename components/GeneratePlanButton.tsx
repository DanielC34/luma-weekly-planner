"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Calendar, Loader2 } from "lucide-react";
import { Task } from "../app/generated/prisma";

interface PlanResponse {
  id: number;
  weekJson: Record<string, Task[]>;
  createdAt: string;
  message: string;
}

interface GeneratePlanButtonProps {
  onPlanGenerated?: (plan: PlanResponse) => void;
}

export default function GeneratePlanButton({
  onPlanGenerated,
}: GeneratePlanButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate plan");
      }

      // Call the callback if provided
      if (onPlanGenerated) {
        onPlanGenerated(data);
      }

      // Show success message
      alert("Weekly plan generated successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate plan";
      setError(errorMessage);
      console.error("Error generating plan:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleGeneratePlan}
        disabled={isGenerating}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Plan...
          </>
        ) : (
          <>
            <Calendar className="mr-2 h-4 w-4" />
            Generate Weekly Plan
          </>
        )}
      </Button>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
