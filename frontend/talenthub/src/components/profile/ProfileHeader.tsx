
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Calendar, Plus, Building2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProfileImageUpload } from './ProfileImageUpload';

export const ProfileHeader: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-[hsl(var(--talenthub-primary))]/10 to-[hsl(var(--talenthub-primary))]/5 rounded-lg p-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <ProfileImageUpload>
          <div className="relative cursor-pointer">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={user.profile_picture_download_url || user.profile_picture_url}
                alt={`${user.first_name} ${user.last_name}`}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-[hsl(var(--talenthub-primary))]/20 text-[hsl(var(--talenthub-primary))]">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 rounded-full bg-[hsl(var(--talenthub-primary))] hover:bg-[hsl(var(--talenthub-primary))]/90 text-white p-1.5 shadow-lg">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </ProfileImageUpload>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[hsl(var(--talenthub-secondary-foreground))]">
                {user.first_name} {user.last_name}
              </h1>
              {user.current_job_title && (
                <p className="text-lg text-[hsl(var(--talenthub-muted-foreground))] mt-1">{user.current_job_title}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-[hsl(var(--talenthub-muted-foreground))]">
                {user.city && user.state && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.city}, {user.state}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>TalentHub Recruiter</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Member since 2024</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-[hsl(var(--talenthub-primary))]/10 text-[hsl(var(--talenthub-primary))]">
              Recruiter
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
