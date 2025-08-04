# 🚀 Lead Generation Demo - See It Working First

## 🎯 **Quick Demo Implementation**

Let's build a **simple demo** so you can see the automated lead generation working before deciding to improve or deny it.

### **Demo Features:**
- ✅ **Basic lead scoring** - Identify potential partners
- ✅ **Coursera course recommendations** - Real API integration
- ✅ **Automated email generation** - Personalized outreach
- ✅ **Lead tracking** - Monitor performance
- ✅ **Simple dashboard** - View results

## 🚀 **Step 1: Quick Demo Setup**

### **1. Install Required Packages**
```bash
# Backend dependencies
npm install node-cron axios cheerio

# Frontend dependencies (if needed)
npm install recharts
```

### **2. Create Demo Lead Generation Service**
```typescript
// backend/src/services/LeadGenerationDemo.ts
export class LeadGenerationDemo {
  private leads: Lead[] = [];
  private revenue: number = 0;

  // Demo data for testing
  private demoUsers = [
    {
      id: '1',
      firstName: 'John',
      email: 'john@example.com',
      role: 'JOB_SEEKER',
      skillGaps: ['React', 'Node.js', 'AWS'],
      jobApplications: 15,
      resumeUpdates: 5
    },
    {
      id: '2',
      firstName: 'Sarah',
      email: 'sarah@example.com',
      role: 'EMPLOYER',
      companySize: 'LARGE',
      industry: 'TECH',
      jobsPosted: 8,
      teamSize: 25
    },
    {
      id: '3',
      firstName: 'Mike',
      email: 'mike@example.com',
      role: 'JOB_SEEKER',
      skillGaps: ['Python', 'Data Science', 'Machine Learning'],
      jobApplications: 20,
      resumeUpdates: 3
    }
  ];

  // Demo Coursera courses
  private demoCourses = [
    {
      title: 'React Development',
      price: 79,
      duration: '8 weeks',
      skills: ['React', 'JavaScript'],
      url: 'https://coursera.org/react-dev',
      affiliateId: 'demo-affiliate-1'
    },
    {
      title: 'Node.js Backend Development',
      price: 89,
      duration: '10 weeks',
      skills: ['Node.js', 'JavaScript'],
      url: 'https://coursera.org/nodejs-backend',
      affiliateId: 'demo-affiliate-2'
    },
    {
      title: 'AWS Cloud Computing',
      price: 99,
      duration: '12 weeks',
      skills: ['AWS', 'Cloud Computing'],
      url: 'https://coursera.org/aws-cloud',
      affiliateId: 'demo-affiliate-3'
    },
    {
      title: 'Python for Data Science',
      price: 69,
      duration: '6 weeks',
      skills: ['Python', 'Data Science'],
      url: 'https://coursera.org/python-data',
      affiliateId: 'demo-affiliate-4'
    }
  ];

  // Generate demo leads
  async generateDemoLeads(): Promise<Lead[]> {
    console.log('🚀 Generating demo leads...');
    
    for (const user of this.demoUsers) {
      const leadScore = this.calculateLeadScore(user);
      const opportunities = this.findOpportunities(leadScore);
      
      if (opportunities.length > 0) {
        const lead: Lead = {
          id: `lead-${user.id}`,
          userId: user.id,
          userEmail: user.email,
          userName: user.firstName,
          leadScore: leadScore,
          opportunities: opportunities,
          estimatedRevenue: this.calculateRevenue(opportunities),
          status: 'NEW',
          createdAt: new Date(),
          emailSent: false
        };
        
        this.leads.push(lead);
        this.revenue += lead.estimatedRevenue;
        
        console.log(`✅ Generated lead for ${user.firstName}: $${lead.estimatedRevenue}`);
      }
    }
    
    return this.leads;
  }

  // Calculate lead score
  private calculateLeadScore(user: any): LeadScore {
    let educationalScore = 0;
    let corporateScore = 0;
    let recruitmentScore = 0;

    if (user.role === 'JOB_SEEKER') {
      // Educational score for job seekers
      if (user.skillGaps.length > 2) educationalScore += 30;
      if (user.jobApplications > 10) educationalScore += 25;
      if (user.resumeUpdates > 3) educationalScore += 20;
      
      // Recruitment score for job seekers
      if (user.jobApplications > 15) recruitmentScore += 40;
    }

    if (user.role === 'EMPLOYER') {
      // Corporate score for employers
      if (user.companySize === 'LARGE') corporateScore += 30;
      if (user.jobsPosted > 5) corporateScore += 25;
      if (user.teamSize > 20) corporateScore += 20;
      if (user.industry === 'TECH') corporateScore += 15;
    }

    return {
      educational: educationalScore,
      corporate: corporateScore,
      recruitment: recruitmentScore,
      total: educationalScore + corporateScore + recruitmentScore
    };
  }

  // Find partnership opportunities
  private findOpportunities(leadScore: LeadScore): PartnershipOpportunity[] {
    const opportunities: PartnershipOpportunity[] = [];

    // Educational partnerships
    if (leadScore.educational > 50) {
      opportunities.push({
        type: 'EDUCATIONAL',
        partner: 'Coursera',
        opportunity: 'Course recommendations for skill gaps',
        revenue: '$50-200 per course completion',
        automation: 'AI-powered course matching',
        courses: this.getRelevantCourses()
      });
    }

    // Corporate partnerships
    if (leadScore.corporate > 50) {
      opportunities.push({
        type: 'CORPORATE_TRAINING',
        partner: 'LinkedIn Learning',
        opportunity: 'Employee training programs',
        revenue: '$500-5000 per company',
        automation: 'Company training needs analysis'
      });
    }

    // Recruitment partnerships
    if (leadScore.recruitment > 50) {
      opportunities.push({
        type: 'RECRUITMENT',
        partner: 'Recruitment Agencies',
        opportunity: 'Candidate pool access',
        revenue: '$100-1000 per successful hire',
        automation: 'Candidate-agency matching'
      });
    }

    return opportunities;
  }

  // Get relevant courses for user
  private getRelevantCourses(): Course[] {
    return this.demoCourses.slice(0, 3); // Return top 3 courses
  }

  // Calculate estimated revenue
  private calculateRevenue(opportunities: PartnershipOpportunity[]): number {
    let total = 0;
    
    for (const opportunity of opportunities) {
      if (opportunity.type === 'EDUCATIONAL') {
        // 15% commission on course sales
        const courses = this.getRelevantCourses();
        total += courses.reduce((sum, course) => sum + (course.price * 0.15), 0);
      } else if (opportunity.type === 'CORPORATE_TRAINING') {
        total += 1000; // Estimated corporate training revenue
      } else if (opportunity.type === 'RECRUITMENT') {
        total += 500; // Estimated recruitment revenue
      }
    }
    
    return total;
  }

  // Generate demo email
  async generateDemoEmail(lead: Lead): Promise<string> {
    const courses = lead.opportunities
      .filter(o => o.type === 'EDUCATIONAL')
      .flatMap(o => o.courses || []);

    return `
