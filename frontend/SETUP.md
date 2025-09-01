# 🎨 Oren ESG Frontend Setup

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd F:\WEBDEV\Oren\frontend
npm install
```

### 2. Environment Setup
Create `.env.local` file in the frontend root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start Development Server
```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## 🎯 Features Implemented

### ✅ **Authentication System**
- **Login Page**: `/auth/login`
- **Registration Page**: `/auth/register`
- **JWT Token Management**: Automatic token handling
- **Protected Routes**: Dashboard, questionnaire, reports
- **Auth Context**: Global authentication state

### ✅ **Design System**
- **Oren Color Theme**: Teal/turquoise matching orennow.com
- **Tailwind CSS**: Custom utility classes
- **Responsive Design**: Mobile-first approach
- **Component Library**: Reusable UI components

### ✅ **Layout Components**
- **Navbar**: Responsive navigation with auth state
- **Footer**: Company information and links
- **Layout Wrapper**: Consistent page structure

### ✅ **Pages Implemented**
- **Home Page**: Landing page with features
- **Dashboard**: ESG metrics overview with charts
- **Login/Register**: Authentication forms
- **Protected Routes**: Auth-required pages

### ✅ **API Integration**
- **Axios Setup**: HTTP client with interceptors
- **Error Handling**: Toast notifications
- **Authentication**: Token management
- **ESG Data**: CRUD operations

## 🎨 **Design Theme**

### **Color Palette (Oren Theme)**
```css
Primary Colors (Teal):
- primary-50: #f0fdfa
- primary-100: #ccfbf1
- primary-500: #14b8a6 (main brand color)
- primary-600: #0d9488

Secondary Colors:
- Gray scale for text and backgrounds
- Success: Green tones
- Warning: Amber tones
- Error: Red tones
```

### **Typography**
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, gradient text for emphasis
- **Body**: Clean, readable text

### **Components**
- **Buttons**: Primary, secondary, ghost variants
- **Cards**: Soft shadows and rounded corners
- **Forms**: Clean inputs with focus states
- **Charts**: Recharts with brand colors

## 📱 **Responsive Design**

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl
- **Navigation**: Collapsible mobile menu
- **Layout**: Flexible grid systems

## 🔧 **Project Structure**

```
frontend/src/
├── components/
│   └── Layout/
│       ├── Layout.tsx      # Main layout wrapper
│       ├── Navbar.tsx      # Navigation component
│       └── Footer.tsx      # Footer component
├── hooks/
│   └── useAuth.ts          # Authentication hook
├── pages/
│   ├── index.tsx           # Home page
│   ├── dashboard.tsx       # Dashboard page
│   ├── auth/
│   │   ├── login.tsx       # Login page
│   │   └── register.tsx    # Registration page
│   └── _app.tsx            # App wrapper with providers
├── styles/
│   └── globals.css         # Global styles and utilities
└── utils/
    └── api.ts              # API utilities and configurations
```

## 🚀 **Next Steps to Complete**

### **Pages to Add:**
1. **ESG Questionnaire**: `/questionnaire`
   - Multi-step form for ESG data entry
   - Real-time metric calculations
   - Save/update functionality

2. **Reports Page**: `/reports`
   - Data visualization
   - PDF export functionality
   - Historical comparisons

3. **Profile/Settings**: `/profile`
   - User account management
   - Preferences

### **Features to Add:**
1. **Charts & Visualizations**
   - More chart types (pie, line, bar)
   - Interactive dashboards
   - Data filtering

2. **Export Functionality**
   - PDF report generation
   - Excel export
   - Data download

3. **Advanced Features**
   - Dark mode toggle
   - Notifications
   - Search functionality

## 🧪 **Testing the Frontend**

### **1. Start Backend First**
```bash
cd F:\WEBDEV\Oren\backend
npm run dev
```

### **2. Start Frontend**
```bash
cd F:\WEBDEV\Oren\frontend
npm run dev
```

### **3. Test Flow**
1. Visit `http://localhost:3000`
2. Click "Sign Up" to register
3. Login with credentials
4. View dashboard (empty state initially)
5. Navigate through pages

## 🔌 **API Integration**

The frontend is configured to connect to:
- **Backend URL**: `http://localhost:8000`
- **API Endpoints**: All backend routes are integrated
- **Authentication**: JWT tokens with cookies
- **Error Handling**: Toast notifications for errors

## 🎯 **Build Commands**

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 🌟 **Key Features**

### **Authentication**
- ✅ JWT token management
- ✅ Protected routes
- ✅ Auto-redirect on auth state change
- ✅ Persistent login state

### **UI/UX**
- ✅ Oren brand colors and theme
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications

### **Data Management**
- ✅ API integration
- ✅ State management
- ✅ Form validation
- ✅ Real-time updates

The frontend is now ready for development and testing! 🎉
