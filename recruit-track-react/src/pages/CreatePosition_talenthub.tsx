
import React from 'react';
import { DashboardLayoutTalentHub } from '@/components/dashboard/DashboardLayout_talenthub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Save,
  Eye,
  MapPin,
  DollarSign,
  Clock,
  Users
} from 'lucide-react';

const CreatePositionTalentHub: React.FC = () => {
  return (
    <DashboardLayoutTalentHub>
      <div className="min-h-screen bg-[hsl(var(--talenthub-secondary))]">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[hsl(var(--talenthub-secondary-foreground))]">
                Create New Position
              </h1>
              <p className="text-[hsl(var(--talenthub-muted-foreground))] mt-1">
                Post a new job opening to attract top talent
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-[hsl(var(--talenthub-border))]">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button className="bg-[hsl(var(--talenthub-primary))] hover:bg-[hsl(var(--talenthub-primary))]/90">
                <Save className="w-4 h-4 mr-2" />
                Publish Position
              </Button>
            </div>
          </div>

          {/* Basic Information */}
          <Card className="bg-white border-[hsl(var(--talenthub-border))]">
            <CardHeader>
              <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))]">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Job Title *
                  </label>
                  <Input
                    placeholder="e.g., Senior Frontend Developer"
                    className="border-[hsl(var(--talenthub-border))]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Department
                  </label>
                  <Select>
                    <SelectTrigger className="border-[hsl(var(--talenthub-border))]">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Employment Type
                  </label>
                  <Select>
                    <SelectTrigger className="border-[hsl(var(--talenthub-border))]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Experience Level
                  </label>
                  <Select>
                    <SelectTrigger className="border-[hsl(var(--talenthub-border))]">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="lead">Lead/Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Work Type
                  </label>
                  <Select>
                    <SelectTrigger className="border-[hsl(var(--talenthub-border))]">
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--talenthub-muted-foreground))]" />
                  <Input
                    placeholder="e.g., San Francisco, CA or Remote"
                    className="pl-10 border-[hsl(var(--talenthub-border))]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card className="bg-white border-[hsl(var(--talenthub-border))]">
            <CardHeader>
              <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[hsl(var(--talenthub-primary))]" />
                Compensation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Minimum Salary
                  </label>
                  <Input
                    placeholder="e.g., 100000"
                    type="number"
                    className="border-[hsl(var(--talenthub-border))]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Maximum Salary
                  </label>
                  <Input
                    placeholder="e.g., 150000"
                    type="number"
                    className="border-[hsl(var(--talenthub-border))]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Frequency
                  </label>
                  <Select>
                    <SelectTrigger className="border-[hsl(var(--talenthub-border))]">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                  Benefits & Perks
                </label>
                <Textarea
                  placeholder="Describe compensation benefits, equity, bonuses, etc."
                  className="border-[hsl(var(--talenthub-border))] min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="bg-white border-[hsl(var(--talenthub-border))]">
            <CardHeader>
              <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))]">
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                  Role Overview
                </label>
                <Textarea
                  placeholder="Provide a brief overview of the role and what the candidate will be doing..."
                  className="border-[hsl(var(--talenthub-border))] min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                  Key Responsibilities
                </label>
                <Textarea
                  placeholder="• List the primary responsibilities and duties
• Use bullet points for clarity
• Include day-to-day tasks and long-term goals"
                  className="border-[hsl(var(--talenthub-border))] min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                  Required Qualifications
                </label>
                <Textarea
                  placeholder="• List must-have skills and experience
• Include education requirements if applicable
• Specify years of experience needed"
                  className="border-[hsl(var(--talenthub-border))] min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                  Preferred Qualifications
                </label>
                <Textarea
                  placeholder="• List nice-to-have skills and experience
• Include additional certifications or expertise
• Mention any specific tools or technologies"
                  className="border-[hsl(var(--talenthub-border))] min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayoutTalentHub>
  );
};

export default CreatePositionTalentHub;
