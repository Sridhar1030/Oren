# 🐘 PostgreSQL Setup with Prisma ORM

## 🎯 **Choose Your PostgreSQL Option**

### **Option 1: Local PostgreSQL (Development)**

#### Install PostgreSQL Locally
1. **Download PostgreSQL**: https://www.postgresql.org/download/
2. **Install** with default settings
3. **Remember your password** for the `postgres` user

#### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE esg_questionnaire;

# Exit
\q
```

#### Update .env file
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/esg_questionnaire?schema=public"
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here_make_it_long_and_random
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here_make_it_different_from_access
REFRESH_TOKEN_EXPIRY=7d
```

### **Option 2: Cloud PostgreSQL (Recommended)**

#### A. Railway (Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd F:\WEBDEV\Oren\backend
railway init

# Add PostgreSQL database
railway add postgresql

# Deploy
railway up
```

#### B. Supabase (Free PostgreSQL)
1. Go to https://supabase.com
2. Create new project
3. Copy DATABASE_URL from Settings > Database
4. Update your .env file

#### C. Neon (Serverless PostgreSQL)
1. Go to https://neon.tech
2. Create database
3. Copy connection string
4. Update your .env file

## 🚀 **Setup Commands**

### 1. Update Package Dependencies
```bash
cd F:\WEBDEV\Oren\backend

# Install PostgreSQL client (if not already installed)
npm install pg
npm install -D @types/pg
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Create Database Tables
```bash
# Push schema to database
npx prisma db push

# OR use migrations (recommended for production)
npx prisma migrate dev --name init
```

### 4. Seed Database (Optional)
```bash
npx prisma db seed
```

### 5. Start Server
```bash
npm run dev
```

## 🔧 **Environment Configuration**

Create `.env` file in `F:\WEBDEV\Oren\backend\`:

### For Local PostgreSQL:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/esg_questionnaire?schema=public"
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here_make_it_long_and_random_12345678901234567890
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here_make_it_different_from_access_09876543210987654321
REFRESH_TOKEN_EXPIRY=7d
```

### For Cloud PostgreSQL:
```env
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here_make_it_long_and_random_12345678901234567890
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here_make_it_different_from_access_09876543210987654321
REFRESH_TOKEN_EXPIRY=7d
```

## 📊 **View PostgreSQL Database**

### Option 1: Prisma Studio
```bash
npx prisma studio
```
Opens at http://localhost:5555

### Option 2: pgAdmin (PostgreSQL GUI)
1. Download pgAdmin: https://www.pgadmin.org/
2. Connect using your database credentials

### Option 3: VS Code Extension
Install "PostgreSQL" extension in VS Code

### Option 4: Command Line
```bash
psql -U postgres -d esg_questionnaire
\dt  # List tables
SELECT * FROM users;
\q   # Quit
```

## 🧪 **Test PostgreSQL Setup**

### 1. Health Check
```bash
curl -X GET http://localhost:8000/health
```

### 2. Register User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "pguser",
    "email": "pg@example.com",
    "fullName": "PostgreSQL User",
    "password": "pgpassword123"
  }'
```

### 3. Login User
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pg@example.com",
    "password": "pgpassword123"
  }'
```

### 4. Save ESG Data
```bash
curl -X POST http://localhost:8000/api/v1/esg/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "financialYear": 2023,
    "totalElectricityConsumption": 1500000,
    "renewableElectricityConsumption": 400000,
    "carbonEmissions": 2000,
    "totalEmployees": 120,
    "femaleEmployees": 60,
    "totalRevenue": 12000000,
    "hasDataPrivacyPolicy": true
  }'
```

## 🔄 **Migration from SQLite**

If you have existing SQLite data:

### 1. Export SQLite Data
```bash
# Install sqlite3 if needed
npm install sqlite3

# Create export script
node -e "
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./prisma/dev.db');
db.all('SELECT * FROM users', (err, rows) => {
  console.log(JSON.stringify(rows, null, 2));
});
"
```

### 2. Import to PostgreSQL
Use the exported data to create INSERT statements for PostgreSQL

## ⚡ **Quick Start Commands**

```bash
# Complete setup in one go
cd F:\WEBDEV\Oren\backend

# 1. Create .env file (manually with your DATABASE_URL)

# 2. Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# 3. Start server
npm run dev

# 4. Test
curl http://localhost:8000/health
```

## 🌐 **Production Deployment**

For production, use cloud PostgreSQL:

### Railway (Recommended)
```bash
railway login
railway init
railway add postgresql
railway up
```

Your app will be live with PostgreSQL database!

## ✅ **Benefits of PostgreSQL over SQLite**

1. ✅ **Production Ready**: Handles concurrent users
2. ✅ **Cloud Compatible**: Works with all hosting platforms
3. ✅ **Advanced Features**: JSON columns, full-text search, etc.
4. ✅ **Scalable**: Can handle large datasets
5. ✅ **ACID Compliant**: Better data integrity
6. ✅ **Team Collaboration**: Multiple developers can connect
7. ✅ **Backup & Recovery**: Built-in backup solutions

## 🆘 **Troubleshooting**

### Connection Issues:
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Check firewall settings
- Verify credentials

### Permission Issues:
```bash
# Grant permissions
psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE esg_questionnaire TO your_user;
```

### Reset Database:
```bash
npx prisma db push --force-reset
npx prisma db seed
```
