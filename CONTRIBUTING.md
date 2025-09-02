# Contributing to Oren ESG

Thank you for your interest in contributing to Oren ESG! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git
- Basic knowledge of React, Next.js, and Express.js

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/Oren.git
   cd Oren
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Configure your database URL and secrets
   npm run db:push
   npm run db:seed
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📝 Contribution Guidelines

### Code Style
- Use TypeScript for new code
- Follow existing naming conventions
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages
Follow conventional commits format:
```
type(scope): description

feat(auth): add password reset functionality
fix(api): resolve user registration validation bug
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests for new features
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Backend tests
   cd backend && npm test
   
   # Frontend build test
   cd frontend && npm run build
   ```

4. **Submit Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Ensure all checks pass

## 🐛 Reporting Bugs

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, etc.)

## 💡 Feature Requests

For feature requests:
- Describe the feature clearly
- Explain the use case and benefits
- Consider backward compatibility
- Provide mockups or examples if helpful

## 📚 Documentation

Help improve documentation by:
- Fixing typos and grammar
- Adding examples and use cases
- Improving clarity and organization
- Translating to other languages

## 🧪 Testing

- Write unit tests for new functions
- Test API endpoints thoroughly
- Verify UI changes across different screen sizes
- Test with different data scenarios

## 📖 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🎯 Areas for Contribution

We especially welcome contributions in:
- **ESG Metrics**: Adding new calculation methods
- **Visualizations**: New chart types and dashboards
- **Export Features**: Additional export formats
- **Performance**: Optimization improvements
- **Documentation**: Tutorials and guides
- **Testing**: Unit and integration tests
- **Accessibility**: Improving accessibility features

## 💬 Community

Join our community discussions:
- GitHub Discussions for questions and ideas
- Issue tracker for bugs and feature requests

Thank you for contributing to Oren ESG! 🌱