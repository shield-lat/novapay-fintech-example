import { prisma } from './prisma';

/**
 * Obtiene el resumen financiero de la empresa (Saldo Total, Ingresos, Gastos).
 * Asume que hay una empresa principal (o toma la primera encontrada).
 */
export async function getFinancialSummary() {
  try {
    const company = await prisma.company.findFirst({
      include: {
        linkedAccounts: true,
        billing: true
      }
    });

    if (!company) return { error: "Empresa no encontrada" };

    const totalBalance = company.linkedAccounts.reduce((sum, acc) => sum + Number(acc.currentBalance), 0);
    
    // Calcular Ingresos y Gastos del último mes
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTransactions = await prisma.transaction.findMany({
      where: {
        account: { companyId: company.id },
        transactionDate: { gte: thirtyDaysAgo }
      }
    });

    const income = recentTransactions
      .filter(t => t.direction === 'Credit')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = recentTransactions
      .filter(t => t.direction === 'Debit')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      companyName: company.legalName,
      totalBalance: totalBalance.toFixed(2),
      monthlyIncome: income.toFixed(2),
      monthlyExpenses: expenses.toFixed(2),
      currency: "PEN/USD Mix" // Simplificación
    };
  } catch (error) {
    console.error("Error fetching summary:", error);
    return { error: "Error al obtener resumen" };
  }
}

/**
 * Obtiene las transacciones más recientes.
 */
export async function getRecentTransactions(limit = 5) {
  try {
    const transactions = await prisma.transaction.findMany({
      take: limit,
      orderBy: { transactionDate: 'desc' },
      include: {
        account: {
          select: { bankName: true }
        }
      }
    });

    return transactions.map(t => ({
      date: t.transactionDate.toISOString().split('T')[0],
      merchant: t.merchantName,
      amount: Number(t.amount).toFixed(2),
      type: t.direction,
      category: t.category,
      bank: t.account.bankName
    }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

/**
 * Obtiene el resumen de cuentas por cobrar (quién debe dinero).
 */
export async function getReceivables() {
  try {
    const invoices = await prisma.invoiceAR.findMany({
      where: { status: 'Pendiente' }, // O 'Outstanding' según el seed
      orderBy: { amount: 'desc' },
      take: 5
    });

    const totalPending = await prisma.invoiceAR.aggregate({
      where: { status: 'Pendiente' },
      _sum: { amount: true }
    });

    return {
      totalPending: Number(totalPending._sum.amount || 0).toFixed(2),
      topDebtors: invoices.map(i => ({
        customer: i.customerName,
        amount: Number(i.amount).toFixed(2),
        dueDate: i.dueDate.toISOString().split('T')[0],
        probability: i.paymentProbability
      }))
    };
  } catch (error) {
    console.error("Error fetching receivables:", error);
    return { error: "Error obteniendo cuentas por cobrar" };
  }
}

/**
 * Obtiene la proyección de flujo de caja.
 */
export async function getCashflowProjection() {
  try {
    const forecasts = await prisma.cashflowForecast.findMany({
      where: { scenario: 'Neutro' },
      orderBy: { forecastDate: 'asc' },
      take: 4 // Próximo mes (4 semanas)
    });

    return forecasts.map(f => ({
      date: f.forecastDate.toISOString().split('T')[0],
      predictedBalance: Number(f.predictedBalance).toFixed(2),
      scenario: f.scenario
    }));
  } catch (error) {
    console.error("Error fetching forecast:", error);
    return [];
  }
}

