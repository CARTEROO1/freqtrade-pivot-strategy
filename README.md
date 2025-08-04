# 🚀 HappyCareer - Modern Job Platform

A comprehensive job platform built with Next.js, TypeScript, and Node.js that connects job seekers with employers through an intuitive and modern interface.

## ✨ Features

### For Job Seekers
- **Job Search & Discovery**: Advanced search with filters for location, job type, experience level
- **Job Details**: Comprehensive job information with company details, requirements, and benefits
- **Application Management**: Track application status and manage submissions
- **Profile Management**: Complete profile with skills, experience, and portfolio links
- **Saved Jobs**: Bookmark interesting positions for later review
- **Real-time Notifications**: Stay updated on application status changes

### For Employers
- **Job Posting**: Create detailed job listings with requirements, responsibilities, and benefits
- **Application Review**: Manage and review incoming applications
- **Company Profile**: Showcase company information and culture
- **Analytics Dashboard**: Track job performance and application metrics
- **Candidate Management**: Organize and communicate with applicants

### Platform Features
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Authentication**: Secure user registration and login with JWT
- **Role-based Access**: Different interfaces for job seekers and employers
- **Real-time Updates**: Live notifications and status updates
- **Mobile Responsive**: Optimized for all device sizes

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hooks** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Database Schema
- **Users** - Job seekers and employers
- **Companies** - Company information and profiles
- **Jobs** - Job postings with detailed information
- **Applications** - Job applications and status tracking
- **Saved Jobs** - User bookmarks
- **Notifications** - System notifications
- **Messages** - Communication between users

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ft_userdata
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend (.env)
   cd backend
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/happycareer"
   JWT_SECRET="your-secret-key"
   PORT=4000
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development servers**
   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - API Health Check: http://localhost:4000/health

## 📁 Project Structure

```
ft_userdata/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── jobs/        # Job listing and detail pages
│   │   │   ├── dashboard/   # User dashboard
│   │   │   ├── login/       # Authentication pages
│   │   │   ├── register/
│   │   │   └── post-job/    # Job posting for employers
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/          # UI components
│   │   │   ├── home/        # Home page components
│   │   │   └── blog/        # Blog components
│   │   └── types/           # TypeScript type definitions
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── scripts/         # Database scripts
│   │   └── types/           # TypeScript types
│   ├── prisma/              # Database schema and migrations
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/saved-jobs` - Get saved jobs

### Jobs
- `GET /api/jobs` - Get all jobs with filters
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create new job (employers only)
- `GET /api/jobs/my-jobs` - Get employer's posted jobs

### Applications
- `GET /api/applications` - Get user's applications
- `POST /api/applications` - Submit job application
- `PUT /api/applications/:id` - Update application status

### Companies
- `GET /api/companies` - Get companies
- `GET /api/companies/:id` - Get specific company
- `POST /api/companies` - Create company profile

## 🎨 UI Components

The application uses a modern design system with:
- **Color Scheme**: Blue and purple gradients with clean whites
- **Typography**: Clear hierarchy with readable fonts
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Comprehensive form validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper cross-origin resource sharing
- **Helmet.js**: Security headers middleware

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel or your preferred platform
```

### Backend Deployment
```bash
cd backend
npm run build
# Deploy to your preferred hosting service
```

### Database
- Use a managed PostgreSQL service (e.g., Supabase, Railway, or AWS RDS)
- Set up proper environment variables for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🎯 Roadmap

- [ ] Real-time messaging between employers and candidates
- [ ] Advanced analytics and reporting
- [ ] Resume parsing and matching
- [ ] Video interview integration
- [ ] Mobile app development
- [ ] AI-powered job recommendations
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Social media integration

---

Built with ❤️ for the modern job market 