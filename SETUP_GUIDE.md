# 🚀 HappyCareer - Complete Setup Guide

This guide will help you set up the complete HappyCareer platform with both frontend and backend components.

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (if not using Docker)
- Git

## 🏗️ Project Structure

```
happycareer/
├── frontend/                 # Next.js frontend application
├── backend/                  # Node.js/Express backend API
├── SETUP_GUIDE.md           # This file
└── README.md                # Project overview
```

## 🚀 Quick Start (Recommended)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd happycareer

# Copy environment files
cp backend/env.example backend/.env
```

### 2. Start with Docker (Easiest)

```bash
# Start the backend with database
cd backend
docker-compose up -d

# Install frontend dependencies
cd ../frontend
npm install

# Start frontend
npm run dev
```

### 3. Initialize Database

```bash
# In a new terminal, navigate to backend
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npm run db:seed
```

## 🔧 Manual Setup

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed database
   npm run db:seed
   ```

4. **Start Backend**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Create .env.local
   echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:4000/api" > .env.local
   ```

3. **Start Frontend**
   ```bash
   npm run dev
   ```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/health
- **Database**: localhost:5432 (if using Docker)

## 👥 Sample Users

After seeding the database, you can login with these accounts:

### Job Seekers
- **Email**: john.doe@email.com
- **Password**: password123

- **Email**: sarah.smith@email.com  
- **Password**: password123

### Employers
- **Email**: hr@techcorp.com
- **Password**: password123

- **Email**: hiring@legalassociates.com
- **Password**: password123

## 🔑 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/happycareer"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV="development"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000/api
```

## 📊 Database Schema

The platform includes these main entities:

- **Users**: Job seekers and employers
- **Companies**: Company profiles and information
- **Jobs**: Job postings with detailed requirements
- **Applications**: Job applications with status tracking
- **Notifications**: User notifications system
- **Messages**: Internal messaging system

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

## 🎨 Features

### For Job Seekers
- ✅ User registration and authentication
- ✅ Profile management
- ✅ Job search and filtering
- ✅ Job applications
- ✅ Application tracking
- ✅ Notifications
- ✅ Messaging with employers

### For Employers
- ✅ Company profile management
- ✅ Job posting
- ✅ Application management
- ✅ Candidate communication
- ✅ Analytics and insights

### General Features
- ✅ Beautiful theme system (5 themes)
- ✅ Responsive design
- ✅ Real-time notifications
- ✅ Search and filtering
- ✅ File upload support
- ✅ Email notifications (configurable)

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Set production environment variables
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
```

### 2. Database Migration
```bash
cd backend
npx prisma migrate deploy
```

### 3. Build Applications
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### 4. Deploy
- Use Docker for containerized deployment
- Or deploy to platforms like Vercel (frontend) and Railway (backend)
- Set up proper SSL certificates
- Configure environment variables

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check if PostgreSQL is running
   docker ps
   
   # Restart database
   docker-compose restart postgres
   ```

2. **Prisma Client Error**
   ```bash
   # Regenerate Prisma client
   npx prisma generate
   ```

3. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :4000
   
   # Kill the process or change port in .env
   ```

4. **CORS Errors**
   - Ensure FRONTEND_URL is set correctly in backend .env
   - Check that frontend is running on the expected port

### Logs
```bash
# Backend logs
cd backend
docker-compose logs -f

# Frontend logs
cd frontend
npm run dev
```

## 📈 Monitoring

- **Health Check**: http://localhost:4000/health
- **Database**: Use Prisma Studio (`npx prisma studio`)
- **Logs**: Check Docker logs or application logs

## 🔄 Development Workflow

1. **Backend Changes**
   ```bash
   cd backend
   npm run dev  # Auto-restart on changes
   ```

2. **Frontend Changes**
   ```bash
   cd frontend
   npm run dev  # Hot reload enabled
   ```

3. **Database Changes**
   ```bash
   cd backend
   npx prisma migrate dev  # Create new migration
   npx prisma generate     # Update client
   ```

## 🎯 Next Steps

1. **Customization**
   - Modify themes in `frontend/src/styles/themes.css`
   - Update branding and colors
   - Add custom components

2. **Features**
   - Implement file upload for resumes
   - Add email notifications
   - Create admin dashboard
   - Add analytics and reporting

3. **Deployment**
   - Set up CI/CD pipeline
   - Configure monitoring and logging
   - Set up backup strategies
   - Implement security best practices

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review the API documentation
- Check the logs for error messages
- Ensure all environment variables are set correctly

---

**🎉 Congratulations! Your HappyCareer platform is now fully functional!**

Law firm clients and other users can now:
- ✅ Register and create accounts
- ✅ Save their profiles and preferences
- ✅ Post and manage job listings
- ✅ Apply for jobs and track applications
- ✅ Communicate through the messaging system
- ✅ Receive notifications
- ✅ Use the beautiful theme system 