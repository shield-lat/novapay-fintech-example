const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando poblado de datos (Seeding) en ESPAÑOL ...');

  // 0. Limpiar datos existentes (para evitar duplicados o errores de unique constraint)
  // Borramos en orden inverso a la creación para respetar las llaves foráneas
  const deleteInteractionLogs = prisma.interactionLog.deleteMany();
  const deleteEmbeddings = prisma.documentEmbedding.deleteMany();
  const deleteFactoring = prisma.factoringLoan.deleteMany();
  const deleteInvestments = prisma.investment.deleteMany();
  const deleteTreasuryRules = prisma.treasuryRule.deleteMany();
  const deleteCashflow = prisma.cashflowForecast.deleteMany();
  const deleteInvoicesAR = prisma.invoiceAR.deleteMany();
  const deleteInvoicesAP = prisma.invoiceAP.deleteMany();
  const deleteTransactions = prisma.transaction.deleteMany();
  const deleteLinkedAccounts = prisma.linkedAccount.deleteMany();
  const deleteBilling = prisma.billing.deleteMany();
  const deleteUsers = prisma.user.deleteMany();
  const deleteCompanies = prisma.company.deleteMany();

  await prisma.$transaction([
    deleteInteractionLogs,
    deleteEmbeddings,
    deleteFactoring,
    deleteInvestments,
    deleteTreasuryRules,
    deleteCashflow,
    deleteInvoicesAR,
    deleteInvoicesAP,
    deleteTransactions,
    deleteLinkedAccounts,
    deleteBilling,
    deleteUsers,
    deleteCompanies
  ]);

  console.log('Base de datos limpiada.');

  // 1. Crear Empresa: NovaPay Latam S.A.C.
  const company = await prisma.company.create({
    data: {
      legalName: 'NovaPay Latam S.A.C.',
      taxId: 'RUC-20601234567',
      subscriptionTier: 'Enterprise',
      industrySector: 'Fintech / Tecnología',
      riskProfile: 'Bajo',
      billing: {
        create: {
          mrrAmount: 1500.00,
          extraFees: 120.50,
          status: 'Activo',
        }
      },
      treasuryRules: {
        create: {
          minOperatingCash: 150000.00, // Soles o Dólares
          investmentRiskTolerance: 'Medio',
          autoInvestEnabled: true,
        }
      }
    },
  });

  console.log(`Empresa creada: ${company.legalName} (ID: ${company.id})`);

  // 2. Crear Usuarios (Más usuarios)
  const usersData = [
    { name: 'Ana García', email: 'ana.garcia@novapay.lat', role: 'CFO', permissions: ['admin', 'aprobar_pagos', 'gestionar_inversiones'] },
    { name: 'Carlos Ruiz', email: 'carlos.ruiz@novapay.lat', role: 'Contador', permissions: ['lectura', 'crear_facturas'] },
    { name: 'Lucía Méndez', email: 'lucia.mendez@novapay.lat', role: 'Auditor', permissions: ['lectura_total'] },
    { name: 'Miguel Torres', email: 'miguel.torres@novapay.lat', role: 'Analista Financiero', permissions: ['ver_reportes', 'exportar_data'] }
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: {
        companyId: company.id,
        name: u.name,
        email: u.email,
        role: u.role,
        permissions: u.permissions,
      }
    });
    createdUsers.push(user);
  }

  console.log(`Creados ${createdUsers.length} usuarios.`);

  // 3. Crear Cuentas Bancarias Conectadas
  const accountsData = [
    { bank: 'Banco de Crédito (BCP)', type: 'Corriente', balance: 450000.00, currency: 'PEN' },
    { bank: 'Interbank', type: 'Ahorros', balance: 120000.50, currency: 'USD' },
    { bank: 'BBVA Continental', type: 'Recaudadora', balance: 85000.00, currency: 'PEN' }
  ];

  const createdAccounts = [];
  for (const acc of accountsData) {
    const account = await prisma.linkedAccount.create({
      data: {
        companyId: company.id,
        bankName: acc.bank,
        accountType: acc.type,
        currentBalance: acc.balance,
        currency: acc.currency,
        accessToken: `token_encriptado_${Math.random().toString(36).substring(7)}`,
      }
    });
    createdAccounts.push(account);
  }

  console.log(`Creadas ${createdAccounts.length} cuentas bancarias.`);

  // 4. Crear Transacciones (Volumen masivo: 800+)
  const categories = ['Ingresos Ventas', 'Nómina', 'Suscripción Software', 'Alquiler Oficina', 'Servicios Públicos', 'Marketing Digital', 'Servicios Legales', 'Consultoría', 'Reembolso Gastos', 'Mantenimiento', 'Impuestos SUNAT', 'Seguros'];
  const merchants = ['Cliente Final SAC', 'Planilla Gusto', 'AWS Servicios', 'WeWork Perú', 'Enel Distribución', 'Google Ads', 'Estudio Echecopar', 'McKinsey', 'Uber Corp', 'Sodexo', 'SUNAT', 'Rimac Seguros'];
  const directions = ['Credit', 'Debit', 'Debit', 'Debit', 'Debit', 'Debit', 'Debit', 'Debit', 'Debit', 'Debit', 'Debit', 'Debit']; 
  
  const transactions = [];
  const now = new Date();

  // Generar 800 transacciones distribuidas en los últimos 12 meses
  for (let i = 0; i < 800; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    const typeIndex = Math.floor(Math.random() * categories.length);
    const isCredit = directions[typeIndex] === 'Credit';
    
    // Montos más realistas y variados
    let amount;
    if (isCredit) {
        amount = Math.random() * 50000 + 10000; // Ingresos grandes
    } else {
        amount = Math.random() * 8000 + 200; // Gastos variados
    }

    // Asignar aleatoriamente a una de las cuentas creadas
    const randomAccount = createdAccounts[Math.floor(Math.random() * createdAccounts.length)];

    transactions.push({
      accountId: randomAccount.id,
      amount: Number(amount.toFixed(2)),
      direction: directions[typeIndex],
      category: categories[typeIndex],
      transactionDate: date,
      merchantName: merchants[typeIndex],
      status: Math.random() > 0.05 ? 'Procesado' : 'Pendiente', // 5% pendientes
      description: `Movimiento ${isCredit ? 'de' : 'a'} ${merchants[typeIndex]} - ${categories[typeIndex]}`,
    });
  }

  // Insertar en lotes de 100 para evitar límites de query
  const batchSize = 100;
  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, i + batchSize);
    await prisma.transaction.createMany({
      data: batch,
    });
  }

  console.log('Creadas 800+ transacciones históricas.');

  // 5. Crear Facturas por Cobrar (Invoices AR) - Clientes que deben dinero
  const clients = ['Minera del Sur S.A.', 'Agroexportadora Verde', 'Constructora Líder', 'Retail Perú SAC', 'Tech Solutions Latam', 'Grupo Gloria', 'Alicorp', 'Cementos Pacasmayo', 'Ferreyros', 'Antamina'];
  
  for (const client of clients) {
    // Crear múltiples facturas por cliente (5 a 15 facturas)
    const numInvoices = Math.floor(Math.random() * 10) + 5;
    
    for(let k=0; k < numInvoices; k++) {
        const isPaid = Math.random() > 0.5;
        const isOverdue = !isPaid && Math.random() > 0.7;
        
        await prisma.invoiceAR.create({
          data: {
            companyId: company.id,
            customerName: client,
            amount: Math.floor(Math.random() * 45000) + 2000,
            dueDate: new Date(now.getTime() + (Math.random() * 120 - 90) * 24 * 60 * 60 * 1000), // +/- 90 días
            paymentProbability: Math.floor(Math.random() * 40) + 60, // 60-100%
            collectionStage: isOverdue ? 'Cobranza Legal' : 'Correo Recordatorio 1',
            status: isPaid ? 'Pagado' : isOverdue ? 'Vencido' : 'Pendiente',
            // Si está pendiente y alta prob, sugerir factoring
            factoringLoan: (!isPaid && !isOverdue) ? {
              create: {
                 loanAmount: Math.floor(Math.random() * 10000) + 5000,
                 feeCharged: Math.floor(Math.random() * 500) + 100,
                 status: 'Desembolsado'
              }
            } : undefined
          },
        });
    }
  }

  console.log('Creadas masivamente Facturas por Cobrar (AR).');

  // 6. Crear Facturas por Pagar (Invoices AP) - Deudas con proveedores
  const suppliers = ['Microsoft Azure', 'Salesforce CRM', 'Oficina Top SA', 'Consultora Legal', 'Limpieza Total SAC', 'Seguridad Pro', 'Catering Express', 'Logística Rápida'];
  
  for (const supplier of suppliers) {
    // Crear historial de facturas pagadas y pendientes
    const numInvoices = Math.floor(Math.random() * 8) + 3;

    for(let k=0; k < numInvoices; k++) {
        const isPaid = Math.random() > 0.3;
        const dueDate = new Date(now.getTime() + (Math.random() * 60 - 30) * 24 * 60 * 60 * 1000);
        
        await prisma.invoiceAP.create({
        data: {
            companyId: company.id,
            vendorName: supplier,
            dueDate: dueDate,
            predictedPaymentDate: new Date(dueDate.getTime() - 3 * 24 * 60 * 60 * 1000), 
            amount: Math.floor(Math.random() * 12000) + 500,
            status: isPaid ? 'Pagado' : 'Programado',
        },
        });
    }
  }

  console.log('Creadas masivamente Facturas por Pagar (AP).');

  // 7. Pronósticos de Flujo de Caja (Cashflow Forecasts)
  const scenarios = ['Optimista', 'Neutro', 'Pesimista'];
  
  for (const scenario of scenarios) {
    const baseBalance = 450000; // Saldo base similar a la cuenta principal
    for (let i = 1; i <= 12; i++) { // 12 semanas a futuro
       const variation = (Math.random() * 20000) - 5000;
       const scenarioMod = scenario === 'Optimista' ? 15000 : scenario === 'Pesimista' ? -15000 : 0;
       
       await prisma.cashflowForecast.create({
         data: {
           companyId: company.id,
           forecastDate: new Date(now.getTime() + i * 7 * 24 * 60 * 60 * 1000),
           predictedBalance: baseBalance + (scenarioMod * i) + (variation * i),
           confidenceLow: baseBalance * 0.8,
           confidenceHigh: baseBalance * 1.2,
           scenario: scenario,
         }
       });
    }
  }

  console.log('Creados Pronósticos de Flujo de Caja.');

  // 8. Inversiones (Treasury)
  await prisma.investment.create({
    data: {
      companyId: company.id,
      fundId: 'Fondo-Liquidez-Soles-BCP',
      amountInvested: 200000.00,
      yieldRate: 6.50, // 6.5% Tasa anual
      startDate: new Date('2024-02-01'),
      status: 'Activo',
    }
  });
  
  await prisma.investment.create({
    data: {
      companyId: company.id,
      fundId: 'Bonos-Tesoro-Americano',
      amountInvested: 50000.00,
      yieldRate: 4.20, // 4.2% USD
      startDate: new Date('2023-11-15'),
      status: 'Activo',
    }
  });

  console.log('Creadas Inversiones.');

  // 9. Datos de Vectores (Simulados en Español)
  const documents = [
      'Este contrato establece los términos de servicio entre NovaPay Latam y Minera del Sur para el servicio de factoring...',
      'Acuerdo de confidencialidad (NDA) firmado el 20 de Enero de 2024 con Agroexportadora Verde...',
      'Póliza de seguros corporativos número 5599-22 cubriendo responsabilidad civil y daños a terceros...'
  ];

  for (const doc of documents) {
    await prisma.documentEmbedding.create({
        data: {
          sourceId: `doc-${Math.floor(Math.random()*1000)}`,
          sourceType: 'Contrato PDF',
          content: doc,
        }
      });
  }

  // Log de Interacción IA en Español
  await prisma.interactionLog.create({
    data: {
      userId: createdUsers[0].id, // La CFO
      prompt: '¿Cuál es nuestra proyección de caja para fin de mes considerando los pagos de nómina?',
      aiResponse: 'Basado en tus cuentas por cobrar y pagar, se proyecta un saldo de S/ 420,000. La nómina de S/ 85,000 está cubierta con un margen del 300%.',
      userFeedback: 'Útil',
    }
  });

  console.log('Creados Logs de IA y Vectores.');
  console.log('✅ SEED TERMINADO: Base de datos poblada en Español con éxito.');
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
