import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Demo profiles for judges to quickly test the app.
 * Each profile has synthetic financial data.
 */
export const demoProfiles = mysqlTable("demo_profiles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "Salaried Beginner"
  description: text("description"),
  monthlyIncome: decimal("monthlyIncome", { precision: 12, scale: 2 }).notNull(),
  monthlyExpenses: decimal("monthlyExpenses", { precision: 12, scale: 2 }).notNull(),
  savingsRate: decimal("savingsRate", { precision: 5, scale: 2 }).notNull(), // percentage
  investmentBalance: decimal("investmentBalance", { precision: 12, scale: 2 }).notNull(),
  emergencyFundBalance: decimal("emergencyFundBalance", { precision: 12, scale: 2 }).notNull(),
  creditCardDebt: decimal("creditCardDebt", { precision: 12, scale: 2 }).notNull(),
  riskProfile: mysqlEnum("riskProfile", ["conservative", "moderate", "aggressive"]).notNull(),
  age: int("age").notNull(),
  occupation: varchar("occupation", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DemoProfile = typeof demoProfiles.$inferSelect;
export type InsertDemoProfile = typeof demoProfiles.$inferInsert;

/**
 * User profiles - stores which demo profile a user is currently viewing.
 */
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  demoProfileId: int("demoProfileId").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

/**
 * Synthetic transactions for each demo profile.
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  demoProfileId: int("demoProfileId").notNull(),
  date: timestamp("date").notNull(),
  category: mysqlEnum("category", [
    "salary",
    "food",
    "transport",
    "utilities",
    "entertainment",
    "shopping",
    "healthcare",
    "education",
    "investment",
    "savings",
    "subscription",
    "other",
  ]).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: mysqlEnum("type", ["income", "expense", "investment"]).notNull(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Financial goals for each demo profile.
 */
export const goals = mysqlTable("goals", {
  id: int("id").autoincrement().primaryKey(),
  demoProfileId: int("demoProfileId").notNull(),
  goalType: mysqlEnum("goalType", [
    "house",
    "car",
    "education",
    "emergency_fund",
    "retirement",
  ]).notNull(),
  targetAmount: decimal("targetAmount", { precision: 12, scale: 2 }).notNull(),
  currentAmount: decimal("currentAmount", { precision: 12, scale: 2 }).notNull().default("0"),
  timelineMonths: int("timelineMonths").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

/**
 * Personalized recommendations for each demo profile.
 */
export const recommendations = mysqlTable("recommendations", {
  id: int("id").autoincrement().primaryKey(),
  demoProfileId: int("demoProfileId").notNull(),
  recommendation: text("recommendation").notNull(),
  expectedBenefit: text("expectedBenefit"),
  riskLevel: mysqlEnum("riskLevel", ["low", "moderate", "high"]).notNull(),
  confidenceScore: int("confidenceScore").notNull(), // 0-100
  reasons: json("reasons").notNull(), // Array of strings explaining why
  category: mysqlEnum("category", [
    "savings",
    "investment",
    "debt_management",
    "emergency_fund",
    "spending",
  ]).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = typeof recommendations.$inferInsert;

/**
 * Alerts for each demo profile.
 */
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  demoProfileId: int("demoProfileId").notNull(),
  alertType: mysqlEnum("alertType", [
    "low_emergency_fund",
    "fd_maturity",
    "high_credit_usage",
    "spending_spike",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

/**
 * Gamification: savings streaks for each demo profile.
 */
export const savingsStreaks = mysqlTable("savings_streaks", {
  id: int("id").autoincrement().primaryKey(),
  demoProfileId: int("demoProfileId").notNull(),
  currentStreak: int("currentStreak").notNull().default(0), // number of months
  longestStreak: int("longestStreak").notNull().default(0),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavingsStreak = typeof savingsStreaks.$inferSelect;
export type InsertSavingsStreak = typeof savingsStreaks.$inferInsert;

/**
 * Gamification: achievement badges for each demo profile.
 */
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  demoProfileId: int("demoProfileId").notNull(),
  badgeType: mysqlEnum("badgeType", [
    "financial_novice",
    "savings_champion",
    "investment_pro",
    "debt_free",
    "emergency_fund_hero",
    "goal_achiever",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

/**
 * Financial health scores cached for performance.
 */
export const financialHealthScores = mysqlTable("financial_health_scores", {
  id: int("id").autoincrement().primaryKey(),
  demoProfileId: int("demoProfileId").notNull(),
  overallScore: int("overallScore").notNull(), // 0-100
  savingsScore: int("savingsScore").notNull(),
  investmentScore: int("investmentScore").notNull(),
  debtScore: int("debtScore").notNull(),
  emergencyFundScore: int("emergencyFundScore").notNull(),
  category: mysqlEnum("category", ["poor", "fair", "good", "excellent"]).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FinancialHealthScore = typeof financialHealthScores.$inferSelect;
export type InsertFinancialHealthScore = typeof financialHealthScores.$inferInsert;