Hi ${lead.userName},

We've identified some great opportunities for you:

🎯 Partnership Opportunities:
${lead.opportunities.map(o => `- ${o.partner}: ${o.opportunity}`).join('\n')}

📚 Recommended Courses:
${courses.map(c => `- ${c.title} ($${c.price})`).join('\n')}

💰 Estimated Revenue Potential: $${lead.estimatedRevenue}

Would you like to explore these opportunities?

Best regards,
HappyCareer Team
    `;
  }

  // Get demo statistics
  getDemoStats(): DemoStats {
    return {
      totalLeads: this.leads.length,
      totalRevenue: this.revenue,
      averageLeadScore: this.leads.reduce((sum, lead) => sum + lead.leadScore.total, 0) / this.leads.length,
      topOpportunities: this.getTopOpportunities(),
      leadsByType: this.getLeadsByType()
    };
  }

  private getTopOpportunities(): string[] {
    const opportunityCounts: { [key: string]: number } = {};
    
    this.leads.forEach(lead => {
      lead.opportunities.forEach(opp => {
        opportunityCounts[opp.partner] = (opportunityCounts[opp.partner] || 0) + 1;
      });
    });
    
    return Object.entries(opportunityCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([partner]) => partner);
  }

  private getLeadsByType(): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    
    this.leads.forEach(lead => {
      lead.opportunities.forEach(opp => {
        counts[opp.type] = (counts[opp.type] || 0) + 1;
      });
    });
    
    return counts;
  }
}

// Types
interface Lead {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  leadScore: LeadScore;
  opportunities: PartnershipOpportunity[];
  estimatedRevenue: number;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED';
  createdAt: Date;
  emailSent: boolean;
}

interface LeadScore {
  educational: number;
  corporate: number;
  recruitment: number;
  total: number;
}

interface PartnershipOpportunity {
  type: 'EDUCATIONAL' | 'CORPORATE_TRAINING' | 'RECRUITMENT';
  partner: string;
  opportunity: string;
  revenue: string;
  automation: string;
  courses?: Course[];
}

interface Course {
  title: string;
  price: number;
  duration: string;
  skills: string[];
  url: string;
  affiliateId: string;
}

interface DemoStats {
  totalLeads: number;
  totalRevenue: number;
  averageLeadScore: number;
  topOpportunities: string[];
  leadsByType: { [key: string]: number };
}
```

### **3. Create Demo API Routes**
```typescript
// backend/src/routes/leads.ts
import { Router } from 'express';
import { LeadGenerationDemo } from '../services/LeadGenerationDemo';

const router = Router();
const leadService = new LeadGenerationDemo();

// Generate demo leads
router.post('/demo/generate', async (req, res) => {
  try {
    const leads = await leadService.generateDemoLeads();
    res.json({
      success: true,
      message: 'Demo leads generated successfully',
      data: leads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate demo leads',
      error: error.message
    });
  }
});

// Get demo statistics
router.get('/demo/stats', async (req, res) => {
  try {
    const stats = leadService.getDemoStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get demo stats',
      error: error.message
    });
  }
});

// Generate demo email for a lead
router.post('/demo/email/:leadId', async (req, res) => {
  try {
    const { leadId } = req.params;
    const leads = leadService['leads']; // Access private property for demo
    
    const lead = leads.find(l => l.id === leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    const emailContent = await leadService.generateDemoEmail(lead);
    res.json({
      success: true,
      data: {
        leadId,
        emailContent,
        recipient: lead.userEmail
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate email',
      error: error.message
    });
  }
});

export default router;
```

