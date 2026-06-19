import mysql from "mysql2/promise";

const DEMO_PROFILES = [
  {
    name: "Salaried Beginner",
    description: "Young professional just starting their investment journey",
    monthlyIncome: 75000,
    monthlyExpenses: 45000,
    savingsRate: 40,
    investmentBalance: 250000,
    emergencyFundBalance: 135000,
    creditCardDebt: 15000,
    riskProfile: "moderate",
    age: 26,
    occupation: "Software Engineer",
  },
  {
    name: "Family-Focused",
    description: "Middle-income family balancing savings and expenses",
    monthlyIncome: 120000,
    monthlyExpenses: 85000,
    savingsRate: 29,
    investmentBalance: 850000,
    emergencyFundBalance: 255000,
    creditCardDebt: 45000,
    riskProfile: "conservative",
    age: 38,
    occupation: "Manager",
  },
  {
    name: "High Spender",
    description: "Good income but high lifestyle expenses",
    monthlyIncome: 150000,
    monthlyExpenses: 120000,
    savingsRate: 20,
    investmentBalance: 400000,
    emergencyFundBalance: 180000,
    creditCardDebt: 120000,
    riskProfile: "moderate",
    age: 32,
    occupation: "Business Owner",
  },
  {
    name: "Young Professional",
    description: "Tech-savvy early career with strong savings discipline",
    monthlyIncome: 95000,
    monthlyExpenses: 50000,
    savingsRate: 47,
    investmentBalance: 600000,
    emergencyFundBalance: 200000,
    creditCardDebt: 0,
    riskProfile: "aggressive",
    age: 28,
    occupation: "Product Manager",
  },
];

async function seedData() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log("Seeding demo profiles...");

    for (const profile of DEMO_PROFILES) {
      const query = `
        INSERT INTO demo_profiles (
          name, description, monthlyIncome, monthlyExpenses, savingsRate,
          investmentBalance, emergencyFundBalance, creditCardDebt,
          riskProfile, age, occupation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await connection.execute(query, [
        profile.name,
        profile.description,
        profile.monthlyIncome,
        profile.monthlyExpenses,
        profile.savingsRate,
        profile.investmentBalance,
        profile.emergencyFundBalance,
        profile.creditCardDebt,
        profile.riskProfile,
        profile.age,
        profile.occupation,
      ]);

      console.log(`✓ Created profile: ${profile.name}`);
    }

    // Get the created profiles to seed transactions
    const [profiles] = await connection.execute("SELECT id, monthlyIncome, monthlyExpenses FROM demo_profiles");

    for (const profile of profiles) {
      await seedTransactionsForProfile(connection, profile);
      await seedGoalsForProfile(connection, profile);
      await seedAlertsForProfile(connection, profile);
      await seedSavingsStreakForProfile(connection, profile);
    }

    console.log("✓ Demo data seeded successfully!");
  } finally {
    await connection.end();
  }
}

async function seedTransactionsForProfile(connection, profile) {
  const now = new Date();
  const transactions = [];

  // Generate 60 days of transactions
  for (let i = 60; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Monthly salary (once a month)
    if (i % 30 === 0) {
      transactions.push([
        profile.id,
        date,
        "salary",
        profile.monthlyIncome,
        "income",
        "Monthly Salary",
      ]);
    }

    // Random expenses
    const categories = ["food", "transport", "utilities", "entertainment", "shopping", "healthcare", "subscription"];
    const categoryAmounts = {
      food: [300, 800],
      transport: [500, 2000],
      utilities: [1500, 3000],
      entertainment: [1000, 5000],
      shopping: [2000, 10000],
      healthcare: [500, 3000],
      subscription: [200, 1000],
    };

    if (Math.random() > 0.3) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const [min, max] = categoryAmounts[category];
      const amount = Math.floor(Math.random() * (max - min + 1)) + min;

      transactions.push([
        profile.id,
        date,
        category,
        amount,
        "expense",
        `${category.charAt(0).toUpperCase() + category.slice(1)} expense`,
      ]);
    }

    // Random investments (10% chance)
    if (Math.random() > 0.9) {
      const amount = Math.floor(Math.random() * 5000) + 5000;
      transactions.push([
        profile.id,
        date,
        "investment",
        amount,
        "investment",
        "SIP / Investment",
      ]);
    }
  }

  // Batch insert
  for (const txn of transactions) {
    const query = `
      INSERT INTO transactions (demoProfileId, date, category, amount, type, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, txn);
  }

  console.log(`  ✓ Seeded ${transactions.length} transactions for profile ${profile.id}`);
}

async function seedGoalsForProfile(connection, profile) {
  const goals = [
    { goalType: "house", targetAmount: 5000000, timelineMonths: 120 },
    { goalType: "car", targetAmount: 1500000, timelineMonths: 60 },
    { goalType: "education", targetAmount: 1000000, timelineMonths: 84 },
    { goalType: "emergency_fund", targetAmount: 500000, timelineMonths: 24 },
    { goalType: "retirement", targetAmount: 10000000, timelineMonths: 240 },
  ];

  for (const goal of goals) {
    const query = `
      INSERT INTO goals (demoProfileId, goalType, targetAmount, currentAmount, timelineMonths, priority)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [
      profile.id,
      goal.goalType,
      goal.targetAmount,
      Math.floor(Math.random() * goal.targetAmount * 0.3),
      goal.timelineMonths,
      ["low", "medium", "high"][Math.floor(Math.random() * 3)],
    ]);
  }

  console.log(`  ✓ Seeded 5 goals for profile ${profile.id}`);
}

async function seedAlertsForProfile(connection, profile) {
  const alerts = [
    {
      alertType: "low_emergency_fund",
      title: "Emergency Fund Low",
      message: "Your emergency fund is below 3 months of expenses. Consider building it up.",
      severity: "warning",
    },
    {
      alertType: "high_credit_usage",
      title: "High Credit Card Usage",
      message: "Your credit card utilization is above 50%. Try to pay down the balance.",
      severity: "warning",
    },
    {
      alertType: "spending_spike",
      title: "Spending Spike Detected",
      message: "Your spending increased by 25% this month. Review your transactions.",
      severity: "info",
    },
  ];

  for (const alert of alerts) {
    const query = `
      INSERT INTO alerts (demoProfileId, alertType, title, message, severity)
      VALUES (?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [
      profile.id,
      alert.alertType,
      alert.title,
      alert.message,
      alert.severity,
    ]);
  }

  console.log(`  ✓ Seeded 3 alerts for profile ${profile.id}`);
}

async function seedSavingsStreakForProfile(connection, profile) {
  const query = `
    INSERT INTO savings_streaks (demoProfileId, currentStreak, longestStreak)
    VALUES (?, ?, ?)
  `;
  const currentStreak = Math.floor(Math.random() * 12) + 1;
  const longestStreak = currentStreak + Math.floor(Math.random() * 6);

  await connection.execute(query, [profile.id, currentStreak, longestStreak]);
  console.log(`  ✓ Seeded savings streak for profile ${profile.id}`);
}

seedData().catch((err) => {
  console.error("Error seeding data:", err);
  process.exit(1);
});
