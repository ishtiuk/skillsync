
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LinkedinIcon,
  Globe,
  Mail,
  Phone,
  MapPin,
  User,
  Building2,
  Github,
  Twitter,
  Users,
  Target
} from 'lucide-react';

export const ProfileSidebarTalentHub: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card className="bg-white border-[hsl(var(--talenthub-border))]">
        <CardHeader>
          <CardTitle className="text-lg text-[hsl(var(--talenthub-secondary-foreground))]">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-[hsl(var(--talenthub-primary))]" />
            <span className="break-all text-[hsl(var(--talenthub-muted-foreground))]">{user.email}</span>
          </div>

          {user.phone_number && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-[hsl(var(--talenthub-primary))]" />
              <span className="text-[hsl(var(--talenthub-muted-foreground))]">{user.phone_number}</span>
            </div>
          )}

          {(user.city || user.state || user.country) && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-[hsl(var(--talenthub-primary))]" />
              <span className="text-[hsl(var(--talenthub-muted-foreground))]">
                {[user.city, user.state, user.country].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Links */}
      {(user.linkedin_url || user.github_url || user.x_twitter_url || user.personal_website_url) && (
        <Card className="bg-white border-[hsl(var(--talenthub-border))]">
          <CardHeader>
            <CardTitle className="text-lg text-[hsl(var(--talenthub-secondary-foreground))]">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.linkedin_url && (
              <a
                href={user.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-[hsl(var(--talenthub-primary))] hover:text-[hsl(var(--talenthub-primary))]/80 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn Profile</span>
              </a>
            )}

            {user.github_url && (
              <a
                href={user.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-[hsl(var(--talenthub-primary))] hover:text-[hsl(var(--talenthub-primary))]/80 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>
            )}

            {user.x_twitter_url && (
              <a
                href={user.x_twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-[hsl(var(--talenthub-primary))] hover:text-[hsl(var(--talenthub-primary))]/80 transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>X (Twitter) Profile</span>
              </a>
            )}

            {user.personal_website_url && (
              <a
                href={user.personal_website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-[hsl(var(--talenthub-primary))] hover:text-[hsl(var(--talenthub-primary))]/80 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Personal Website</span>
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recruiter Statistics */}
      <Card className="bg-white border-[hsl(var(--talenthub-border))]">
        <CardHeader>
          <CardTitle className="text-lg text-[hsl(var(--talenthub-secondary-foreground))]">Recruiter Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">Active Positions</span>
            <Badge variant="secondary" className="bg-[hsl(var(--talenthub-primary))]/10 text-[hsl(var(--talenthub-primary))]">8</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">Candidates Reviewed</span>
            <Badge variant="outline" className="border-[hsl(var(--talenthub-border))] text-[hsl(var(--talenthub-muted-foreground))]">156</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">Successful Hires</span>
            <Badge variant="outline" className="border-[hsl(var(--talenthub-border))] text-[hsl(var(--talenthub-muted-foreground))]">23</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">Response Rate</span>
            <Badge variant="secondary" className="bg-[hsl(var(--talenthub-primary))]/10 text-[hsl(var(--talenthub-primary))]">87%</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white border-[hsl(var(--talenthub-border))]">
        <CardHeader>
          <CardTitle className="text-lg text-[hsl(var(--talenthub-secondary-foreground))]">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start border-[hsl(var(--talenthub-border))] text-[hsl(var(--talenthub-muted-foreground))] hover:bg-[hsl(var(--talenthub-accent))]"
            onClick={() => window.open(`/talenthub/profile/${user.id}`, '_blank')}
          >
            <User className="w-4 h-4 mr-2" />
            View Public Profile
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start border-[hsl(var(--talenthub-border))] text-[hsl(var(--talenthub-muted-foreground))] hover:bg-[hsl(var(--talenthub-accent))]"
          >
            <Target className="w-4 h-4 mr-2" />
            Create New Position
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start border-[hsl(var(--talenthub-border))] text-[hsl(var(--talenthub-muted-foreground))] hover:bg-[hsl(var(--talenthub-accent))]"
          >
            <Users className="w-4 h-4 mr-2" />
            Browse Candidates
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start border-[hsl(var(--talenthub-border))] text-[hsl(var(--talenthub-muted-foreground))] hover:bg-[hsl(var(--talenthub-accent))]"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Organization Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
