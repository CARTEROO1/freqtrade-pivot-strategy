# Supabase Setup Guide for HappyCareer

This guide will help you set up Supabase as the backend for your HappyCareer platform.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `happycareer`
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## 3. Set Up Environment Variables

Create a `.env.local` file in your `frontend` directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=HappyCareer
```

## 4. Set Up the Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire content from `supabase/schema.sql`
3. Paste it into the SQL editor and click "Run"

This will create:
- All necessary tables (users, jobs, blog_posts, scam_reports, etc.)
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for automatic updates

## 5. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure your site URL: `http://localhost:3000`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
4. Enable email confirmations (optional)
5. Configure social providers if needed

## 6. Set Up Storage (Optional)

1. Go to **Storage** in your Supabase dashboard
2. Create buckets:
   - `avatars` (for user profile pictures)
   - `resumes` (for job application resumes)
   - `company-logos` (for company logos)
   - `blog-images` (for blog post images)

3. Set up storage policies in the SQL editor:

```sql
-- Allow public read access to avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow users to update their own avatars
CREATE POLICY "Users can update own avatars" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 7. Seed the Database (Optional)

You can add sample data to test your application:

```sql
-- Insert sample companies
INSERT INTO public.companies (name, description, website, industry, size, location, contact_email, is_verified) VALUES
('TechCorp', 'Leading technology company', 'https://techcorp.com', 'Technology', 'large', 'San Francisco, CA', 'hr@techcorp.com', true),
('StartupXYZ', 'Innovative startup', 'https://startupxyz.com', 'Technology', 'startup', 'New York, NY', 'jobs@startupxyz.com', false),
('GlobalLaw', 'International law firm', 'https://globallaw.com', 'Legal', 'large', 'London, UK', 'careers@globallaw.com', true);

-- Insert sample jobs
INSERT INTO public.jobs (title, company_name, location, type, salary_min, salary_max, description, requirements, benefits, skills, remote_work, experience_level, is_verified) VALUES
('Senior Software Engineer', 'TechCorp', 'San Francisco, CA', 'full-time', 120000, 180000, 'Build scalable applications...', ARRAY['5+ years experience', 'React/Node.js'], ARRAY['Health insurance', '401k'], ARRAY['JavaScript', 'React', 'Node.js'], true, 'senior', true),
('Frontend Developer', 'StartupXYZ', 'New York, NY', 'full-time', 80000, 120000, 'Create beautiful user interfaces...', ARRAY['2+ years experience', 'React'], ARRAY['Flexible hours', 'Remote work'], ARRAY['React', 'TypeScript', 'CSS'], true, 'mid', false),
('Legal Assistant', 'GlobalLaw', 'London, UK', 'full-time', 45000, 65000, 'Support legal team...', ARRAY['Bachelor degree', 'Legal experience'], ARRAY['Health insurance', 'Pension'], ARRAY['Legal research', 'Documentation'], false, 'entry', true);

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, excerpt, content, category, author, author_id, status, featured, tags, urgency_level) VALUES
('🚨 URGENT: New Job Scam Targeting Recent Graduates', 'A sophisticated scam is targeting recent graduates...', 'Full content here...', 'scam-alert', 'Safety Team', '00000000-0000-0000-0000-000000000000', 'published', true, ARRAY['scam', 'graduates', 'urgent'], 'critical'),
('How to Verify a Company Before Accepting a Job Offer', 'Essential steps to research and verify potential employers...', 'Full content here...', 'safety-tips', 'Career Safety Expert', '00000000-0000-0000-0000-000000000000', 'published', true, ARRAY['verification', 'research', 'employers'], 'medium');
```

## 8. Test the Integration

1. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Test the blog section and job features
3. Try creating a new blog post using the floating action button
4. Check that data is being saved to Supabase

## 9. Deploy to Production

When deploying to production:

1. Update your environment variables with production URLs
2. Set up a production Supabase project
3. Configure custom domains if needed
4. Set up monitoring and alerts

## 10. Security Best Practices

1. **Row Level Security**: All tables have RLS enabled with appropriate policies
2. **API Keys**: Never expose your service role key in the frontend
3. **Environment Variables**: Keep sensitive data in environment variables
4. **Input Validation**: Always validate user input
5. **Rate Limiting**: Consider implementing rate limiting for API calls

## 11. Monitoring and Analytics

1. Use Supabase Dashboard to monitor:
   - Database performance
   - API usage
   - Authentication events
   - Storage usage

2. Set up alerts for:
   - High error rates
   - Unusual traffic patterns
   - Storage limits

## 12. Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your domain is added to Supabase settings
2. **RLS Policy Errors**: Check that your policies allow the operations you're trying to perform
3. **Authentication Issues**: Verify your redirect URLs are correct
4. **Database Connection**: Ensure your environment variables are set correctly

### Debug Commands:

```bash
# Check if Supabase is connected
curl -I https://your-project-ref.supabase.co/rest/v1/

# Test authentication
curl -X POST https://your-project-ref.supabase.co/auth/v1/signup \
  -H "apikey: your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 13. Next Steps

1. Implement user authentication flows
2. Add real-time features using Supabase subscriptions
3. Set up email notifications
4. Add file upload functionality
5. Implement advanced search and filtering
6. Add analytics and reporting features

## Support

If you encounter issues:
1. Check the [Supabase documentation](https://supabase.com/docs)
2. Visit the [Supabase community](https://github.com/supabase/supabase/discussions)
3. Review the [HappyCareer documentation](./README.md)

---

**Note**: This setup provides a solid foundation for your HappyCareer platform. The database schema includes all necessary tables for jobs, blog posts, scam reports, user management, and more. The RLS policies ensure data security while allowing appropriate access levels. 