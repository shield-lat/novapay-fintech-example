import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client explicitly for better compatibility
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // 1. Create Company: TechSolutions Inc.
  const company = await prisma.company.create({
    data: {
      legalName: 'TechSolutions Inc.',
      taxId: 'US-987654321',
      subscriptionTier: 'Pro',
      industrySector: 'Technology',
      riskProfile: 'Low',
      billing: {
        create: {
          mrrAmount: 499.00,
          extraFees: 50.00,
          status: 'Active',
        }
      },
      treasuryRules: {
        create: {
          minOperatingCash: 50000.00,
          investmentRiskTolerance: 'Medium',
          autoInvestEnabled: true,
        }
      }
    },
  });

  console.log(`Created company with id: ${company.id}`);

  // 2. Create Users
  const cfo = await prisma.user.create({
    data: {
      companyId: company.id,
      name: 'Elena Fisher',
      email: 'elena.fisher@techsolutions.com',
      role: 'CFO',
      permissions: ['admin', 'approve_payments', 'manage_investments'],
    },
  });

  const accountant = await prisma.user.create({
    data: {
      companyId: company.id,
      name: 'Marcus Reed',
      email: 'marcus.reed@techsolutions.com',
      role: 'Accountant',
      permissions: ['read_only', 'create_invoices'],
    },
  });

  console.log('Created users: CFO and Accountant');

  // 3. Create Linked Accounts
  const checkingAccount = await prisma.linkedAccount.create({
    data: {
      companyId: company.id,
      bankName: 'Chase Bank',
      accountType: 'Checking',
      currentBalance: 125000.50,
      accessToken: 'encrypted_token_123',
    },
  });

  const savingsAccount = await prisma.linkedAccount.create({
    data: {
      companyId: company.id,
      bankName: 'Silicon Valley Bank',
      accountType: 'Savings',
      currentBalance: 350000.00,
      accessToken: 'encrypted_token_456',
    },
  });

  console.log('Created linked accounts');

  // 4. Create Transactions (50+ mock transactions)
  const categories = ['Revenue', 'Payroll', 'Software Subscription', 'Office Rent', 'Utilities', 'Marketing', 'Legal Fees'];
  const vendors = ['Stripe Payout', 'Gusto Payroll', 'AWS', 'WeWork', 'PGE', 'Google Ads', 'Baker McKenzie'];
  const directions = ['Credit', 'Debit', 'Debit', 'Debit', 'Debit', 'Debit', 'Debit']; // Matched to categories roughly

  const transactions = [];
  const now = new Date();

  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    const typeIndex = Math.floor(Math.random() * categories.length);
    // Revenue (Credit) vs Expense (Debit)
    const isCredit = directions[typeIndex] === 'Credit';
    const amount = isCredit ? Math.random() * 10000 + 5000 : Math.random() * 2000 + 100;

    transactions.push({
      accountId: checkingAccount.id,
      amount: Number(amount.toFixed(2)),
      direction: directions[typeIndex],
      category: categories[typeIndex],
      transactionDate: date,
      merchantName: vendors[typeIndex],
      status: 'Posted',
      description: `Payment ${isCredit ? 'from' : 'to'} ${vendors[typeIndex]}`,
    });
  }

  await prisma.transaction.createMany({
    data: transactions,
  });

  console.log('Created 60+ transactions');

  // 5. Create Invoices AR (Accounts Receivable) - Clients owing money
  const clients = ['Alpha Corp', 'Beta LLC', 'Gamma Inc', 'Delta Systems'];
  
  for (const client of clients) {
    const isPaid = Math.random() > 0.5;
    await prisma.invoiceAR.create({
      data: {
        companyId: company.id,
        customerName: client,
        amount: Math.floor(Math.random() * 15000) + 2000,
        dueDate: new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Future date
        paymentProbability: Math.floor(Math.random() * 30) + 70, // 70-100%
        collectionStage: 'Email 1',
        status: isPaid ? 'Paid' : 'Outstanding',
        // If unpaid and high probability, simulate factoring opportunity
        factoringLoan: !isPaid ? {
          create: {
             loanAmount: 5000,
             feeCharged: 150,
             status: 'Disbursed'
          }
        } : undefined
      },
    });
  }

  console.log('Created Invoices AR');

  // 6. Create Invoices AP (Accounts Payable) - Bills to pay
  const suppliers = ['AWS Services', 'Salesforce', 'Office Depot'];
  
  for (const supplier of suppliers) {
    const dueDate = new Date(now.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000);
    await prisma.invoiceAP.create({
      data: {
        companyId: company.id,
        vendorName: supplier,
        dueDate: dueDate,
        predictedPaymentDate: new Date(dueDate.getTime() - 2 * 24 * 60 * 60 * 1000), // Predict paying 2 days early
        amount: Math.floor(Math.random() * 5000) + 500,
        status: 'Scheduled',
      },
    });
  }

  console.log('Created Invoices AP');

  // 7. Cashflow Forecasts
  const scenarios = ['Optimistic', 'Neutral', 'Pessimistic'];
  
  for (const scenario of scenarios) {
    const baseBalance = 100000;
    for (let i = 1; i <= 4; i++) { // 4 weeks ahead
       await prisma.cashflowForecast.create({
         data: {
           companyId: company.id,
           forecastDate: new Date(now.getTime() + i * 7 * 24 * 60 * 60 * 1000),
           predictedBalance: baseBalance + (scenario === 'Optimistic' ? 10000 * i : scenario === 'Pessimistic' ? -5000 * i : 2000 * i),
           confidenceLow: 90000,
           confidenceHigh: 150000,
           scenario: scenario,
         }
       });
    }
  }

  console.log('Created Cashflow Forecasts');

  // 8. Investments
  await prisma.investment.create({
    data: {
      companyId: company.id,
      fundId: 'MMF-VANGUARD-500',
      amountInvested: 75000.00,
      yieldRate: 4.85, // 4.85%
      startDate: new Date('2024-01-15'),
      status: 'Active',
    }
  });

  console.log('Created Investments');

  // 9. Vector Data (Simulated)
  await prisma.documentEmbedding.create({
    data: {
      sourceId: 'contract-abc-123',
      sourceType: 'PDF',
      content: 'This agreement is made between TechSolutions Inc and Alpha Corp regarding software licensing...',
    }
  });

  // Interaction Log
  await prisma.interactionLog.create({
    data: {
      userId: cfo.id,
      prompt: 'What is our projected cash flow for next month?',
      aiResponse: 'Based on current AR/AP, your projected balance is $145,000 with a 95% confidence interval.',
      userFeedback: 'Positive',
    }
  });

  console.log('Created Vector/AI logs');
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
