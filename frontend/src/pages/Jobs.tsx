
import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  Star,
  Bookmark,
  ChevronDown,
  Building2
} from 'lucide-react';

const Jobs = () => {
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechFlow Solutions",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "5-7 years",
      salary: "$150K - $200K",
      posted: "2 hours ago",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center",
      tags: ["React", "TypeScript", "AWS", "GraphQL"],
      description: "Join our growing team to build the next generation of our B2B platform. You'll work with cutting-edge technologies and solve complex problems.",
      companySize: "201-500 employees",
      remote: true
    },
    {
      id: 2,
      title: "Product Manager - AI/ML",
      company: "DataVision Inc",
      location: "New York, NY",
      type: "Full-time",
      experience: "3-5 years",
      salary: "$130K - $170K",
      posted: "4 hours ago",
      logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=64&h=64&fit=crop&crop=center",
      tags: ["Product Strategy", "AI/ML", "Analytics", "Leadership"],
      description: "Lead product development for our AI-powered analytics platform and drive product strategy in a fast-paced environment.",
      companySize: "51-200 employees",
      remote: false
    },
    {
      id: 3,
      title: "Senior UX Designer",
      company: "DesignCraft Studio",
      location: "Remote",
      type: "Full-time",
      experience: "4-6 years",
      salary: "$110K - $150K",
      posted: "1 day ago",
      logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=64&h=64&fit=crop&crop=center",
      tags: ["Figma", "User Research", "Design Systems", "Prototyping"],
      description: "Create beautiful and intuitive user experiences for our suite of B2B products used by millions of professionals.",
      companySize: "11-50 employees",
      remote: true
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "CloudScale Technologies",
      location: "Austin, TX",
      type: "Full-time",
      experience: "3-5 years",
      salary: "$120K - $160K",
      posted: "2 days ago",
      logo: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=64&h=64&fit=crop&crop=center",
      tags: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      description: "Build and maintain scalable infrastructure to support our growing platform and ensure 99.9% uptime.",
      companySize: "501-1000 employees",
      remote: false
    },
    {
      id: 5,
      title: "Sales Director",
      company: "GrowthTech Solutions",
      location: "Chicago, IL",
      type: "Full-time",
      experience: "7+ years",
      salary: "$140K - $180K + Commission",
      posted: "3 days ago",
      logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=64&h=64&fit=crop&crop=center",
      tags: ["B2B Sales", "Leadership", "SaaS", "Enterprise"],
      description: "Lead our sales team and drive revenue growth in the enterprise B2B market with proven sales strategies.",
      companySize: "101-200 employees",
      remote: false
    },
    {
      id: 6,
      title: "Data Scientist",
      company: "Analytics Pro",
      location: "Seattle, WA",
      type: "Full-time",
      experience: "2-4 years",
      salary: "$100K - $140K",
      posted: "5 days ago",
      logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=64&h=64&fit=crop&crop=center",
      tags: ["Python", "Machine Learning", "SQL", "Statistics"],
      description: "Analyze large datasets to derive insights and build predictive models for our enterprise clients.",
      companySize: "201-500 employees",
      remote: true
    }
  ];

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Next Opportunity</h1>
          <p className="text-xl text-gray-600">Discover jobs that match your skills and career goals</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Location"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none">
                  <option>All Experience Levels</option>
                  <option>Entry Level (0-2 years)</option>
                  <option>Mid Level (3-5 years)</option>
                  <option>Senior Level (5+ years)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1">Search</Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4 text-lg">Filters</h3>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Job Type</h4>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Salary Range</h4>
                  <div className="space-y-2">
                    {['$50K - $80K', '$80K - $120K', '$120K - $160K', '$160K+'].map((range) => (
                      <label key={range} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Company Size</h4>
                  <div className="space-y-2">
                    {['Startup (1-50)', 'Small (51-200)', 'Medium (201-1000)', 'Large (1000+)'].map((size) => (
                      <label key={size} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {jobs.length} Jobs Found
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="border border-gray-200 rounded-md px-3 py-1 text-sm">
                  <option>Most Recent</option>
                  <option>Salary (High to Low)</option>
                  <option>Salary (Low to High)</option>
                  <option>Company A-Z</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 hover:text-primary mb-1">
                                {job.title}
                              </h3>
                              <p className="text-gray-700 font-medium">{job.company}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSaveJob(job.id)}
                              className={savedJobs.includes(job.id) ? 'text-primary' : 'text-gray-400'}
                            >
                              <Bookmark className={`h-5 w-5 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.type}
                            </div>
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-1" />
                              {job.companySize}
                            </div>
                            <div className="flex items-center text-green-600 font-semibold">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {job.salary}
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4">{job.description}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-primary-50 text-primary">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Posted {job.posted}</span>
                              <span>•</span>
                              <span>{job.experience} experience</span>
                              {job.remote && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600">Remote OK</span>
                                </>
                              )}
                            </div>
                            <Button>Apply Now</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
