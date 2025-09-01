import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@example.com',
      fullName: 'Test User',
      password: hashedPassword,
    },
  });

  console.log('✅ Test user created:', testUser.email);

  // Create sample ESG data
  const sampleESGData = await prisma.eSGResponse.upsert({
    where: {
      userId_financialYear: {
        userId: testUser.id,
        financialYear: 2023,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      financialYear: 2023,
      totalElectricityConsumption: 1000000,
      renewableElectricityConsumption: 250000,
      totalFuelConsumption: 50000,
      carbonEmissions: 1500,
      totalEmployees: 100,
      femaleEmployees: 45,
      averageTrainingHours: 40,
      communityInvestmentSpend: 500000,
      independentBoardMembersPercent: 60,
      hasDataPrivacyPolicy: true,
      totalRevenue: 10000000,
      // Auto-calculated values will be computed by the service
      carbonIntensity: 0.00015, // 1500 / 10000000
      renewableElectricityRatio: 25, // (250000 / 1000000) * 100
      diversityRatio: 45, // (45 / 100) * 100
      communitySpendRatio: 5, // (500000 / 10000000) * 100
    },
  });

  console.log('✅ Sample ESG data created for year:', sampleESGData.financialYear);

  console.log('🎉 Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
