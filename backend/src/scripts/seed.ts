import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'TechCorp Solutions',
        description: 'Leading technology solutions provider specializing in AI and machine learning',
        website: 'https://techcorp.com',
        industry: 'Technology',
        size: 'LARGE',
        type: 'PRIVATE',
        founded: 2010,
        location: 'San Francisco, CA',
        address: '123 Tech Street, San Francisco, CA 94105',
        phone: '+1-555-0123',
        email: 'contact@techcorp.com',
        isVerified: true
      }
    }),
    prisma.company.create({
      data: {
        name: 'Legal Associates LLP',
        description: 'Premier law firm specializing in corporate law and intellectual property',
        website: 'https://legalassociates.com',
        industry: 'Legal Services',
        size: 'MEDIUM',
        type: 'PRIVATE',
        founded: 1995,
        location: 'New York, NY',
        address: '456 Legal Avenue, New York, NY 10001',
        phone: '+1-555-0456',
        email: 'info@legalassociates.com',
        isVerified: true
      }
    }),
    prisma.company.create({
      data: {
        name: 'Creative Studio',
        description: 'Award-winning design and creative agency',
        website: 'https://creativestudio.com',
        industry: 'Creative Services',
        size: 'SMALL',
        type: 'PRIVATE',
        founded: 2018,
        location: 'Los Angeles, CA',
        address: '789 Creative Blvd, Los Angeles, CA 90210',
        phone: '+1-555-0789',
        email: 'hello@creativestudio.com',
        isVerified: true
      }
    }),
    prisma.company.create({
      data: {
        name: 'DataFlow Analytics',
        description: 'Data analytics and business intelligence solutions',
        website: 'https://dataflow.com',
        industry: 'Data & Analytics',
        size: 'STARTUP',
        type: 'PRIVATE',
        founded: 2022,
        location: 'Austin, TX',
        address: '321 Data Drive, Austin, TX 73301',
        phone: '+1-555-0321',
        email: 'contact@dataflow.com',
        isVerified: false
      }
    })
  ]);

  console.log('✅ Companies created');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    // Job Seekers
    prisma.user.create({
      data: {
        email: 'john.doe@email.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1-555-0001',
        role: 'JOB_SEEKER',
        bio: 'Experienced software engineer with 5+ years in full-stack development',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        experience: 'MID',
        education: 'BS Computer Science, Stanford University',
        expectedSalary: 120000,
        availability: 'Immediate',
        isVerified: true
      }
    }),
    prisma.user.create({
      data: {
        email: 'sarah.smith@email.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Smith',
        phone: '+1-555-0002',
        role: 'JOB_SEEKER',
        bio: 'UX/UI Designer passionate about creating user-centered digital experiences',
        location: 'New York, NY',
        website: 'https://sarahsmith.design',
        linkedin: 'https://linkedin.com/in/sarahsmith',
        skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
        experience: 'JUNIOR',
        education: 'BA Design, Parsons School of Design',
        expectedSalary: 80000,
        availability: '2 weeks notice',
        isVerified: true
      }
    }),
    // Employers
    prisma.user.create({
      data: {
        email: 'hr@techcorp.com',
        password: hashedPassword,
        firstName: 'Michael',
        lastName: 'Johnson',
        phone: '+1-555-0003',
        role: 'EMPLOYER',
        position: 'HR Manager',
        department: 'Human Resources',
        companyId: companies[0].id,
        isVerified: true
      }
    }),
    prisma.user.create({
      data: {
        email: 'hiring@legalassociates.com',
        password: hashedPassword,
        firstName: 'Emily',
        lastName: 'Wilson',
        phone: '+1-555-0004',
        role: 'EMPLOYER',
        position: 'Recruitment Director',
        department: 'Talent Acquisition',
        companyId: companies[1].id,
        isVerified: true
      }
    })
  ]);

  console.log('✅ Users created');

  // Create sample jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Senior Software Engineer',
        description: 'We are looking for a talented Senior Software Engineer to join our growing team. You will be responsible for developing and maintaining high-quality software solutions.',
        requirements: [
          '5+ years of experience in software development',
          'Strong proficiency in JavaScript, React, and Node.js',
          'Experience with cloud platforms (AWS, Azure, or GCP)',
          'Knowledge of database design and SQL',
          'Excellent problem-solving and communication skills'
        ],
        responsibilities: [
          'Design and implement scalable software solutions',
          'Collaborate with cross-functional teams',
          'Mentor junior developers',
          'Participate in code reviews and technical discussions',
          'Contribute to architectural decisions'
        ],
        benefits: [
          'Competitive salary and equity',
          'Health, dental, and vision insurance',
          'Flexible work hours and remote work options',
          'Professional development opportunities',
          '401(k) matching'
        ],
        salary: {
          min: 120000,
          max: 180000,
          currency: 'USD'
        },
        type: 'FULL_TIME',
        experience: 'SENIOR',
        isRemote: true,
        location: 'San Francisco, CA',
        isUrgent: true,
        isFeatured: true,
        companyId: companies[0].id,
        postedById: users[2].id
      }
    }),
    prisma.job.create({
      data: {
        title: 'Corporate Attorney',
        description: 'Join our prestigious law firm as a Corporate Attorney. You will handle complex corporate transactions and provide legal counsel to our clients.',
        requirements: [
          'Juris Doctor (JD) degree from an accredited law school',
          'Active bar membership in New York',
          '3+ years of experience in corporate law',
          'Strong analytical and research skills',
          'Excellent written and verbal communication'
        ],
        responsibilities: [
          'Draft and review corporate documents',
          'Provide legal counsel on business transactions',
          'Conduct legal research and analysis',
          'Represent clients in negotiations',
          'Stay updated on relevant laws and regulations'
        ],
        benefits: [
          'Competitive salary with bonus structure',
          'Comprehensive health benefits',
          'Professional development and CLE credits',
          'Generous vacation and sick leave',
          '401(k) plan'
        ],
        salary: {
          min: 150000,
          max: 250000,
          currency: 'USD'
        },
        type: 'FULL_TIME',
        experience: 'MID',
        isRemote: false,
        location: 'New York, NY',
        isUrgent: false,
        isFeatured: true,
        companyId: companies[1].id,
        postedById: users[3].id
      }
    }),
    prisma.job.create({
      data: {
        title: 'UX/UI Designer',
        description: 'We are seeking a creative UX/UI Designer to help us create beautiful and functional user experiences for our digital products.',
        requirements: [
          '2+ years of experience in UX/UI design',
          'Proficiency in Figma, Sketch, or Adobe XD',
          'Strong portfolio demonstrating user-centered design',
          'Understanding of design principles and user psychology',
          'Experience with design systems and component libraries'
        ],
        responsibilities: [
          'Create user-centered design solutions',
          'Conduct user research and usability testing',
          'Design wireframes, prototypes, and high-fidelity mockups',
          'Collaborate with product managers and developers',
          'Maintain and evolve our design system'
        ],
        benefits: [
          'Competitive salary',
          'Health and wellness benefits',
          'Flexible work environment',
          'Professional development budget',
          'Creative and collaborative culture'
        ],
        salary: {
          min: 70000,
          max: 100000,
          currency: 'USD'
        },
        type: 'FULL_TIME',
        experience: 'JUNIOR',
        isRemote: true,
        location: 'Los Angeles, CA',
        isUrgent: false,
        isFeatured: false,
        companyId: companies[2].id,
        postedById: users[2].id
      }
    }),
    prisma.job.create({
      data: {
        title: 'Data Scientist',
        description: 'Join our data science team to help us extract insights from complex datasets and build predictive models.',
        requirements: [
          'Master\'s degree in Statistics, Mathematics, or related field',
          '3+ years of experience in data science',
          'Proficiency in Python, R, and SQL',
          'Experience with machine learning frameworks',
          'Strong statistical analysis skills'
        ],
        responsibilities: [
          'Develop and implement machine learning models',
          'Analyze large datasets to extract insights',
          'Create data visualizations and reports',
          'Collaborate with engineering teams',
          'Present findings to stakeholders'
        ],
        benefits: [
          'Competitive salary with equity',
          'Health, dental, and vision insurance',
          'Flexible work hours',
          'Conference and training budget',
          'Modern office with great amenities'
        ],
        salary: {
          min: 100000,
          max: 150000,
          currency: 'USD'
        },
        type: 'FULL_TIME',
        experience: 'MID',
        isRemote: false,
        location: 'Austin, TX',
        isUrgent: true,
        isFeatured: false,
        companyId: companies[3].id,
        postedById: users[2].id
      }
    })
  ]);

  console.log('✅ Jobs created');

  // Create sample applications
  const applications = await Promise.all([
    prisma.jobApplication.create({
      data: {
        jobId: jobs[0].id,
        applicantId: users[0].id,
        companyId: companies[0].id,
        coverLetter: 'I am excited to apply for the Senior Software Engineer position at TechCorp Solutions. With my 5+ years of experience in full-stack development and passion for creating scalable solutions, I believe I would be a great fit for your team.',
        expectedSalary: 140000,
        availability: 'Immediate',
        status: 'PENDING'
      }
    }),
    prisma.jobApplication.create({
      data: {
        jobId: jobs[2].id,
        applicantId: users[1].id,
        companyId: companies[2].id,
        coverLetter: 'As a UX/UI Designer with a passion for creating user-centered experiences, I am thrilled to apply for this position. I believe my skills in Figma and user research would be valuable to your team.',
        expectedSalary: 85000,
        availability: '2 weeks notice',
        status: 'REVIEWED'
      }
    })
  ]);

  console.log('✅ Applications created');

  // Create sample notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: 'APPLICATION_UPDATE',
        title: 'Application Status Updated',
        message: 'Your application for Senior Software Engineer at TechCorp Solutions has been reviewed.'
      }
    }),
    prisma.notification.create({
      data: {
        userId: users[1].id,
        type: 'NEW_JOB',
        title: 'New Job Match',
        message: 'A new UX/UI Designer position at Creative Studio matches your profile!'
      }
    })
  ]);

  console.log('✅ Notifications created');

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Created ${companies.length} companies, ${users.length} users, ${jobs.length} jobs, ${applications.length} applications, and ${notifications.length} notifications`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 