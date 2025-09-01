import { prisma } from '../db/index.js';

class ESGService {
  // Create or update ESG response for a user and financial year
  static async createOrUpdate(userId, financialYear, data) {
    // Calculate auto-calculated metrics
    const calculatedMetrics = this.calculateMetrics(data);

    return await prisma.eSGResponse.upsert({
      where: {
        userId_financialYear: {
          userId,
          financialYear,
        },
      },
      update: {
        ...data,
        ...calculatedMetrics,
        updatedAt: new Date(),
      },
      create: {
        userId,
        financialYear,
        ...data,
        ...calculatedMetrics,
      },
    });
  }

  // Get all ESG responses for a user
  static async getByUserId(userId) {
    return await prisma.eSGResponse.findMany({
      where: { userId },
      orderBy: { financialYear: 'desc' },
    });
  }

  // Get ESG response for a specific user and financial year
  static async getByUserAndYear(userId, financialYear) {
    return await prisma.eSGResponse.findUnique({
      where: {
        userId_financialYear: {
          userId,
          financialYear,
        },
      },
    });
  }

  // Delete ESG response
  static async delete(userId, financialYear) {
    return await prisma.eSGResponse.delete({
      where: {
        userId_financialYear: {
          userId,
          financialYear,
        },
      },
    });
  }

  // Get all financial years for a user
  static async getFinancialYears(userId) {
    const responses = await prisma.eSGResponse.findMany({
      where: { userId },
      select: { financialYear: true },
      orderBy: { financialYear: 'desc' },
    });

    return responses.map(r => r.financialYear);
  }

  // Calculate auto-calculated metrics
  static calculateMetrics(data) {
    const metrics = {};

    // Carbon Intensity = (Carbon emissions / Total revenue) T CO2e / INR
    if (data.carbonEmissions && data.totalRevenue && data.totalRevenue > 0) {
      metrics.carbonIntensity = data.carbonEmissions / data.totalRevenue;
    }

    // Renewable Electricity Ratio = 100 * (Renewable electricity consumption / Total electricity consumption) %
    if (data.renewableElectricityConsumption && data.totalElectricityConsumption && data.totalElectricityConsumption > 0) {
      metrics.renewableElectricityRatio = (data.renewableElectricityConsumption / data.totalElectricityConsumption) * 100;
    }

    // Diversity Ratio = 100 * (Female Employees / Total Employees) %
    if (data.femaleEmployees && data.totalEmployees && data.totalEmployees > 0) {
      metrics.diversityRatio = (data.femaleEmployees / data.totalEmployees) * 100;
    }

    // Community Spend Ratio = 100 * (Community investment spend / Total Revenue) %
    if (data.communityInvestmentSpend && data.totalRevenue && data.totalRevenue > 0) {
      metrics.communitySpendRatio = (data.communityInvestmentSpend / data.totalRevenue) * 100;
    }

    return metrics;
  }

  // Get ESG metrics metadata
  static getMetricsMetadata() {
    return {
      environmental: [
        {
          key: 'totalElectricityConsumption',
          title: 'Total electricity consumption',
          type: 'number',
          unit: 'kWh',
        },
        {
          key: 'renewableElectricityConsumption',
          title: 'Renewable electricity consumption',
          type: 'number',
          unit: 'kWh',
        },
        {
          key: 'totalFuelConsumption',
          title: 'Total fuel consumption',
          type: 'number',
          unit: 'liters',
        },
        {
          key: 'carbonEmissions',
          title: 'Carbon emissions',
          type: 'number',
          unit: 'T CO2e',
        },
      ],
      social: [
        {
          key: 'totalEmployees',
          title: 'Total number of employees',
          type: 'number',
          unit: '',
        },
        {
          key: 'femaleEmployees',
          title: 'Number of female employees',
          type: 'number',
          unit: '',
        },
        {
          key: 'averageTrainingHours',
          title: 'Average training hours per employee (per year)',
          type: 'number',
          unit: '',
        },
        {
          key: 'communityInvestmentSpend',
          title: 'Community investment spend',
          type: 'number',
          unit: 'INR',
        },
      ],
      governance: [
        {
          key: 'independentBoardMembersPercent',
          title: '% of independent board members',
          type: 'number',
          unit: '%',
        },
        {
          key: 'hasDataPrivacyPolicy',
          title: 'Does the company have a data privacy policy?',
          type: 'dropdown',
          options: ['Yes', 'No'],
          unit: '',
        },
        {
          key: 'totalRevenue',
          title: 'Total Revenue',
          type: 'number',
          unit: 'INR',
        },
      ],
      autoCalculated: [
        {
          key: 'carbonIntensity',
          title: 'Carbon Intensity',
          formula: '(Carbon emissions / Total revenue)',
          unit: 'T CO2e / INR',
        },
        {
          key: 'renewableElectricityRatio',
          title: 'Renewable Electricity Ratio',
          formula: '100 * (Renewable electricity consumption / Total electricity consumption)',
          unit: '%',
        },
        {
          key: 'diversityRatio',
          title: 'Diversity Ratio',
          formula: '100 * (Female Employees / Total Employees)',
          unit: '%',
        },
        {
          key: 'communitySpendRatio',
          title: 'Community Spend Ratio',
          formula: '100 * (Community investment spend / Total Revenue)',
          unit: '%',
        },
      ],
    };
  }
}

export { ESGService };
