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
  Briefcase,
  Github,
  Twitter
} from 'lucide-react';

export const ProfileSidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-primary" />
            <span className="break-all">{user.email}</span>
          </div>

          {user.phone_number && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span>{user.phone_number}</span>
            </div>
          )}

          {(user.city || user.state || user.country) && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>
                {[user.city, user.state, user.country].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Links */}
      {(user.linkedin_url || user.github_url || user.x_twitter_url || user.personal_website_url) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.linkedin_url && (
              <a
                href={user.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-primary hover:text-primary/80 transition-colors"
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
                className="flex items-center gap-3 text-sm text-primary hover:text-primary/80 transition-colors"
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
                className="flex items-center gap-3 text-sm text-primary hover:text-primary/80 transition-colors"
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
                className="flex items-center gap-3 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Personal Website</span>
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Profile Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Profile Completeness</span>
            <Badge variant="secondary">85%</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Jobs Applied</span>
            <Badge variant="outline">12</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Profile Views</span>
            <Badge variant="outline">47</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => window.open(`/profile/${user.id}`, '_blank')}
          >
            <User className="w-4 h-4 mr-2" />
            View Public Profile
          </Button>

          <Button variant="outline" size="sm" className="w-full justify-start">
            <Briefcase className="w-4 h-4 mr-2" />
            Job Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
