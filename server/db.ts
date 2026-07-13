import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  demoProfiles,
  userProfiles,
  transactions,
  goals,
  recommendations,
  alerts,
  savingsStreaks,
  badges,
  financialHealthScores,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { logger } from "./_core/logger";

let _db: ReturnType<typeof drizzle> | null = null;
let warnedMissingDatabase = false;

const DEMO_USER: InsertUser & { id: number; createdAt: Date; updatedAt: Date; lastSignedIn: Date } = {
  id: 0,
  openId: "local-demo-user",
  name: "Demo User",
  email: "demo@wealthverse.local",
  loginMethod: "local-demo",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const demoProfilesFallback: any[] = [
  {
    id: 1,
    name: "Salaried Beginner",
    description: "Young professional just starting their investment journey",
    monthlyIncome: "75000.00",
    monthlyExpenses: "45000.00",
    savingsRate: "40.00",
    investmentBalance: "250000.00",
    emergencyFundBalance: "135000.00",
    creditCardDebt: "15000.00",
    riskProfile: "moderate",
    age: 26,
    occupation: "Software Engineer",
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Family-Focused",
    description: "Middle-income family balancing savings and expenses",
    monthlyIncome: "120000.00",
    monthlyExpenses: "85000.00",
    savingsRate: "29.00",
    investmentBalance: "850000.00",
    emergencyFundBalance: "255000.00",
    creditCardDebt: "45000.00",
    riskProfile: "conservative",
    age: 38,
    occupation: "Manager",
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "High Spender",
    description: "Good income but high lifestyle expenses",
    monthlyIncome: "150000.00",
    monthlyExpenses: "120000.00",
    savingsRate: "20.00",
    investmentBalance: "400000.00",
    emergencyFundBalance: "180000.00",
    creditCardDebt: "120000.00",
    riskProfile: "moderate",
    age: 32,
    occupation: "Business Owner",
    createdAt: new Date(),
  },
];

const activeDemoProfiles = new Map<number, number>([[0, 1]]);

const demoTransactionsFallback: any[] = [
  { id: 1, demoProfileId: 1, date: new Date("2026-06-01"), category: "salary", amount: "75000.00", type: "income", description: "Monthly Salary", createdAt: new Date() },
  { id: 2, demoProfileId: 1, date: new Date("2026-06-03"), category: "food", amount: "8200.00", type: "expense", description: "Groceries and dining", createdAt: new Date() },
  { id: 3, demoProfileId: 1, date: new Date("2026-06-05"), category: "transport", amount: "4200.00", type: "expense", description: "Commute and fuel", createdAt: new Date() },
  { id: 4, demoProfileId: 1, date: new Date("2026-06-08"), category: "subscription", amount: "2400.00", type: "expense", description: "Streaming and software", createdAt: new Date() },
  { id: 5, demoProfileId: 1, date: new Date("2026-06-10"), category: "investment", amount: "15000.00", type: "investment", description: "Monthly SIP", createdAt: new Date() },
  { id: 6, demoProfileId: 1, date: new Date("2026-06-12"), category: "shopping", amount: "18500.00", type: "expense", description: "Electronics purchase", createdAt: new Date() },
  { id: 7, demoProfileId: 2, date: new Date("2026-06-01"), category: "salary", amount: "120000.00", type: "income", description: "Monthly Salary", createdAt: new Date() },
  { id: 8, demoProfileId: 2, date: new Date("2026-06-04"), category: "food", amount: "18500.00", type: "expense", description: "Family groceries", createdAt: new Date() },
  { id: 9, demoProfileId: 2, date: new Date("2026-06-07"), category: "education", amount: "12000.00", type: "expense", description: "School fees", createdAt: new Date() },
  { id: 10, demoProfileId: 3, date: new Date("2026-06-01"), category: "salary", amount: "150000.00", type: "income", description: "Business income", createdAt: new Date() },
  { id: 11, demoProfileId: 3, date: new Date("2026-06-04"), category: "entertainment", amount: "24000.00", type: "expense", description: "Dining and events", createdAt: new Date() },
  { id: 12, demoProfileId: 3, date: new Date("2026-06-09"), category: "shopping", amount: "36000.00", type: "expense", description: "Lifestyle purchases", createdAt: new Date() },
];

const demoGoalsFallback: any[] = [
  { id: 1, demoProfileId: 1, goalType: "emergency_fund", targetAmount: "500000.00", currentAmount: "135000.00", timelineMonths: 24, priority: "high", createdAt: new Date(), updatedAt: new Date() },
  { id: 2, demoProfileId: 1, goalType: "car", targetAmount: "1500000.00", currentAmount: "250000.00", timelineMonths: 60, priority: "medium", createdAt: new Date(), updatedAt: new Date() },
  { id: 3, demoProfileId: 2, goalType: "education", targetAmount: "1000000.00", currentAmount: "220000.00", timelineMonths: 84, priority: "high", createdAt: new Date(), updatedAt: new Date() },
  { id: 4, demoProfileId: 3, goalType: "house", targetAmount: "5000000.00", currentAmount: "600000.00", timelineMonths: 120, priority: "medium", createdAt: new Date(), updatedAt: new Date() },
];

const demoAlertsFallback: any[] = [
  { id: 1, demoProfileId: 1, alertType: "low_emergency_fund", title: "Emergency Fund Low", message: "Your emergency fund is below 3 months of expenses.", severity: "warning", isRead: false, createdAt: new Date() },
  { id: 2, demoProfileId: 3, alertType: "high_credit_usage", title: "High Credit Usage", message: "Your credit card debt is elevated for your income.", severity: "warning", isRead: false, createdAt: new Date() },
];

const demoBadgesFallback: any[] = [
  { id: 1, demoProfileId: 1, badgeType: "financial_novice", title: "Financial Starter", description: "Started tracking financial health", unlockedAt: new Date() },
  { id: 2, demoProfileId: 2, badgeType: "savings_champion", title: "Savings Champion", description: "Maintained a healthy savings habit", unlockedAt: new Date() },
];

const demoSavingsStreaksFallback: any[] = [
  { id: 1, demoProfileId: 1, currentStreak: 4, longestStreak: 6, lastUpdated: new Date(), createdAt: new Date() },
  { id: 2, demoProfileId: 2, currentStreak: 7, longestStreak: 9, lastUpdated: new Date(), createdAt: new Date() },
  { id: 3, demoProfileId: 3, currentStreak: 1, longestStreak: 3, lastUpdated: new Date(), createdAt: new Date() },
];

function canUseFallbackData() {
  return ENV.isDemoMode && !process.env.DATABASE_URL;
}

function databaseUnavailableError() {
  return new Error(
    "Database is unavailable. Set DATABASE_URL, or enable WEALTHVERSE_DEMO_MODE=true for local demo data."
  );
}

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      logger.warn("[Database] Failed to initialize connection.", { error });
      _db = null;
    }
  }
  if (!_db && !process.env.DATABASE_URL && !warnedMissingDatabase) {
    warnedMissingDatabase = true;
    logger.warn(
      canUseFallbackData()
        ? "[Database] DATABASE_URL missing; using local demo data."
        : "[Database] DATABASE_URL missing."
    );
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    if (ENV.isDemoMode) return;
    logger.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    logger.error("[Database] Failed to upsert user.", { error });
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    if (ENV.isDemoMode && openId === DEMO_USER.openId) return DEMO_USER as any;
    logger.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getDatabaseHealth() {
  if (!ENV.databaseUrl) {
    return {
      configured: false,
      status: ENV.isDemoMode ? "demo" : "unavailable",
      message: ENV.isDemoMode
        ? "DATABASE_URL is not configured; local demo data is active."
        : "DATABASE_URL is required when demo mode is disabled.",
    } as const;
  }

  const db = await getDb();
  return {
    configured: true,
    status: db ? "healthy" : "unavailable",
    message: db
      ? "Database client initialized."
      : "Database URL is configured, but the database client is unavailable.",
  } as const;
}

// ============ Demo Profiles ============

export async function getAllDemoProfiles() {
  const db = await getDb();
  if (!db) {
    if (canUseFallbackData()) return demoProfilesFallback;
    throw databaseUnavailableError();
  }
  return db.select().from(demoProfiles);
}

export async function getDemoProfileById(id: number) {
  const db = await getDb();
  if (!db) {
    if (canUseFallbackData()) {
      return demoProfilesFallback.find((profile) => profile.id === id) ?? null;
    }
    throw databaseUnavailableError();
  }
  const result = await db
    .select()
    .from(demoProfiles)
    .where(eq(demoProfiles.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ User Profiles ============

export async function getUserActiveProfile(userId: number) {
  const db = await getDb();
  if (!db) {
    if (canUseFallbackData()) {
      const demoProfileId = activeDemoProfiles.get(userId);
      return demoProfileId
        ? { id: 1, userId, demoProfileId, isActive: true, createdAt: new Date(), updatedAt: new Date() }
        : null;
    }
    throw databaseUnavailableError();
  }
  const result = await db
    .select()
    .from(userProfiles)
    .where(and(eq(userProfiles.userId, userId), eq(userProfiles.isActive, true)))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function setUserActiveProfile(userId: number, demoProfileId: number) {
  const db = await getDb();
  if (!db) {
    if (canUseFallbackData()) {
      activeDemoProfiles.set(userId, demoProfileId);
      return;
    }
    throw databaseUnavailableError();
  }

  // Deactivate all previous profiles
  await db
    .update(userProfiles)
    .set({ isActive: false })
    .where(eq(userProfiles.userId, userId));

  // Create or activate the new profile
  const existing = await db
    .select()
    .from(userProfiles)
    .where(
      and(eq(userProfiles.userId, userId), eq(userProfiles.demoProfileId, demoProfileId))
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(userProfiles)
      .set({ isActive: true })
      .where(eq(userProfiles.id, existing[0].id));
  } else {
    await db.insert(userProfiles).values({
      userId,
      demoProfileId,
      isActive: true,
    });
  }
}

// ============ Transactions ============

export async function getTransactionsByProfile(demoProfileId: number, limit = 100) {
  const db = await getDb();
  if (!db) {
    if (canUseFallbackData()) {
      return demoTransactionsFallback
        .filter((transaction) => transaction.demoProfileId === demoProfileId)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, limit);
    }
    throw databaseUnavailableError();
  }
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.demoProfileId, demoProfileId))
    .orderBy(desc(transactions.date))
    .limit(limit);
}

export async function getMonthlyTransactionSummary(demoProfileId: number) {
  const db = await getDb();
  if (!db && canUseFallbackData()) {
    const txns = demoTransactionsFallback.filter((transaction) => transaction.demoProfileId === demoProfileId);
    return summarizeTransactions(txns);
  }
  if (!db) throw databaseUnavailableError();

  const txns = await db
    .select()
    .from(transactions)
    .where(eq(transactions.demoProfileId, demoProfileId));

  return summarizeTransactions(txns);
}

// ============ Goals ============

export async function getGoalsByProfile(demoProfileId: number) {
  const db = await getDb();
  if (!db) {
    if (canUseFallbackData()) {
      return demoGoalsFallback.filter((goal) => goal.demoProfileId === demoProfileId);
    }
    throw databaseUnavailableError();
  }
  return db
    .select()
    .from(goals)
    .where(eq(goals.demoProfileId, demoProfileId));
}

// ============ Recommendations ============

export async function getRecommendationsByProfile(demoProfileId: number) {
  const db = await getDb();
  if (!db) {
    if (canUseFallbackData()) return [];
    throw databaseUnavailableError();
  }
  return db
    .select()
    .from(recommendations)
    .where(
      and(
        eq(recommendations.demoProfileId, demoProfileId),
        eq(recommendations.isActive, true)
      )
    );
}

// ============ Alerts ============

export async function getAlertsByProfile(demoProfileId: number) {
  const db = await getDb();
  if (!db) {
    if (canUseFallbackData()) {
      return demoAlertsFallback.filter((alert) => alert.demoProfileId === demoProfileId);
    }
    throw databaseUnavailableError();
  }
  return db
    .select()
    .from(alerts)
    .where(eq(alerts.demoProfileId, demoProfileId))
    .orderBy(desc(alerts.createdAt));
}

// ============ Gamification ============

export async function getSavingsStreak(demoProfileId: number) {
  const db = await getDb();
  if (!db) {
    if (canUseFallbackData()) {
      return demoSavingsStreaksFallback.find((streak) => streak.demoProfileId === demoProfileId) ?? null;
    }
    throw databaseUnavailableError();
  }
  const result = await db
    .select()
    .from(savingsStreaks)
    .where(eq(savingsStreaks.demoProfileId, demoProfileId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getBadgesByProfile(demoProfileId: number) {
  const db = await getDb();
  if (!db) {
    if (canUseFallbackData()) {
      return demoBadgesFallback.filter((badge) => badge.demoProfileId === demoProfileId);
    }
    throw databaseUnavailableError();
  }
  return db
    .select()
    .from(badges)
    .where(eq(badges.demoProfileId, demoProfileId));
}

// ============ Financial Health Scores ============

export async function getFinancialHealthScore(demoProfileId: number) {
  const db = await getDb();
  if (!db) {
    if (canUseFallbackData()) return null;
    throw databaseUnavailableError();
  }
  const result = await db
    .select()
    .from(financialHealthScores)
    .where(eq(financialHealthScores.demoProfileId, demoProfileId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateFinancialHealthScore(
  demoProfileId: number,
  scores: {
    overallScore: number;
    savingsScore: number;
    investmentScore: number;
    debtScore: number;
    emergencyFundScore: number;
    category: "poor" | "fair" | "good" | "excellent";
  }
) {
  const db = await getDb();
  if (!db) {
    if (canUseFallbackData()) return;
    throw databaseUnavailableError();
  }

  const existing = await getFinancialHealthScore(demoProfileId);

  if (existing) {
    await db
      .update(financialHealthScores)
      .set(scores)
      .where(eq(financialHealthScores.demoProfileId, demoProfileId));
  } else {
    await db.insert(financialHealthScores).values({
      demoProfileId,
      ...scores,
    });
  }
}

function summarizeTransactions(txns: any[]) {
  let income = 0;
  let expenses = 0;
  let investments = 0;

  txns.forEach((t) => {
    const amount = parseFloat(t.amount.toString());
    if (t.type === "income") income += amount;
    else if (t.type === "expense") expenses += amount;
    else if (t.type === "investment") investments += amount;
  });

  return { income, expenses, investments };
}
