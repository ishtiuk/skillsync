import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft, Building2, MapPin, Calendar, DollarSign,
  Briefcase, GraduationCap, Globe, Bookmark, Share2
} from 'lucide-react';
import { Position } from '@/types/positions';
import { motion } from 'framer-motion';

const JobDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job as Position;

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

  if (!job) {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto p-6"
        >
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Briefcase className="w-12 h-12 mx-auto text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
              <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Jobs
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Header Navigation */}
          <motion.div variants={item} className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate(-1)} className="group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Jobs
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Job Header Card */}
          <motion.div variants={item}>
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                    {job.organization_logo_url ? (
                      <img
                        src={job.organization_logo_url}
                        alt={job.organization_name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{job.organization_name}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="secondary" className="bg-primary/5 hover:bg-primary/10">
                        {job.position_type}
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/5 hover:bg-primary/10">
                        {job.level_of_experience}
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/5 hover:bg-primary/10">
                        {job.workplace_type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <motion.div variants={item} className="lg:col-span-2 space-y-6">
              {/* Key Details */}
              <Card className="overflow-hidden bg-gradient-to-br from-card to-background border-border/50">
                <CardHeader>
                  <CardTitle>Key Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <span>{[job.city, job.state, job.country].filter(Boolean).join(', ')}</span>
                      </div>
                      {job.closing_date && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <span>Closing: {new Date(job.closing_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {(job.minimum_pay || job.maximum_pay) && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-primary" />
                          </div>
                          <span>
                            {job.minimum_pay && job.maximum_pay
                              ? `$${job.minimum_pay.toLocaleString()} - $${job.maximum_pay.toLocaleString()}`
                              : job.minimum_pay
                              ? `From $${job.minimum_pay.toLocaleString()}`
                              : `Up to $${job.maximum_pay.toLocaleString()}`}
                            {job.pay_frequency && ` / ${job.pay_frequency}`}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-primary" />
                        </div>
                        <span>{job.job_category}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Role Description */}
              {job.role_description && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>Role Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed">{job.role_description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Primary Responsibilities */}
              {job.primary_responsibilities && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>Primary Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed">{job.primary_responsibilities}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Right Column - 1/3 width */}
            <motion.div variants={item} className="space-y-6">
              {/* Application Call to Action */}
              <Card className="bg-primary text-primary-foreground border-0">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Ready to Apply?</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Take the next step in your career journey
                  </p>
                  <div className="flex gap-3">
                    <Button
                      className="w-full bg-white text-primary hover:bg-white/90"
                      size="lg"
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Required Qualifications */}
              {job.required_qualifications && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>Required Qualifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm prose-gray max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed">{job.required_qualifications}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Desired Qualifications */}
              {job.desired_qualifications && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>Desired Qualifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm prose-gray max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed">{job.desired_qualifications}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recruiter Information */}
              {job.recruiter_name && (
                <Card className="border-border/50 overflow-hidden">
                  <CardHeader>
                    <CardTitle>Recruiter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={job.recruiter_profile_picture_url} alt={job.recruiter_name} />
                        <AvatarFallback className="bg-primary/5 text-primary">
                          {job.recruiter_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="font-medium">{job.recruiter_name}</p>
                        {job.recruiter_job_title && (
                          <p className="text-sm text-muted-foreground">{job.recruiter_job_title}</p>
                        )}
                        {job.recruiter_email && (
                          <a
                            href={`mailto:${job.recruiter_email}`}
                            className="text-sm text-primary hover:text-primary/90 inline-flex items-center gap-1"
                          >
                            {job.recruiter_email}
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default JobDetails;
