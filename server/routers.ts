import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import {
  getAllDemoProfiles,
  getDemoProfileById,
  getUserActiveProfile,
  setUserActiveProfile,
  getTransactionsByProfile,
  getGoalsByProfile,
  getAlertsByProfile,
  getSavingsStreak,
  getBadgesByProfile,
  updateFinancialHealthScore,
  getMonthlyTransactionSummary,
} from "./db";
import {
  getProfileMetrics,
  calculateHealthScore,
  generateRecommendations,
  getSpendingBreakdown,
  getUnusualExpenses,
  getSavingsOpportunities,
} from "./financialEngine";

async function getOrCreateActiveDemoProfileId(userId: number) {
  const userProfile = await getUserActiveProfile(userId);
  if (userProfile) return userProfile.demoProfileId;

  const profiles = await getAllDemoProfiles();
  const firstProfile = profiles[0];
  if (!firstProfile) return null;

  await setUserActiveProfile(userId, firstProfile.id);
  return firstProfile.id;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ Demo Profiles ============
  profiles: router({
    list: publicProcedure.query(async () => {
      return getAllDemoProfiles();
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getDemoProfileById(input.id);
    }),

    setActive: protectedProcedure
      .input(z.object({ demoProfileId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await setUserActiveProfile(ctx.user.id, input.demoProfileId);
        return { success: true };
      }),

    getActive: protectedProcedure.query(async ({ ctx }) => {
      const demoProfileId = await getOrCreateActiveDemoProfileId(ctx.user.id);
      if (!demoProfileId) return null;
      return getDemoProfileById(demoProfileId);
    }),
  }),

  // ============ Dashboard ============
  dashboard: router({
    getSummary: protectedProcedure.query(async ({ ctx }) => {
      const demoProfileId = await getOrCreateActiveDemoProfileId(ctx.user.id);
      if (!demoProfileId) return null;
      const profile = await getDemoProfileById(demoProfileId);
      if (!profile) return null;

      const metrics = await getProfileMetrics(demoProfileId);
      if (!metrics) return null;

      const healthScore = calculateHealthScore(metrics);
      const recommendations = generateRecommendations(metrics);
      const topRecommendations = recommendations.slice(0, 3);

      // Update health score in database
      await updateFinancialHealthScore(demoProfileId, healthScore);

      const streak = await getSavingsStreak(demoProfileId);
      const badges = await getBadgesByProfile(demoProfileId);

      return {
        profile: {
          name: profile.name,
          age: profile.age,
          occupation: profile.occupation,
          riskProfile: profile.riskProfile,
        },
        financialHealth: healthScore,
        monthlyIncome: parseFloat(profile.monthlyIncome.toString()),
        monthlyExpenses: parseFloat(profile.monthlyExpenses.toString()),
        savingsRate: parseFloat(profile.savingsRate.toString()),
        investmentBalance: parseFloat(profile.investmentBalance.toString()),
        emergencyFundBalance: parseFloat(profile.emergencyFundBalance.toString()),
        creditCardDebt: parseFloat(profile.creditCardDebt.toString()),
        topRecommendations: topRecommendations.map((r) => ({
          recommendation: r.recommendation,
          expectedBenefit: r.expectedBenefit,
          riskLevel: r.riskLevel,
          confidenceScore: r.confidenceScore,
          reasons: r.reasons,
          category: r.category,
        })),
        savingsStreak: streak?.currentStreak || 0,
        badges: badges.map((b) => ({
          badgeType: b.badgeType,
          title: b.title,
          description: b.description,
        })),
      };
    }),
  }),

  // ============ Spending Insights ============
  spending: router({
    getBreakdown: protectedProcedure.query(async ({ ctx }) => {
      const demoProfileId = await getOrCreateActiveDemoProfileId(ctx.user.id);
      if (!demoProfileId) return {};

      const breakdown = await getSpendingBreakdown(demoProfileId);
      return breakdown;
    }),

    getUnusual: protectedProcedure.query(async ({ ctx }) => {
      const demoProfileId = await getOrCreateActiveDemoProfileId(ctx.user.id);
      if (!demoProfileId) return [];

      const unusual = await getUnusualExpenses(demoProfileId);
      return unusual.map((u) => ({
        date: u.date,
        category: u.category,
        amount: parseFloat(u.amount.toString()),
        description: u.description,
      }));
    }),

    getOpportunities: protectedProcedure.query(async ({ ctx }) => {
      const demoProfileId = await getOrCreateActiveDemoProfileId(ctx.user.id);
      if (!demoProfileId) return [];

      return getSavingsOpportunities(demoProfileId);
    }),
  }),

  // ============ Goals ============
  goals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const demoProfileId = await getOrCreateActiveDemoProfileId(ctx.user.id);
      if (!demoProfileId) return [];

      const goals = await getGoalsByProfile(demoProfileId);
      return goals.map((g) => ({
        id: g.id,
        goalType: g.goalType,
        targetAmount: parseFloat(g.targetAmount.toString()),
        currentAmount: parseFloat(g.currentAmount.toString()),
        timelineMonths: g.timelineMonths,
        priority: g.priority,
        monthlyContribution: Math.round(
          parseFloat(g.targetAmount.toString()) / g.timelineMonths
        ),
      }));
    }),
  }),

  // ============ Recommendations ============
  recommendations: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const demoProfileId = await getOrCreateActiveDemoProfileId(ctx.user.id);
      if (!demoProfileId) return [];

      const metrics = await getProfileMetrics(demoProfileId);
      if (!metrics) return [];

      const recs = generateRecommendations(metrics);
      return recs.map((r) => ({
        recommendation: r.recommendation,
        expectedBenefit: r.expectedBenefit,
        riskLevel: r.riskLevel,
        confidenceScore: r.confidenceScore,
        reasons: r.reasons,
        category: r.category,
      }));
    }),
  }),

  // ============ Alerts ============
  alerts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const demoProfileId = await getOrCreateActiveDemoProfileId(ctx.user.id);
      if (!demoProfileId) return [];

      const alerts = await getAlertsByProfile(demoProfileId);
      return alerts.map((a) => ({
        id: a.id,
        alertType: a.alertType,
        title: a.title,
        message: a.message,
        severity: a.severity,
        isRead: a.isRead,
        createdAt: a.createdAt,
      }));
    }),
  }),

  // ============ Transactions ============
  transactions: router({
    recent: protectedProcedure.query(async ({ ctx }) => {
      const demoProfileId = await getOrCreateActiveDemoProfileId(ctx.user.id);
      if (!demoProfileId) return [];

      const txns = await getTransactionsByProfile(demoProfileId, 50);
      return txns.map((t) => ({
        id: t.id,
        date: t.date,
        category: t.category,
        amount: parseFloat(t.amount.toString()),
        type: t.type,
        description: t.description,
      }));
    }),

    summary: protectedProcedure.query(async ({ ctx }) => {
      const demoProfileId = await getOrCreateActiveDemoProfileId(ctx.user.id);
      if (!demoProfileId) return { income: 0, expenses: 0, investments: 0 };

      return getMonthlyTransactionSummary(demoProfileId);
    }),
  }),
});

export type AppRouter = typeof appRouter;
