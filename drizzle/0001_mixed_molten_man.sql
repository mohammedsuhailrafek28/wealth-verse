CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`demoProfileId` int NOT NULL,
	`alertType` enum('low_emergency_fund','fd_maturity','high_credit_usage','spending_spike') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`severity` enum('info','warning','critical') NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`demoProfileId` int NOT NULL,
	`badgeType` enum('financial_novice','savings_champion','investment_pro','debt_free','emergency_fund_hero','goal_achiever') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `demo_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`monthlyIncome` decimal(12,2) NOT NULL,
	`monthlyExpenses` decimal(12,2) NOT NULL,
	`savingsRate` decimal(5,2) NOT NULL,
	`investmentBalance` decimal(12,2) NOT NULL,
	`emergencyFundBalance` decimal(12,2) NOT NULL,
	`creditCardDebt` decimal(12,2) NOT NULL,
	`riskProfile` enum('conservative','moderate','aggressive') NOT NULL,
	`age` int NOT NULL,
	`occupation` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `demo_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_health_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`demoProfileId` int NOT NULL,
	`overallScore` int NOT NULL,
	`savingsScore` int NOT NULL,
	`investmentScore` int NOT NULL,
	`debtScore` int NOT NULL,
	`emergencyFundScore` int NOT NULL,
	`category` enum('poor','fair','good','excellent') NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_health_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`demoProfileId` int NOT NULL,
	`goalType` enum('house','car','education','emergency_fund','retirement') NOT NULL,
	`targetAmount` decimal(12,2) NOT NULL,
	`currentAmount` decimal(12,2) NOT NULL DEFAULT '0',
	`timelineMonths` int NOT NULL,
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`demoProfileId` int NOT NULL,
	`recommendation` text NOT NULL,
	`expectedBenefit` text,
	`riskLevel` enum('low','moderate','high') NOT NULL,
	`confidenceScore` int NOT NULL,
	`reasons` json NOT NULL,
	`category` enum('savings','investment','debt_management','emergency_fund','spending') NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savings_streaks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`demoProfileId` int NOT NULL,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savings_streaks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`demoProfileId` int NOT NULL,
	`date` timestamp NOT NULL,
	`category` enum('salary','food','transport','utilities','entertainment','shopping','healthcare','education','investment','savings','subscription','other') NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`type` enum('income','expense','investment') NOT NULL,
	`description` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`demoProfileId` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`)
);
