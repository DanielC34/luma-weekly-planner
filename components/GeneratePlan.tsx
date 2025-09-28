"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Task } from "../app/generated/prisma";

interface PlanResponse {
  id: number;
  weekJson: Record<string, Task[]>;
  createdAt: string;
  message: string;
}

interface GeneratePlanProps {
  onPlanGenerated: (plan: PlanResponse) => void;
}

export default function GeneratePlan({ onPlanGenerated }: GeneratePlanProps) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("/api/generate-plan", { method: "POST" });
    const plan = await res.json();
    onPlanGenerated(plan);
    setLoading(false);
  };

  return (
    <Button onClick={handleGenerate} disabled={loading}>
      {loading ? "Generating..." : "Generate Weekly Plan"}
    </Button>
  );
}
