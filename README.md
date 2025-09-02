# 🌱 Oren ESG - Sustainability Data Management Platform

<div align="center">
  <img src="https://github.com/user-attachments/assets/864699dd-d50e-409a-bf04-9cceb51db8d3" alt="Oren ESG Homepage" width="800">
  
  <p><em>All Your Sustainability Data and Stakeholders Connected in One Place</em></p>

  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black.svg)](https://nextjs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue.svg)](https://postgresql.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://prisma.io/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC.svg)](https://tailwindcss.com/)

</div>

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🎯 ESG Metrics Supported](#-esg-metrics-supported)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📸 Screenshots](#-screenshots)
- [🛠️ Installation](#️-installation)
- [📚 API Documentation](#-api-documentation)
- [🔧 Development](#-development)
- [📊 Usage Examples](#-usage-examples)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Overview

**Oren ESG** is a comprehensive Environmental, Social, and Governance (ESG) questionnaire and sustainability data management platform. Built with modern web technologies, it provides organizations with powerful tools to track, analyze, and report their sustainability metrics across multiple financial years.

### 🎯 Key Highlights

- 📊 **Comprehensive ESG Tracking** - Track environmental, social, and governance metrics
- 🤖 **Auto-calculated Insights** - Automatically calculate key ratios and performance indicators
- 🔒 **Enterprise Security** - JWT-based authentication with robust security features
- 📈 **Multi-year Support** - Store and analyze data across multiple financial years
- 📄 **Export & Reports** - Generate PDF and Excel reports with beautiful visualizations
- 🌐 **Modern UI/UX** - Clean, responsive interface built with Next.js and Tailwind CSS

## ✨ Features

### 🌍 Environmental Tracking
- **Energy Consumption**: Total and renewable electricity consumption monitoring
- **Carbon Emissions**: Track T CO2e emissions with intensity calculations
- **Fuel Consumption**: Monitor total fuel usage across operations

### 👥 Social Impact Metrics
- **Workforce Analytics**: Total employees and diversity tracking
- **Training & Development**: Average training hours per employee
- **Community Investment**: Track social impact spending and initiatives

### 🏛️ Governance Metrics
- **Board Composition**: Monitor independent board member percentages
- **Data Privacy**: Track compliance with data privacy policies
- **Financial Performance**: Revenue tracking and governance metrics

### 🔍 Auto-calculated Key Performance Indicators
- **Carbon Intensity** (T CO2e / INR)
- **Renewable Energy Ratio** (%)
- **Diversity Ratio** (%)
- **Community Investment Ratio** (%)

## 🎯 ESG Metrics Supported

<table>
<tr>
<th>Category</th>
<th>Metrics</th>
<th>Auto-calculated KPIs</th>
</tr>
<tr>
<td><strong>🌱 Environmental</strong></td>
<td>
• Total electricity consumption (kWh)<br>
• Renewable electricity consumption (kWh)<br>
• Total fuel consumption (liters)<br>
• Carbon emissions (T CO2e)
</td>
<td>
• Carbon Intensity<br>
• Renewable Energy Ratio
</td>
</tr>
<tr>
<td><strong>👥 Social</strong></td>
<td>
• Total number of employees<br>
• Number of female employees<br>
• Training hours per employee/year<br>
• Community investment spend (INR)
</td>
<td>
• Diversity Ratio<br>
• Community Investment Ratio
</td>
</tr>
<tr>
<td><strong>🏛️ Governance</strong></td>
<td>
• % of independent board members<br>
• Data privacy policy compliance<br>
• Total Revenue (INR)
</td>
<td>
• Revenue Growth<br>
• Governance Score
</td>
</tr>
</table>

## 🏗️ Architecture

```
Oren ESG Platform
├── 🖥️  Frontend (Next.js + TypeScript)
│   ├── React Components & Pages
│   ├── Tailwind CSS Styling
│   ├── Chart.js Visualizations
│   └── PDF/Excel Export Utils
├── ⚙️  Backend (Node.js + Express)
│   ├── RESTful API Endpoints
│   ├── JWT Authentication
│   ├── Prisma ORM
│   └── PostgreSQL Database
└── 📊 Features
    ├── ESG Data Management
    ├── Auto-calculations
    ├── Multi-year Support
    └── Export Capabilities
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** database
- **npm** or **yarn** package manager

### 1-Minute Setup

```bash
# Clone the repository
git clone https://github.com/Sridhar1030/Oren.git
cd Oren

# Setup Backend
cd backend
npm install
cp env.example .env
# Configure your .env file with database credentials
npm run db:push
npm run dev

# Setup Frontend (in new terminal)
cd ../frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application!

## 📸 Screenshots

### 🏠 Homepage
<img src="https://github.com/user-attachments/assets/864699dd-d50e-409a-bf04-9cceb51db8d3" alt="Oren ESG Homepage" width="800">

*Beautiful, modern homepage showcasing key features and auto-calculated ESG metrics*

### 🔐 Authentication
<img src="https://github.com/user-attachments/assets/1b38d305-c206-4e2c-ba8d-3824df341d53" alt="Login Page" width="600">

*Clean, user-friendly login interface with demo credentials for easy testing*

### Key Interface Features:
- 🎨 **Modern Design**: Clean, professional interface with teal color scheme
- 📱 **Responsive Layout**: Works perfectly on all device sizes
- 🚀 **Smooth Animations**: Engaging hover effects and transitions
- ♿ **Accessibility**: Built with accessibility best practices
- 🌙 **User-friendly**: Intuitive navigation and clear call-to-actions

## 🛠️ Installation

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Environment configuration
cp env.example .env
```

Configure your `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/esg_questionnaire?schema=public"
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
REFRESH_TOKEN_EXPIRY=7d
```

```bash
# Database setup
npm run db:generate
npm run db:push
npm run db:seed    # Optional: Add sample data

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional)
cp env.local.example .env.local

# Start development server
npm run dev
```

## 📚 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | User registration |
| `POST` | `/api/v1/auth/login` | User login |
| `GET` | `/api/v1/auth/logout` | User logout |

### 📊 ESG Data Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/esg/metadata` | Get ESG metrics metadata (public) |
| `GET` | `/api/v1/esg/responses` | Get all user's ESG responses |
| `POST` | `/api/v1/esg/responses` | Save/update ESG response |
| `GET` | `/api/v1/esg/responses/:year` | Get ESG response for specific year |
| `DELETE` | `/api/v1/esg/responses/:year` | Delete ESG response |
| `GET` | `/api/v1/esg/years` | Get all financial years with data |
| `GET` | `/api/v1/esg/summary` | Get dashboard summary data |

### Example API Usage

#### Register User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "password": "securepassword"
  }'
```

#### Save ESG Response
```bash
curl -X POST http://localhost:8000/api/v1/esg/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "financialYear": 2023,
    "totalElectricityConsumption": 1000000,
    "renewableElectricityConsumption": 250000,
    "carbonEmissions": 1500,
    "totalEmployees": 100,
    "femaleEmployees": 45,
    "totalRevenue": 10000000,
    "hasDataPrivacyPolicy": true
  }'
```

## 🔧 Development

### Available Scripts

#### Backend
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
```

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 15.5.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcrypt

## 📊 Usage Examples

### 1. Creating an ESG Response

```javascript
const esgData = {
  financialYear: 2023,
  totalElectricityConsumption: 1000000,
  renewableElectricityConsumption: 250000,
  totalFuelConsumption: 50000,
  carbonEmissions: 1500,
  totalEmployees: 100,
  femaleEmployees: 45,
  avgTrainingHoursPerEmployee: 40,
  communityInvestmentSpend: 500000,
  independentBoardMembers: 60,
  hasDataPrivacyPolicy: true,
  totalRevenue: 10000000
};

// The system automatically calculates:
// - carbonIntensity: 0.00015 (1500 / 10000000)
// - renewableEnergyRatio: 25% (250000 / 1000000)
// - diversityRatio: 45% (45 / 100)
// - communityInvestmentRatio: 5% (500000 / 10000000)
```

### 2. Exporting Reports

```javascript
// PDF Export
import { downloadPDF } from '@/utils/exportUtils';
downloadPDF(summaryData, { companyName: 'Your Company' });

// Excel Export
import { downloadExcel } from '@/utils/exportUtils';
downloadExcel(summaryData, { companyName: 'Your Company' });
```

## 🔒 Security Features

- **🔐 JWT Authentication**: Secure token-based authentication
- **🛡️ Password Security**: bcrypt hashing for password protection
- **🚦 Rate Limiting**: Prevent API abuse with configurable limits
- **🔒 CORS Protection**: Configured Cross-Origin Resource Sharing
- **🛡️ Security Headers**: Helmet.js for security headers
- **✅ Input Validation**: Comprehensive input validation and sanitization

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
CORS_ORIGIN=https://yourdomain.com
ACCESS_TOKEN_SECRET=your_production_secret
REFRESH_TOKEN_SECRET=your_production_refresh_secret
```

### Build Commands
```bash
# Backend
npm run db:migrate
npm start

# Frontend
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🍴 Fork the repository**
2. **🌿 Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **💡 Make your changes**: Add your improvements
4. **✅ Test thoroughly**: Ensure all tests pass
5. **📝 Commit changes**: `git commit -m 'Add amazing feature'`
6. **🚀 Push to branch**: `git push origin feature/amazing-feature`
7. **🔄 Open a Pull Request**: Submit your changes for review

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all existing tests pass

## 📞 Support & Contact

- **📧 Email**: [sridharpillai75@gmail.com](mailto:sridharpillai75@gmail.com)
- **🐛 Issues**: [GitHub Issues](https://github.com/Sridhar1030/Oren/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/Sridhar1030/Oren/discussions)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by the Oren ESG Team</p>
  <p>
    <a href="#-table-of-contents">⬆️ Back to top</a>
  </p>
</div>