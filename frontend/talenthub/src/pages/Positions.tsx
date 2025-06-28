
import React from 'react';
import { DashboardLayoutTalentHub } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react';

const PositionsTalentHub: React.FC = () => {
  const positions = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      applicants: 23,
      status: "Active",
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      salary: "$130,000 - $160,000",
      applicants: 15,
      status: "Active",
      posted: "5 days ago"
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      location: "New York, NY",
      type: "Full-time",
      salary: "$90,000 - $110,000",
      applicants: 31,
      status: "Active",
      posted: "1 week ago"
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
                Open Positions
              </h1>
              <p className="text-[hsl(var(--talenthub-muted-foreground))] mt-1">
                Manage and track all your job openings
              </p>
            </div>
            <Button className="bg-[hsl(var(--talenthub-primary))] hover:bg-[hsl(var(--talenthub-primary))]/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Position
            </Button>
          </div>

          {/* Filters */}
          <Card className="bg-white border-[hsl(var(--talenthub-border))]">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--talenthub-muted-foreground))]" />
                  <Input
                    placeholder="Search positions..."
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

          {/* Positions Grid */}
          <div className="grid gap-4">
            {positions.map((position) => (
              <Card key={position.id} className="bg-white border-[hsl(var(--talenthub-border))] hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-[hsl(var(--talenthub-secondary-foreground))]">
                          {position.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-[hsl(var(--talenthub-primary))]/10 text-[hsl(var(--talenthub-primary))]"
                        >
                          {position.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[hsl(var(--talenthub-muted-foreground))]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>{position.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{position.applicants} applicants</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Posted {position.posted}</span>
                        </div>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="bg-[hsl(var(--talenthub-primary))] hover:bg-[hsl(var(--talenthub-primary))]/90">
                      View Applications
                    </Button>
                    <Button variant="outline" size="sm" className="border-[hsl(var(--talenthub-border))]">
                      Edit Position
                    </Button>
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

export default PositionsTalentHub;
