
export const getPlatformContent = (platform: 'careerforge' | 'talenthub') => {
  const platformContent = {
    careerforge: {
      tagline: 'Career Growth Platform',
      description: 'Your unified platform for career advancement and intelligent talent management',
      features: [
        {
          title: 'Smart Application Tracking',
          description: 'Organize and monitor your job applications with intelligent status updates'
        },
        {
          title: 'AI-Powered Insights',
          description: 'Get personalized recommendations and market insights to accelerate your career'
        },
        {
          title: 'Unified Experience',
          description: 'Seamlessly connect job seekers and recruiters on one comprehensive platform'
        }
      ],
      stats: [
        { value: '50K+', label: 'Active Users' },
        { value: '95%', label: 'Success Rate' },
        { value: '1M+', label: 'Jobs Tracked' }
      ]
    },
    talenthub: {
      tagline: 'Talent Management Hub',
      description: 'Advanced recruitment platform for connecting with top talent and managing positions',
      features: [
        {
          title: 'Intelligent Candidate Matching',
          description: 'Find the perfect candidates using AI-powered matching algorithms'
        },
        {
          title: 'Advanced Recruitment Tools',
          description: 'Streamline your hiring process with comprehensive position management'
        },
        {
          title: 'Talent Analytics',
          description: 'Gain insights into your recruitment performance and candidate pipeline'
        }
      ],
      stats: [
        { value: '25K+', label: 'Companies' },
        { value: '95%', label: 'Success Rate' },
        { value: '500K+', label: 'Positions Filled' }
      ]
    }
  };

  return platformContent[platform];
};
