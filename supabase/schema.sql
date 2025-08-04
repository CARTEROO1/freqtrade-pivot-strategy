-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'internship');
CREATE TYPE experience_level AS ENUM ('entry', 'mid', 'senior', 'executive');
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE user_role AS ENUM ('job_seeker', 'employer', 'admin', 'safety_expert');
CREATE TYPE application_status AS ENUM ('applied', 'reviewing', 'interviewing', 'offered', 'rejected', 'withdrawn');
CREATE TYPE company_size AS ENUM ('startup', 'small', 'medium', 'large', 'enterprise');
CREATE TYPE blog_category AS ENUM ('scam-alert', 'safety-tips', 'career-guidance', 'student-resources');
CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE scam_category AS ENUM ('job_scam', 'loan_scam', 'education_scam', 'other');
CREATE TYPE scam_status AS ENUM ('pending', 'investigating', 'confirmed', 'resolved');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'job_seeker',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{
        "job_alerts": true,
        "scam_alerts": true,
        "newsletter": true,
        "email_notifications": true
    }',
    profile JSONB DEFAULT '{
        "bio": null,
        "skills": [],
        "experience_years": 0,
        "education": [],
        "location": "",
        "phone": null,
        "linkedin": null,
        "portfolio": null
    }'
);

-- Companies table
CREATE TABLE public.companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT NOT NULL,
    industry TEXT NOT NULL,
    size company_size NOT NULL,
    founded_year INTEGER,
    location TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    created_by UUID REFERENCES public.users(id)
);

-- Jobs table
CREATE TABLE public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    location TEXT NOT NULL,
    type job_type NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deadline TIMESTAMP WITH TIME ZONE,
    is_verified BOOLEAN DEFAULT FALSE,
    urgency_level urgency_level DEFAULT 'medium',
    applicants_count INTEGER DEFAULT 0,
    skills TEXT[] DEFAULT '{}',
    company_logo TEXT,
    remote_work BOOLEAN DEFAULT FALSE,
    experience_level experience_level DEFAULT 'entry',
    created_by UUID REFERENCES public.users(id),
    status TEXT DEFAULT 'active'
);

-- Blog posts table
CREATE TABLE public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category blog_category NOT NULL,
    author TEXT NOT NULL,
    author_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_time TEXT DEFAULT '5 min read',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    urgency_level urgency_level DEFAULT 'medium',
    status blog_status DEFAULT 'draft'
);

-- Job applications table
CREATE TABLE public.job_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status application_status DEFAULT 'applied',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cover_letter TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    references TEXT[] DEFAULT '{}',
    notes TEXT,
    UNIQUE(job_id, user_id)
);

-- Scam reports table
CREATE TABLE public.scam_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category scam_category NOT NULL,
    severity urgency_level NOT NULL,
    reported_by UUID REFERENCES public.users(id),
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status scam_status DEFAULT 'pending',
    evidence_urls TEXT[] DEFAULT '{}',
    company_name TEXT,
    contact_info TEXT,
    financial_loss DECIMAL(10,2),
    location TEXT,
    tags TEXT[] DEFAULT '{}'
);

-- Blog likes table (for tracking who liked what)
CREATE TABLE public.blog_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Job bookmarks table
CREATE TABLE public.job_bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- Company reviews table
CREATE TABLE public.company_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX idx_jobs_location ON public.jobs(location);
CREATE INDEX idx_jobs_type ON public.jobs(type);
CREATE INDEX idx_jobs_posted_at ON public.jobs(posted_at);
CREATE INDEX idx_jobs_urgency ON public.jobs(urgency_level);
CREATE INDEX idx_jobs_skills ON public.jobs USING GIN(skills);
CREATE INDEX idx_jobs_remote ON public.jobs(remote_work);

CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_created_at ON public.blog_posts(created_at);
CREATE INDEX idx_blog_posts_featured ON public.blog_posts(featured);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

CREATE INDEX idx_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_applications_user_id ON public.job_applications(user_id);
CREATE INDEX idx_applications_status ON public.job_applications(status);

CREATE INDEX idx_scam_reports_category ON public.scam_reports(category);
CREATE INDEX idx_scam_reports_severity ON public.scam_reports(severity);
CREATE INDEX idx_scam_reports_status ON public.scam_reports(status);
CREATE INDEX idx_scam_reports_reported_at ON public.scam_reports(reported_at);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scam_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Jobs policies (public read, authenticated write)
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create jobs" ON public.jobs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Job creators can update their jobs" ON public.jobs
    FOR UPDATE USING (auth.uid() = created_by);

-- Blog posts policies
CREATE POLICY "Blog posts are viewable by everyone" ON public.blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can create blog posts" ON public.blog_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update their blog posts" ON public.blog_posts
    FOR UPDATE USING (auth.uid() = author_id);

-- Job applications policies
CREATE POLICY "Users can view their own applications" ON public.job_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create applications" ON public.job_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON public.job_applications
    FOR UPDATE USING (auth.uid() = user_id);

-- Scam reports policies
CREATE POLICY "Scam reports are viewable by everyone" ON public.scam_reports
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create scam reports" ON public.scam_reports
    FOR INSERT WITH CHECK (auth.uid() = reported_by);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_job_applications_updated_at 
    BEFORE UPDATE ON public.job_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON public.blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_reviews_updated_at 
    BEFORE UPDATE ON public.company_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update job applicants count
CREATE OR REPLACE FUNCTION update_job_applicants_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.jobs 
        SET applicants_count = applicants_count + 1 
        WHERE id = NEW.job_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.jobs 
        SET applicants_count = applicants_count - 1 
        WHERE id = OLD.job_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for job applicants count
CREATE TRIGGER update_job_applicants_count_trigger
    AFTER INSERT OR DELETE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION update_job_applicants_count();

-- Function to update blog post likes count
CREATE OR REPLACE FUNCTION update_blog_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.blog_posts 
        SET likes = likes + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.blog_posts 
        SET likes = likes - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger for blog likes count
CREATE TRIGGER update_blog_likes_count_trigger
    AFTER INSERT OR DELETE ON public.blog_likes
    FOR EACH ROW EXECUTE FUNCTION update_blog_likes_count(); 