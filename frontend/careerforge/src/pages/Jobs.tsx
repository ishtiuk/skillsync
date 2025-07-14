import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { JobFilters } from '@/components/jobs/JobFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Building2, Clock, Bookmark, SlidersHorizontal, Briefcase, Users, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Position } from '@/types/positions';
import { positions } from '@/lib/api';
import { Category } from '@/types/positions';

interface JobFilters {
  title?: string;
  organization_name?: string;
  job_category?: string[];
  position_type?: string[];
  level_of_experience?: string[];
  workplace_type?: string[];
  city?: string;
  state?: string;
  country?: string;
  pay_type?: string;
  minimum_pay?: string;
  maximum_pay?: string;
  pay_frequency?: string;
  sector_focus?: string[];
}

const Jobs: React.FC = () => {
  console.log('Jobs component rendering');

  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [workplaceType, setWorkplaceType] = useState('all');
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [filters, setFilters] = useState<JobFilters>({});
  const [jobs, setJobs] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transform frontend filters to match backend schema
  const transformFilters = (filters: JobFilters) => {
    console.log('Transforming filters:', filters);
    const transformed: any = {};

    if (filters.title || searchTerm) transformed.title = filters.title || searchTerm;
    if (filters.organization_name) transformed.organization_name = filters.organization_name;

    // Transform job categories to match backend enum values
    if (filters.job_category?.length) {
      transformed.job_category = filters.job_category.map((cat: string) =>
        cat.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '_') as Category
      );
    }

    // Transform arrays to match backend types
    if (filters.position_type?.length) transformed.position_type = filters.position_type;
    if (experienceLevel && experienceLevel !== 'all') transformed.level_of_experience = [experienceLevel];
    if (workplaceType && workplaceType !== 'all') transformed.workplace_type = [workplaceType];

    // Transform location filters - make case insensitive by converting to title case
    if (filters.city) transformed.city = filters.city.replace(/\w\S*/g, (w: string) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
    if (filters.state) transformed.state = filters.state.replace(/\w\S*/g, (w: string) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
    if (filters.country) transformed.country = filters.country.replace(/\w\S*/g, (w: string) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());

    // Transform compensation filters
    if (filters.pay_type) transformed.pay_type = filters.pay_type;
    if (filters.minimum_pay && filters.minimum_pay.trim()) transformed.minimum_pay = [parseFloat(filters.minimum_pay)];
    if (filters.maximum_pay && filters.maximum_pay.trim()) transformed.maximum_pay = [parseFloat(filters.maximum_pay)];
    if (filters.pay_frequency && filters.pay_frequency !== 'all') transformed.pay_frequency = [filters.pay_frequency];

    console.log('Transformed filters:', transformed);
    return transformed;
  };

  const fetchJobs = async (filters: JobFilters = {}) => {
    console.log('Fetching jobs with filters:', filters);
    try {
      setLoading(true);
      setError(null);
      console.log('Current auth:', localStorage.getItem('skillsync-auth'));

      const transformedFilters = transformFilters(filters);
      console.log('Calling API with filters:', transformedFilters);
      const data = await positions.getPositions(transformedFilters);
      console.log('Received jobs:', data);
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  // Update jobs when filters change
  useEffect(() => {
    fetchJobs(filters);
  }, [filters]);

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    const newFilters = {
      ...filters,
      title: searchTerm || undefined,
      workplace_type: workplaceType ? [workplaceType] : undefined,
      level_of_experience: experienceLevel ? [experienceLevel] : undefined
    };
    setFilters(newFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const statsData = [
    { label: 'Total Jobs', value: jobs.length.toString(), icon: Briefcase },
    { label: 'New This Week', value: '3', icon: TrendingUp },
    { label: 'Remote Jobs', value: jobs.filter(j => j.workplace_type === 'Remote').length.toString(), icon: Users },
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
                    onKeyPress={handleKeyPress}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="lg:col-span-3">
                  <Label htmlFor="workplace" className="text-sm font-medium mb-2 block">
                    Workplace Type
                  </Label>
                  <Select value={workplaceType} onValueChange={setWorkplaceType}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Onsite">Onsite</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Entry">Entry Level</SelectItem>
                      <SelectItem value="Mid">Mid Level</SelectItem>
                      <SelectItem value="Senior">Senior Level</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="lg:col-span-2 flex gap-2">
                  <Button
                    className="h-12 flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleSearch}
                  >
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
                <h2 className="text-lg font-semibold">
                  {loading ? 'Loading...' : `${jobs.length} Jobs Found`}
                </h2>
                {error && <p className="text-red-500">{error}</p>}
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="salary_high">Salary High to Low</SelectItem>
                  <SelectItem value="salary_low">Salary Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Company Logo */}
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                        {job.organization_logo_url ? (
                          <img
                            src={job.organization_logo_url}
                            alt={`${job.organization_name} logo`}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        ) : (
                          '🏢'
                        )}
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold hover:text-primary">
                              {job.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {job.organization_name}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          {job.city && job.state && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {`${job.city}, ${job.state}`}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 mr-1" />
                            {job.position_type}
                          </div>
                          {(job.minimum_pay || job.maximum_pay) && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.minimum_pay && job.maximum_pay
                                ? `$${job.minimum_pay.toLocaleString()} - $${job.maximum_pay.toLocaleString()}`
                                : job.minimum_pay
                                ? `From $${job.minimum_pay.toLocaleString()}`
                                : `Up to $${job.maximum_pay.toLocaleString()}`}
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {job.workplace_type && (
                            <Badge variant="secondary">
                              {job.workplace_type}
                            </Badge>
                          )}
                          {job.level_of_experience && (
                            <Badge variant="secondary">
                              {job.level_of_experience}
                            </Badge>
                          )}
                        </div>

                        {/* Job Description Preview */}
                        {job.role_description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {job.role_description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-muted-foreground">
                            Posted {new Date(job.created_at).toLocaleDateString()}
                          </div>
                          <Button variant="default">View Details</Button>
                        </div>
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
