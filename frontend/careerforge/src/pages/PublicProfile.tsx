import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Briefcase,
  LinkedinIcon,
  Github,
  Twitter,
  Globe,
  Building2
} from 'lucide-react';
import { formatDateRange } from '@/lib/utils';
import { users } from '@/lib/api';

interface PublicUser {
  first_name: string;
  last_name: string;
  city?: string;
  state?: string;
  country?: string;
  linkedin_url?: string;
  github_url?: string;
  x_twitter_url?: string;
  career_summary?: string;
  personal_website_url?: string;
  current_job_title?: string;
  skills?: string[];
  profile_picture_url?: string;
  current_career?: string;
}

interface Experience {
  organization_name: string;
  start_year: number;
  end_year?: number;
  position_title: string;
  logo_url?: string;
  employment_type: string;
  start_month: number;
  end_month?: number;
}

const PublicProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError('No user ID provided');
        setLoading(false);
        return;
      }

      try {
        const data = await users.getPublicProfile(userId);
        setUser(data);
        setExperiences(data.job_experiences || []);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">{error || 'The profile you\'re looking for doesn\'t exist or is private.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
              {user.profile_picture_url ? (
                <img
                  src={user.profile_picture_url}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                `${user.first_name[0]}${user.last_name[0]}`
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h1>
                  {user.current_job_title && (
                    <p className="text-lg text-gray-600 mt-1">{user.current_job_title}</p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    {user.city && user.state && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.city}, {user.state}</span>
                      </div>
                    )}
                    {user.current_career && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{user.current_career}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
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
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Career Summary */}
            {user.career_summary && (
              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: user.career_summary }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {experiences.map((exp, index) => (
                      <div key={index} className="flex gap-4 pb-4 last:pb-0 last:border-0 border-b">
                        <div className="w-12 h-12 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {exp.logo_url ? (
                            <img
                              src={exp.logo_url}
                              alt={exp.organization_name}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{exp.position_title}</h3>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">{exp.organization_name}</span>
                            <span className="text-gray-400 mx-2">•</span>
                            <span>{exp.employment_type}</span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {formatDateRange(exp.start_month, exp.start_year, exp.end_month, exp.end_year)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg p-8">
        <div className="flex gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export default PublicProfile;
