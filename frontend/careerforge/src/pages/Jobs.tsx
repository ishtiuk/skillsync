import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { JobFilters } from '@/components/jobs/JobFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Building2, Clock, Bookmark, SlidersHorizontal, Briefcase, Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';
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
import { motion } from "framer-motion";

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
  minimum_pay?: string;
  maximum_pay?: string;
  pay_frequency?: string;
  sector_focus?: string[];
}

const Jobs: React.FC = () => {
  console.log('Jobs component rendering');
  const navigate = useNavigate();

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
        cat.toLowerCase()
           .replace(/\s+&\s+/g, '-')  // Replace " & " with "-"
           .replace(/\s+/g, '-')      // Replace all other spaces with "-"
           .replace(/_/g, '-')        // Replace any underscores with hyphens
      );
    }

    // Transform arrays to match backend types while preserving case for enums
    if (filters.position_type?.length) transformed.position_type = filters.position_type;
    if (experienceLevel && experienceLevel !== 'all') transformed.level_of_experience = [experienceLevel];
    if (workplaceType && workplaceType !== 'all') transformed.workplace_type = [workplaceType];

    // Pass location filters as is, backend will handle case-insensitive search
    if (filters.city) transformed.city = filters.city;
    if (filters.state) transformed.state = filters.state;
    if (filters.country) transformed.country = filters.country;

    // Transform compensation filters
    if (filters.minimum_pay && filters.minimum_pay.trim()) transformed.minimum_pay = [parseFloat(filters.minimum_pay)];
    if (filters.maximum_pay && filters.maximum_pay.trim()) transformed.maximum_pay = [parseFloat(filters.maximum_pay)];
    if (filters.pay_frequency && filters.pay_frequency !== 'all') transformed.pay_frequency = [filters.pay_frequency];

    // Handle sector focus if present
    if (filters.sector_focus?.length) transformed.sector_focus = filters.sector_focus;

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

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative py-12 px-4 sm:px-6 lg:px-8 rounded-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
        >
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text"
            >
              Find Your Next Opportunity
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground text-center max-w-2xl mx-auto"
            >
              Discover jobs that match your skills and career milestones from top companies
            </motion.p>
          </div>

          {/* Quick Stats */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                variants={item}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/20 transition-colors duration-300">
                  <stat.icon className="w-8 h-8 text-primary mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Search Section */}
        <Card className="shadow-lg border-border/50 overflow-hidden backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Main Search Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                <div className="lg:col-span-4">
                  <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                    Job Title or Keywords
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="search"
                      placeholder="e.g. Software Engineer, Product Manager"
                      className="h-12 pl-10 text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
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
                    className="h-12 px-3 hover:bg-primary/5"
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="xl:col-span-1"
            >
              <JobFilters onFiltersChange={handleFiltersChange} />
            </motion.div>
          )}

          {/* Job Results */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${showFilters ? 'xl:col-span-3' : 'xl:col-span-4'}`}
          >
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {loading ? (
                    <span className="inline-flex items-center">
                      <span className="animate-pulse">Loading...</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center">
                      <span className="text-primary font-bold mr-2">{jobs.length}</span>
                      Jobs Found
                    </span>
                  )}
                </h2>
                {error && (
                  <p className="text-destructive mt-1 text-sm">{error}</p>
                )}
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
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={item}
                  layoutId={`job-${job.id}`}
                >
                  <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Company Logo */}
                        <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          {job.organization_logo_url ? (
                            <img
                              src={job.organization_logo_url}
                              alt={`${job.organization_name} logo`}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Building2 className="w-8 h-8 text-muted-foreground/50" />
                          )}
                        </div>

                        {/* Job Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                {job.title}
                              </h3>
                              <p className="text-muted-foreground">
                                {job.organization_name}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:text-primary hover:bg-primary/5"
                            >
                              <Bookmark className="w-5 h-5" />
                            </Button>
                          </div>

                          <Separator className="my-3" />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              {job.city && job.state && (
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1.5 text-primary/70" />
                                  {`${job.city}, ${job.state}`}
                                </div>
                              )}
                              <div className="flex items-center">
                                <Building2 className="w-4 h-4 mr-1.5 text-primary/70" />
                                {job.position_type}
                              </div>
                              {(job.minimum_pay || job.maximum_pay) && (
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1.5 text-primary/70" />
                                  {job.minimum_pay && job.maximum_pay
                                    ? `${job.minimum_pay.toLocaleString()} - ${job.maximum_pay.toLocaleString()}`
                                    : job.minimum_pay
                                    ? `From ${job.minimum_pay.toLocaleString()}`
                                    : `Up to ${job.maximum_pay.toLocaleString()}`}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2 items-center justify-end">
                              {job.workplace_type && (
                                <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                                  {job.workplace_type}
                                </Badge>
                              )}
                              {job.level_of_experience && (
                                <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                                  {job.level_of_experience}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Job Description Preview */}
                          {job.role_description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                              {job.role_description}
                            </p>
                          )}

                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              variant="default"
                              className="group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                              onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
