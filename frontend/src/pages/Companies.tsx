
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  MapPin,
  Users,
  Building2,
  Star,
  TrendingUp,
  Filter,
  ChevronDown,
  Globe,
  Calendar
} from 'lucide-react';

const Companies = () => {
  const companies = [
    {
      id: 1,
      name: "TechFlow Solutions",
      industry: "Software Development",
      size: "201-500 employees",
      location: "San Francisco, CA",
      openJobs: 12,
      rating: 4.8,
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop&crop=center",
      description: "Leading provider of enterprise software solutions, helping businesses transform digitally with cutting-edge technology.",
      specialties: ["Cloud Computing", "AI/ML", "Enterprise Software"],
      founded: "2015",
      website: "techflow.com",
      culture: ["Innovation-driven", "Work-life balance", "Remote-friendly"]
    },
    {
      id: 2,
      name: "DataVision Inc",
      industry: "Data Analytics",
      size: "51-200 employees",
      location: "New York, NY",
      openJobs: 8,
      rating: 4.6,
      logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=80&h=80&fit=crop&crop=center",
      description: "Transforming raw data into actionable insights for Fortune 500 companies through advanced analytics platforms.",
      specialties: ["Big Data", "Analytics", "Business Intelligence"],
      founded: "2018",
      website: "datavision.com",
      culture: ["Data-driven", "Collaborative", "Growth-focused"]
    },
    {
      id: 3,
      name: "DesignCraft Studio",
      industry: "Design & Creative",
      size: "11-50 employees",
      location: "Remote",
      openJobs: 5,
      rating: 4.9,
      logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=80&h=80&fit=crop&crop=center",
      description: "Award-winning design studio creating beautiful digital experiences for modern brands and B2B platforms.",
      specialties: ["UX/UI Design", "Brand Design", "Digital Strategy"],
      founded: "2020",
      website: "designcraft.studio",
      culture: ["Creative freedom", "Remote-first", "Design excellence"]
    },
    {
      id: 4,
      name: "CloudScale Technologies",
      industry: "Cloud Services",
      size: "501-1000 employees",
      location: "Austin, TX",
      openJobs: 18,
      rating: 4.7,
      logo: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=80&h=80&fit=crop&crop=center",
      description: "Infrastructure-as-a-Service provider enabling scalable cloud solutions for enterprise customers worldwide.",
      specialties: ["Cloud Infrastructure", "DevOps", "Security"],
      founded: "2012",
      website: "cloudscale.tech",
      culture: ["Technical excellence", "Team collaboration", "Innovation"]
    },
    {
      id: 5,
      name: "GrowthTech Solutions",
      industry: "Marketing Technology",
      size: "101-200 employees",
      location: "Chicago, IL",
      openJobs: 7,
      rating: 4.5,
      logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=80&h=80&fit=crop&crop=center",
      description: "Helping B2B companies scale their marketing and sales operations through intelligent automation platforms.",
      specialties: ["MarTech", "Sales Automation", "Growth Strategy"],
      founded: "2017",
      website: "growthtech.co",
      culture: ["Results-driven", "Fast-paced", "Learning culture"]
    },
    {
      id: 6,
      name: "Analytics Pro",
      industry: "Data Science",
      size: "201-500 employees",
      location: "Seattle, WA",
      openJobs: 15,
      rating: 4.8,
      logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=80&h=80&fit=crop&crop=center",
      description: "Advanced analytics and machine learning solutions for enterprise clients across various industries.",
      specialties: ["Machine Learning", "Data Science", "Predictive Analytics"],
      founded: "2014",
      website: "analyticspro.ai",
      culture: ["Research-focused", "Continuous learning", "Diversity & inclusion"]
    }
  ];

  const industries = [
    "All Industries",
    "Software Development",
    "Data Analytics",
    "Design & Creative",
    "Cloud Services",
    "Marketing Technology",
    "Data Science"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Companies</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore company cultures, learn about their missions, and find the perfect place to grow your career.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search companies..."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none">
                  {industries.map((industry) => (
                    <option key={industry}>{industry}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1">Search</Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Company Size</h3>
                  <div className="space-y-2">
                    {['Startup (1-50)', 'Small (51-200)', 'Medium (201-1000)', 'Large (1000+)'].map((size) => (
                      <label key={size} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Rating</h3>
                  <div className="space-y-2">
                    {['4.5+ stars', '4.0+ stars', '3.5+ stars', '3.0+ stars'].map((rating) => (
                      <label key={rating} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{rating}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Work Style</h3>
                  <div className="space-y-2">
                    {['Remote-friendly', 'On-site', 'Hybrid', 'Flexible hours'].map((style) => (
                      <label key={style} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Listings */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {companies.length} Companies
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="border border-gray-200 rounded-md px-3 py-1 text-sm">
                  <option>Rating</option>
                  <option>Most Jobs</option>
                  <option>Company Name</option>
                  <option>Company Size</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {companies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-primary mb-1">
                              {company.name}
                            </h3>
                            <p className="text-gray-600">{company.industry}</p>
                          </div>
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium text-gray-700">{company.rating}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{company.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {company.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              {company.size}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              Founded {company.founded}
                            </div>
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2" />
                              {company.website}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
                          <div className="flex flex-wrap gap-2">
                            {company.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="bg-primary-50 text-primary">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Company Culture</h4>
                          <div className="flex flex-wrap gap-2">
                            {company.culture.map((trait) => (
                              <Badge key={trait} variant="outline" className="text-gray-600">
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center text-primary font-semibold">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span className="text-sm">{company.openJobs} open positions</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              View Company
                            </Button>
                            <Button size="sm">
                              View Jobs
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Companies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
