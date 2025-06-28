
import React from 'react';
import { DashboardLayoutTalentHub } from '@/components/dashboard/DashboardLayout_talenthub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  Edit3,
  Save,
  MapPin,
  Globe,
  Users,
  Mail,
  Phone
} from 'lucide-react';

const OrganizationTalentHub: React.FC = () => {
  return (
    <DashboardLayoutTalentHub>
      <div className="min-h-screen bg-[hsl(var(--talenthub-secondary))]">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[hsl(var(--talenthub-secondary-foreground))]">
                Organization Settings
              </h1>
              <p className="text-[hsl(var(--talenthub-muted-foreground))] mt-1">
                Manage your company profile and settings
              </p>
            </div>
            <Button className="bg-[hsl(var(--talenthub-primary))] hover:bg-[hsl(var(--talenthub-primary))]/90">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>

          {/* Company Profile */}
          <Card className="bg-white border-[hsl(var(--talenthub-border))]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[hsl(var(--talenthub-primary))]" />
                Company Profile
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[hsl(var(--talenthub-primary))]">
                <Edit3 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Company Name
                  </label>
                  <Input
                    placeholder="Enter company name"
                    defaultValue="TechCorp Inc."
                    className="border-[hsl(var(--talenthub-border))]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Industry
                  </label>
                  <Input
                    placeholder="e.g., Technology, Healthcare"
                    defaultValue="Technology"
                    className="border-[hsl(var(--talenthub-border))]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                  Company Description
                </label>
                <Textarea
                  placeholder="Describe your company..."
                  defaultValue="We are a leading technology company focused on innovative solutions."
                  className="border-[hsl(var(--talenthub-border))] min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--talenthub-muted-foreground))]" />
                    <Input
                      placeholder="https://yourcompany.com"
                      defaultValue="https://techcorp.com"
                      className="pl-10 border-[hsl(var(--talenthub-border))]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Company Size
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--talenthub-muted-foreground))]" />
                    <Input
                      placeholder="e.g., 50-100 employees"
                      defaultValue="100-250 employees"
                      className="pl-10 border-[hsl(var(--talenthub-border))]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white border-[hsl(var(--talenthub-border))]">
            <CardHeader>
              <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))]">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--talenthub-muted-foreground))]" />
                  <Input
                    placeholder="Company address"
                    defaultValue="123 Tech Street, San Francisco, CA 94105"
                    className="pl-10 border-[hsl(var(--talenthub-border))]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Contact Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--talenthub-muted-foreground))]" />
                    <Input
                      placeholder="contact@company.com"
                      defaultValue="hr@techcorp.com"
                      className="pl-10 border-[hsl(var(--talenthub-border))]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[hsl(var(--talenthub-secondary-foreground))]">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--talenthub-muted-foreground))]" />
                    <Input
                      placeholder="+1 (555) 123-4567"
                      defaultValue="+1 (415) 555-0123"
                      className="pl-10 border-[hsl(var(--talenthub-border))]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Settings */}
          <Card className="bg-white border-[hsl(var(--talenthub-border))]">
            <CardHeader>
              <CardTitle className="text-xl text-[hsl(var(--talenthub-secondary-foreground))]">
                Team & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[hsl(var(--talenthub-secondary))] rounded-lg">
                  <div>
                    <h4 className="font-medium text-[hsl(var(--talenthub-secondary-foreground))]">Admin Access</h4>
                    <p className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">Full access to all features</p>
                  </div>
                  <Badge className="bg-[hsl(var(--talenthub-primary))]/10 text-[hsl(var(--talenthub-primary))]">
                    You
                  </Badge>
                </div>
                <Button variant="outline" className="w-full border-[hsl(var(--talenthub-border))]">
                  + Invite Team Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayoutTalentHub>
  );
};

export default OrganizationTalentHub;