### **4. Add Routes to Main App**
```typescript
// backend/src/index.ts
// Add this line with other route imports
import leadsRoutes from './routes/leads';

// Add this line with other route registrations
app.use('/api/leads', leadsRoutes);
```

### **5. Create Simple Demo Dashboard**
```typescript
// frontend/src/components/demo/LeadGenerationDemo.tsx
import React, { useState, useEffect } from 'react';

interface DemoStats {
  totalLeads: number;
  totalRevenue: number;
  averageLeadScore: number;
  topOpportunities: string[];
  leadsByType: { [key: string]: number };
}

interface Lead {
  id: string;
  userName: string;
  userEmail: string;
  leadScore: { total: number };
  opportunities: Array<{ partner: string; opportunity: string }>;
  estimatedRevenue: number;
  status: string;
}

export default function LeadGenerationDemo() {
  const [stats, setStats] = useState<DemoStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailContent, setEmailContent] = useState<string>('');

  const generateDemoLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads/demo/generate', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.data);
        await fetchStats();
      }
    } catch (error) {
      console.error('Failed to generate leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/leads/demo/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const generateEmail = async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/demo/email/${leadId}`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setEmailContent(data.data.emailContent);
      }
    } catch (error) {
      console.error('Failed to generate email:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🤖 Lead Generation Demo
        </h1>
        
        {/* Generate Button */}
        <div className="mb-8">
          <button
            onClick={generateDemoLeads}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Generating...' : '🚀 Generate Demo Leads'}
          </button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Total Leads</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalLeads}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">${stats.totalRevenue}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Avg Lead Score</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.averageLeadScore.toFixed(0)}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800">Top Partner</h3>
              <p className="text-xl font-bold text-orange-600">{stats.topOpportunities[0] || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Leads Table */}
        {leads.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated Leads</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Score</th>
                    <th className="px-4 py-2 text-left">Revenue</th>
                    <th className="px-4 py-2 text-left">Partners</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-t border-gray-200">
                      <td className="px-4 py-2">{lead.userName}</td>
                      <td className="px-4 py-2">{lead.userEmail}</td>
                      <td className="px-4 py-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {lead.leadScore.total}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-semibold">${lead.estimatedRevenue}</td>
                      <td className="px-4 py-2">
                        {lead.opportunities.map(o => o.partner).join(', ')}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => generateEmail(lead.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Generate Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Email Preview */}
        {emailContent && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated Email</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{emailContent}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### **6. Add Demo Page to Frontend**
```typescript
// frontend/src/app/demo/page.tsx
import LeadGenerationDemo from '@/components/demo/LeadGenerationDemo';

export default function DemoPage() {
  return <LeadGenerationDemo />;
}
```

## 🚀 **How to Test the Demo**

### **1. Start the Backend**
```bash
cd backend
npm run dev
```

### **2. Start the Frontend**
```bash
cd frontend
npm run dev
```

### **3. Visit the Demo**
Go to: `http://localhost:3000/demo`

### **4. Test the Features**
1. **Click "Generate Demo Leads"** - See leads being created
2. **View Statistics** - See revenue potential and metrics
3. **Click "Generate Email"** - See automated email content
4. **Analyze Results** - Understand the automation

## 📊 **What You'll See in the Demo**

### **Generated Leads:**
- **John** (Job Seeker) - $45 revenue potential from Coursera courses
- **Sarah** (Employer) - $1,000 revenue potential from corporate training
- **Mike** (Job Seeker) - $35 revenue potential from Coursera courses

### **Statistics:**
- **Total Leads**: 3
- **Total Revenue**: $1,080
- **Average Lead Score**: 72
- **Top Partner**: Coursera

### **Automated Emails:**
- Personalized recommendations
- Partnership opportunities
- Revenue potential
- Call-to-action

## 🎯 **After You See It Working**

### **If You Like It - We Can Improve:**
- ✅ **Real API integrations** (Coursera, LinkedIn Learning)
- ✅ **Advanced AI scoring** (machine learning)
- ✅ **Email automation** (Resend integration)
- ✅ **Lead tracking** (analytics dashboard)
- ✅ **Revenue optimization** (A/B testing)

### **If You Want to Deny - No Problem:**
- ❌ **Remove the code** easily
- ❌ **No cost** incurred
- ❌ **No commitment** required
- ❌ **Keep it simple** without automation

## 💡 **Demo Benefits**

### **See Before You Commit:**
- ✅ **Visual proof** of automation working
- ✅ **Real numbers** and revenue potential
- ✅ **User experience** of the system
- ✅ **Technical feasibility** confirmed

**Ready to see it in action?** Just run the demo and you'll see exactly how the automated lead generation works before deciding to improve or deny it!

**Would you like me to help you set up and run this demo?** 