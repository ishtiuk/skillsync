
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Target,
  TrendingUp,
  Building2,
  Plus,
  Calendar,
  BrainCircuit,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const DashboardTalentHub: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[hsl(var(--talenthub-secondary))]">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[hsl(var(--talenthub-secondary-foreground))]">
                TalentHub Dashboard
              </h1>
              <p className="text-[hsl(var(--talenthub-muted-foreground))] mt-1">
                Welcome back! Here's your recruiting overview.
              </p>
            </div>
            <Button className="bg-[hsl(var(--talenthub-primary))] hover:bg-[hsl(var(--talenthub-primary))]/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Position
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border-[hsl(var(--talenthub-border))]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">Active Positions</p>
                    <p className="text-2xl font-bold text-[hsl(var(--talenthub-primary))]">12</p>
                  </div>
                  <Target className="w-8 h-8 text-[hsl(var(--talenthub-primary))]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[hsl(var(--talenthub-border))]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">Total Candidates</p>
                    <p className="text-2xl font-bold text-[hsl(var(--talenthub-primary))]">234</p>
                  </div>
                  <Users className="w-8 h-8 text-[hsl(var(--talenthub-primary))]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[hsl(var(--talenthub-border))]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">This Month Hires</p>
                    <p className="text-2xl font-bold text-[hsl(var(--talenthub-primary))]">8</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-[hsl(var(--talenthub-primary))]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[hsl(var(--talenthub-border))]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">Response Rate</p>
                    <p className="text-2xl font-bold text-[hsl(var(--talenthub-primary))]">87%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[hsl(var(--talenthub-primary))]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-[hsl(var(--talenthub-border))]">
              <CardHeader>
                <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))] flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-[hsl(var(--talenthub-primary))]" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-[hsl(var(--talenthub-primary))]/5 border border-[hsl(var(--talenthub-primary))]/10 rounded-lg">
                  <p className="text-sm text-[hsl(var(--talenthub-secondary-foreground))]">
                    15 new candidates match your Frontend Developer position
                  </p>
                  <Button variant="ghost" size="sm" className="text-[hsl(var(--talenthub-primary))] p-0 h-auto mt-2">
                    Review Matches <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
                <div className="p-3 bg-[hsl(var(--talenthub-primary))]/5 border border-[hsl(var(--talenthub-primary))]/10 rounded-lg">
                  <p className="text-sm text-[hsl(var(--talenthub-secondary-foreground))]">
                    Update your Product Manager job description for better reach
                  </p>
                  <Button variant="ghost" size="sm" className="text-[hsl(var(--talenthub-primary))] p-0 h-auto mt-2">
                    View Suggestions <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[hsl(var(--talenthub-border))]">
              <CardHeader>
                <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[hsl(var(--talenthub-primary))]" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[hsl(var(--talenthub-primary))] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-[hsl(var(--talenthub-secondary-foreground))]">
                      New application for Senior Developer position
                    </p>
                    <p className="text-xs text-[hsl(var(--talenthub-muted-foreground))]">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[hsl(var(--talenthub-primary))] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-[hsl(var(--talenthub-secondary-foreground))]">
                      Interview scheduled with Sarah Johnson
                    </p>
                    <p className="text-xs text-[hsl(var(--talenthub-muted-foreground))]">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[hsl(var(--talenthub-primary))] rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-[hsl(var(--talenthub-secondary-foreground))]">
                      Posted new UX Designer position
                    </p>
                    <p className="text-xs text-[hsl(var(--talenthub-muted-foreground))]">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardTalentHub;
