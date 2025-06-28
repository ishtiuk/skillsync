
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import {
  Edit3,
  Building2,
  Users,
  Target,
  TrendingUp,
  BrainCircuit,
  Calendar,
  Star,
  MessageSquare
} from 'lucide-react';

const ProfileTalentHub: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--talenthub-secondary))]">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <ProfileHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Professional Summary */}
              <Card className="bg-white border-[hsl(var(--talenthub-border))]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))]">Professional Summary</CardTitle>
                  <Button variant="ghost" size="sm" className="text-[hsl(var(--talenthub-primary))] hover:bg-[hsl(var(--talenthub-accent))]">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-[hsl(var(--talenthub-muted-foreground))] leading-relaxed">
                    {user.career_summary ||
                      "Experienced talent acquisition professional with a proven track record of identifying and recruiting top-tier candidates across various industries. Passionate about connecting exceptional talent with innovative companies to drive mutual success."
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Recruiting Expertise */}
              <Card className="bg-white border-[hsl(var(--talenthub-border))]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))]">Recruiting Expertise</CardTitle>
                  <Button variant="ghost" size="sm" className="text-[hsl(var(--talenthub-primary))] hover:bg-[hsl(var(--talenthub-accent))]">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(user.skills || ['Technical Recruiting', 'Executive Search', 'Talent Sourcing', 'Interview Coordination', 'Candidate Experience', 'Market Research', 'Employer Branding', 'Diversity Hiring']).map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-[hsl(var(--talenthub-primary))]/10 text-[hsl(var(--talenthub-primary))] border-[hsl(var(--talenthub-primary))]/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Performance */}
              <Card className="bg-white border-[hsl(var(--talenthub-border))]">
                <CardHeader>
                  <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[hsl(var(--talenthub-primary))]" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[hsl(var(--talenthub-secondary))] p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">Active Positions</p>
                          <p className="text-2xl font-bold text-[hsl(var(--talenthub-primary))]">8</p>
                        </div>
                        <Target className="w-8 h-8 text-[hsl(var(--talenthub-primary))]" />
                      </div>
                    </div>
                    <div className="bg-[hsl(var(--talenthub-secondary))] p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">Candidates Sourced</p>
                          <p className="text-2xl font-bold text-[hsl(var(--talenthub-primary))]">156</p>
                        </div>
                        <Users className="w-8 h-8 text-[hsl(var(--talenthub-primary))]" />
                      </div>
                    </div>
                    <div className="bg-[hsl(var(--talenthub-secondary))] p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">Successful Hires</p>
                          <p className="text-2xl font-bold text-[hsl(var(--talenthub-primary))]">23</p>
                        </div>
                        <Star className="w-8 h-8 text-[hsl(var(--talenthub-primary))]" />
                      </div>
                    </div>
                    <div className="bg-[hsl(var(--talenthub-secondary))] p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">Response Rate</p>
                          <p className="text-2xl font-bold text-[hsl(var(--talenthub-primary))]">87%</p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-[hsl(var(--talenthub-primary))]" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white border-[hsl(var(--talenthub-border))]">
                <CardHeader>
                  <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[hsl(var(--talenthub-primary))]" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-[hsl(var(--talenthub-secondary))] rounded-lg">
                      <div className="w-2 h-2 bg-[hsl(var(--talenthub-primary))] rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-[hsl(var(--talenthub-secondary-foreground))]">Interviewed 3 candidates for Senior Frontend Developer position</p>
                        <p className="text-xs text-[hsl(var(--talenthub-muted-foreground))]">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-[hsl(var(--talenthub-secondary))] rounded-lg">
                      <div className="w-2 h-2 bg-[hsl(var(--talenthub-primary))] rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-[hsl(var(--talenthub-secondary-foreground))]">Created new position: Product Manager at TechCorp</p>
                        <p className="text-xs text-[hsl(var(--talenthub-muted-foreground))]">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-[hsl(var(--talenthub-secondary))] rounded-lg">
                      <div className="w-2 h-2 bg-[hsl(var(--talenthub-primary))] rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-[hsl(var(--talenthub-secondary-foreground))]">Sourced 12 new candidates using AI matching</p>
                        <p className="text-xs text-[hsl(var(--talenthub-muted-foreground))]">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="bg-white border-[hsl(var(--talenthub-border))]">
                <CardHeader>
                  <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))] flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-[hsl(var(--talenthub-primary))]" />
                    AI Recruiting Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-[hsl(var(--talenthub-primary))]/5 border border-[hsl(var(--talenthub-primary))]/10 rounded-lg">
                      <p className="text-sm text-[hsl(var(--talenthub-secondary-foreground))]">
                        📈 Your response rate increased by 15% this month. Consider using similar messaging patterns.
                      </p>
                    </div>
                    <div className="p-3 bg-[hsl(var(--talenthub-primary))]/5 border border-[hsl(var(--talenthub-primary))]/10 rounded-lg">
                      <p className="text-sm text-[hsl(var(--talenthub-secondary-foreground))]">
                        🎯 12 new candidates match your open Frontend Developer position criteria.
                      </p>
                    </div>
                    <div className="p-3 bg-[hsl(var(--talenthub-primary))]/5 border border-[hsl(var(--talenthub-primary))]/10 rounded-lg">
                      <p className="text-sm text-[hsl(var(--talenthub-secondary-foreground))]">
                        💡 Peak candidate activity times: Tuesday-Thursday, 10 AM - 2 PM.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileTalentHub;
