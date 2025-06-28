
import React from 'react';
import { DashboardLayoutTalentHub } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Briefcase,
  Star,
  MessageSquare,
  Eye
} from 'lucide-react';

const CandidatesTalentHub: React.FC = () => {
  const candidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior Frontend Developer",
      location: "San Francisco, CA",
      experience: "5 years",
      skills: ["React", "TypeScript", "Next.js"],
      rating: 4.8,
      status: "Available",
      avatar: null
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Product Manager",
      location: "New York, NY",
      experience: "7 years",
      skills: ["Product Strategy", "Analytics", "Agile"],
      rating: 4.9,
      status: "Interviewing",
      avatar: null
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "UX Designer",
      location: "Remote",
      experience: "4 years",
      skills: ["Figma", "User Research", "Prototyping"],
      rating: 4.7,
      status: "Available",
      avatar: null
    }
  ];

  return (
    <DashboardLayoutTalentHub>
      <div className="min-h-screen bg-[hsl(var(--talenthub-secondary))]">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[hsl(var(--talenthub-secondary-foreground))]">
                Candidate Pool
              </h1>
              <p className="text-[hsl(var(--talenthub-muted-foreground))] mt-1">
                Discover and manage talented candidates
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="bg-white border-[hsl(var(--talenthub-border))]">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--talenthub-muted-foreground))]" />
                  <Input
                    placeholder="Search candidates..."
                    className="pl-10 border-[hsl(var(--talenthub-border))]"
                  />
                </div>
                <Button variant="outline" className="border-[hsl(var(--talenthub-border))]">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="bg-white border-[hsl(var(--talenthub-border))] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback className="bg-[hsl(var(--talenthub-primary))]/20 text-[hsl(var(--talenthub-primary))]">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-[hsl(var(--talenthub-secondary-foreground))]">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-[hsl(var(--talenthub-muted-foreground))]">
                          {candidate.title}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--talenthub-muted-foreground))]">
                      <MapPin className="w-4 h-4" />
                      <span>{candidate.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--talenthub-muted-foreground))]">
                      <Briefcase className="w-4 h-4" />
                      <span>{candidate.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--talenthub-muted-foreground))]">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{candidate.rating} rating</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-[hsl(var(--talenthub-primary))]/10 text-[hsl(var(--talenthub-primary))] text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={candidate.status === 'Available' ? 'default' : 'secondary'}
                      className={candidate.status === 'Available'
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {candidate.status}
                    </Badge>

                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayoutTalentHub>
  );
};

export default CandidatesTalentHub;
