import type { AdvisorSessionContext } from "../memory/types";
import type { WealthContext, WealthGoal } from "../types";
import type { GoalForecast } from "./types";

const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

const goalName = (goal: WealthGoal) => goal.goalType.replace(/_/g, " ");

function estimateContribution(
  goal: WealthGoal,
  context: WealthContext,
  session?: AdvisorSessionContext
) {
  const priorityBoost =
    session?.preferences.goalPriority === "emergencyFund" && goal.goalType === "emergency_fund"
      ? 1.15
      : session?.preferences.goalPriority === "savings" && goal.goalType.includes("saving")
        ? 1.1
        : 1;
  const surplusBased = Math.max(0, context.monthlySurplus) * (goal.priority === "high" ? 0.35 : 0.2);
  return Math.round(Math.max(goal.monthlyContribution || 0, surplusBased) * priorityBoost);
}

export function buildGoalForecasts(
  context: WealthContext,
  session?: AdvisorSessionContext
): GoalForecast[] {
  return context.goals.map((goal) => {
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
    const monthlyContributionEstimate = estimateContribution(goal, context, session);
    const suggestedMonthlyContribution =
      goal.timelineMonths > 0 ? Math.ceil(remaining / Math.max(goal.timelineMonths, 1)) : remaining;

    if (goal.targetAmount <= 0) {
      return {
        goalId: goal.id ?? goal.goalType,
        goalName: goalName(goal),
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        monthlyContributionEstimate: 0,
        projectedCompletionDate: null,
        monthsRemaining: null,
        status: "stalled",
        suggestedMonthlyContribution: 0,
        assumptions: ["Goal target amount is missing or zero."],
        confidence: "low",
      };
    }

    if (remaining === 0) {
      return {
        goalId: goal.id ?? goal.goalType,
        goalName: goalName(goal),
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        monthlyContributionEstimate,
        projectedCompletionDate: new Date().toISOString(),
        monthsRemaining: 0,
        status: "ahead",
        suggestedMonthlyContribution: 0,
        assumptions: ["Goal is already fully funded in the current demo data."],
        confidence: "high",
      };
    }

    if (monthlyContributionEstimate <= 0 || context.monthlySurplus <= 0) {
      return {
        goalId: goal.id ?? goal.goalType,
        goalName: goalName(goal),
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        monthlyContributionEstimate,
        projectedCompletionDate: null,
        monthsRemaining: null,
        status: "stalled",
        suggestedMonthlyContribution,
        assumptions: [
          "Current surplus or contribution estimate is not enough to project a completion date.",
          "Projection ignores investment returns and uses contribution-only funding.",
        ],
        confidence: "medium",
      };
    }

    const monthsRemaining = Math.ceil(remaining / monthlyContributionEstimate);
    const projectedCompletionDate = addMonths(new Date(), monthsRemaining).toISOString();
    const status =
      monthsRemaining <= goal.timelineMonths * 0.8
        ? "ahead"
        : monthsRemaining <= goal.timelineMonths
          ? "onTrack"
          : monthsRemaining <= goal.timelineMonths * 1.5
            ? "behind"
            : "stalled";

    return {
      goalId: goal.id ?? goal.goalType,
      goalName: goalName(goal),
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      monthlyContributionEstimate,
      projectedCompletionDate,
      monthsRemaining,
      status,
      suggestedMonthlyContribution,
      assumptions: [
        "Projection uses current balance and estimated monthly contribution only.",
        "Projection does not assume market returns or guaranteed income changes.",
      ],
      confidence: goal.monthlyContribution > 0 ? "high" : "medium",
    };
  });
}
