
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Star,
  Building2,
  ArrowRight,
  Briefcase,
  BookOpen,
  Target,
  Award
} from 'lucide-react';

const Index = () => {
  const featuredJobs = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      company: "TechFlow Solutions",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120K - $180K",
      posted: "2 days ago",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center",
      tags: ["React", "Node.js", "TypeScript"]
    },
    {
      id: 2,
      title: "Product Manager",
      company: "InnovateLabs",
      location: "New York, NY",
      type: "Full-time",
      salary: "$110K - $160K",
      posted: "1 day ago",
      logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=64&h=64&fit=crop&crop=center",
      tags: ["Strategy", "Analytics", "Leadership"]
    },
    {
      id: 3,
      title: "UX Designer",
      company: "DesignStudio",
      location: "Remote",
      type: "Contract",
      salary: "$80K - $120K",
      posted: "3 days ago",
      logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=64&h=64&fit=crop&crop=center",
      tags: ["Figma", "User Research", "Prototyping"]
    }
  ];

  const careerResources = [
    {
      title: "Resume Builder",
      description: "Create a professional resume in minutes",
      icon: BookOpen,
      link: "#"
    },
    {
      title: "Interview Prep",
      description: "Practice with AI-powered mock interviews",
      icon: Target,
      link: "#"
    },
    {
      title: "Skill Assessment",
      description: "Validate your skills with certifications",
      icon: Award,
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Forge Your Perfect
              <span className="text-primary block">Career Path</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
              Discover opportunities that match your skills, grow your career, and connect with top companies in the B2B space.
            </p>

            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <Button className="py-3 bg-primary hover:bg-primary-600 text-lg font-semibold">
                  Find Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">25,000+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">1M+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Career Resources</h2>
            <p className="text-gray-600">Tools to help you succeed in your job search</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careerResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <resource.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  <Button variant="outline" size="sm">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
              <p className="text-gray-600">Hand-picked opportunities from top companies</p>
            </div>
            <Link to="/jobs">
              <Button variant="outline" className="hover:bg-primary hover:text-white">
                View All Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 hover:text-primary">
                          {job.title}
                        </CardTitle>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                    </div>
                    <Star className="h-5 w-5 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{job.type} • {job.posted}</span>
                    </div>
                    <div className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm">{job.salary}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-primary-50 text-primary hover:bg-primary-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Forge Your Future?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of professionals who have found their dream careers through CareerForge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Create Your Profile
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Upload Resume
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">CareerForge</span>
              </div>
              <p className="text-gray-400">
                Forging successful careers in the B2B world.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Job Seekers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white">Career Resources</a></li>
                <li><a href="#" className="hover:text-white">Resume Builder</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Interview Tips</a></li>
                <li><a href="#" className="hover:text-white">Salary Guide</a></li>
                <li><a href="#" className="hover:text-white">Career Advice</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CareerForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
