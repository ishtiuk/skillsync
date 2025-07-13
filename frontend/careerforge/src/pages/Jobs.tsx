import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { JobFilters } from '@/components/jobs/JobFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Building2, Clock, Bookmark, Filter, SlidersHorizontal, Briefcase, Users, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Jobs: React.FC = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [bipocOwned, setBipocOwned] = useState(false);
  const [filters, setFilters] = useState({});

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechFlow Solutions',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$150K - $200K',
      posted: '2 hours ago',
      experience: '5-7 years experience',
      remote: true,
      logo: '💻',
      description: 'Join our growing team to build the next generation of our B2B platform. You\'ll work with cutting-edge technologies and solve complex problems.',
      skills: ['React', 'TypeScript', 'AWS', 'GraphQL'],
      companySize: '201-500 employees',
      bipocOwned: true
    },
    {
      id: 2,
      title: 'Product Manager - AI/ML',
      company: 'Innovation Labs',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$110k - $140k',
      posted: '1 day ago',
      experience: '3-5 years experience',
      remote: false,
      logo: '🚀',
      description: 'Lead product strategy for our AI/ML initiatives and drive innovation in our core platform.',
      skills: ['Product Management', 'AI/ML', 'Strategy', 'Analytics'],
      companySize: '51-200 employees',
      bipocOwned: false
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'Remote',
      type: 'Contract',
      salary: '$80k - $100k',
      posted: '3 days ago',
      experience: '2-4 years experience',
      remote: true,
      logo: '🎨',
      description: 'Create beautiful and intuitive user experiences for our digital products.',
      skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
      companySize: '11-50 employees',
      bipocOwned: true
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'Analytics Corp',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$95k - $130k',
      posted: '5 days ago',
      experience: '2-5 years experience',
      remote: false,
      logo: '📊',
      description: 'Analyze complex datasets and build predictive models to drive business insights.',
      skills: ['Python', 'SQL', 'Machine Learning', 'Statistics'],
      companySize: '501-1000 employees',
      bipocOwned: false
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'Cloud Systems',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$120k - $155k',
      posted: '1 week ago',
      experience: '3-6 years experience',
      remote: true,
      logo: '⚙️',
      description: 'Build and maintain scalable infrastructure and deployment pipelines.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      companySize: '201-500 employees',
      bipocOwned: false
    },
    {
      id: 6,
      title: 'Frontend Developer',
      company: 'StartupHub',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      salary: '$85k - $115k',
      posted: '1 week ago',
      experience: '1-3 years experience',
      remote: false,
      logo: '🌟',
      description: 'Build responsive and interactive web applications using modern frameworks.',
      skills: ['React', 'JavaScript', 'CSS', 'HTML'],
      companySize: '11-50 employees',
      bipocOwned: true
    }
  ];

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  const statsData = [
    { label: 'Total Jobs', value: '6', icon: Briefcase },
    { label: 'New This Week', value: '3', icon: TrendingUp },
    { label: 'Remote Jobs', value: '4', icon: Users },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Find Your Next Opportunity
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover jobs that match your skills and career milestones from top companies
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-card border rounded-lg p-4 text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Search Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-card to-card/50">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Main Search Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                <div className="lg:col-span-4">
                  <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                    Job Title or Keywords
                  </Label>
                  <Input
                    id="search"
                    placeholder="e.g. Software Engineer, Product Manager"
                    className="h-12 text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="lg:col-span-3">
                  <Label htmlFor="location" className="text-sm font-medium mb-2 block">
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, State, or Remote"
                    className="h-12 text-base"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="lg:col-span-3">
                  <Label className="text-sm font-medium mb-2 block">
                    Experience Level
                  </Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="lg:col-span-2 flex gap-2">
                  <Button className="h-12 flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 px-3"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="xl:col-span-1">
              <JobFilters onFiltersChange={handleFiltersChange} />
            </div>
          )}

          {/* Job Results */}
          <div className={`${showFilters ? 'xl:col-span-3' : 'xl:col-span-4'}`}>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">6 Jobs Found</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing opportunities that match your criteria
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Most Recent">Most Recent</SelectItem>
                    <SelectItem value="Salary High">Salary: High to Low</SelectItem>
                    <SelectItem value="Salary Low">Salary: Low to High</SelectItem>
                    <SelectItem value="Relevance">Relevance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-6">
              {featuredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-r from-card to-card/80">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center text-2xl border border-primary/20">
                          {job.logo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-xl text-foreground mb-1 hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-foreground font-semibold mb-2">{job.company}</p>
                            </div>
                            <Button variant="outline" size="sm" className="hover:bg-primary/10">
                              <Bookmark className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center flex-wrap gap-4 mb-3 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.posted}
                            </div>
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 mr-1" />
                              {job.companySize}
                            </div>
                          </div>

                          <div className="flex items-center flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="font-medium">{job.type}</Badge>
                            <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">
                              {job.salary}
                            </Badge>
                            <span className="text-sm text-muted-foreground">• {job.experience}</span>
                            {job.remote && (
                              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                                Remote OK
                              </Badge>
                            )}
                            {job.bipocOwned && (
                              <Badge className="bg-accent/50 text-accent-foreground border-accent">
                                BIPOC-Owned
                              </Badge>
                            )}
                          </div>

                          <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                            {job.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs px-3 py-1">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="ml-6">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
