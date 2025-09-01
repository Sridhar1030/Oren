# ESG Questionnaire Backend API

A comprehensive backend API for ESG (Environmental, Social, and Governance) questionnaire management built with Node.js, Express, PostgreSQL, and Prisma ORM.

## 🚀 Features

- **User Authentication**: JWT-based authentication with access and refresh tokens
- **ESG Data Management**: Complete CRUD operations for ESG questionnaire responses
- **Auto-calculated Metrics**: Automatic calculation of key ESG ratios and indicators
- **Multi-year Support**: Store and manage ESG data across multiple financial years
- **Secure API**: Rate limiting, CORS, and security headers
- **PostgreSQL Database**: Reliable data storage with Prisma ORM

## 📊 ESG Metrics Supported

### Environmental
- Total electricity consumption (kWh)
- Renewable electricity consumption (kWh)
- Total fuel consumption (liters)
- Carbon emissions (T CO2e)

### Social
- Total number of employees
- Number of female employees
- Average training hours per employee per year
- Community investment spend (INR)

### Governance
- % of independent board members
- Data privacy policy (Yes/No)
- Total Revenue (INR)

### Auto-calculated Metrics
- Carbon Intensity (T CO2e / INR)
- Renewable Electricity Ratio (%)
- Diversity Ratio (%)
- Community Spend Ratio (%)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
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

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # (Optional) Seed with sample data
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:8000`

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/logout` - User logout (requires auth)

### ESG Data
- `GET /api/v1/esg/metadata` - Get ESG metrics metadata (public)
- `GET /api/v1/esg/responses` - Get all user's ESG responses (requires auth)
- `POST /api/v1/esg/responses` - Save/update ESG response (requires auth)
- `GET /api/v1/esg/responses/:year` - Get ESG response for specific year (requires auth)
- `DELETE /api/v1/esg/responses/:year` - Delete ESG response (requires auth)
- `GET /api/v1/esg/years` - Get all financial years with data (requires auth)
- `GET /api/v1/esg/summary` - Get dashboard summary data (requires auth)

### Utility
- `GET /health` - Health check endpoint

## 🔧 Database Commands

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with sample data
npm run db:seed
```

## 📝 Example API Usage

### Register User
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

### Login User
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

### Save ESG Response
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

## 🏗️ Project Structure

```
backend/
├── controllers/          # Request handlers
├── models/              # Database services and business logic
├── routes/              # API route definitions
├── middlewares/         # Custom middleware functions
├── utils/               # Utility functions
├── prisma/              # Database schema and migrations
├── db/                  # Database connection
├── app.js               # Express app configuration
├── index.js             # Server entry point
└── package.json         # Dependencies and scripts
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Security headers with Helmet
- Input validation and sanitization

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
CORS_ORIGIN=https://yourdomain.com
```

### Database Migration
```bash
npm run db:migrate
```

## 🧪 Testing

Test the API using the provided endpoints or tools like Postman, Insomnia, or curl.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support or questions, please contact the development team.
