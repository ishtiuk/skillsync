import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw } from 'lucide-react';

interface JobFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    title: '',
    company: '',
    categories: [] as string[],
    positionTypes: [] as string[],
    experienceLevels: [] as string[],
    workplaceTypes: [] as string[],
    city: '',
    state: '',
    country: '',
    payType: '',
    minPay: '',
    maxPay: '',
    payFrequency: '',
    bipocOwned: false,
  });

  const jobCategories = [
    'Software Engineering', 'Supply Chain', 'HR', 'Advocacy & Policy',
    'Climate & Sustainability', 'Investment', 'Sales & Account Management',
    'Content', 'Marketing & Design', 'Product', 'Data', 'Education',
    'Finance, Legal & Compliance', 'Operations, Program Management & Strategy', 'Science'
  ];

  const positionTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Volunteer'];
  const experienceLevels = ['Entry', 'Mid', 'Senior', 'Executive', 'Intermediate'];
  const workplaceTypes = ['Onsite', 'Remote', 'Hybrid'];
  const payFrequencies = ['Weekly', 'Bi-Weekly', 'Monthly'];

  const handleMultiSelectChange = (field: string, value: string) => {
    const currentValues = filters[field as keyof typeof filters] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];

    const newFilters = { ...filters, [field]: newValues };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleInputChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleBooleanChange = (field: string, value: boolean) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      title: '',
      company: '',
      categories: [],
      positionTypes: [],
      experienceLevels: [],
      workplaceTypes: [],
      city: '',
      state: '',
      country: '',
      payType: '',
      minPay: '',
      maxPay: '',
      payFrequency: '',
      bipocOwned: false,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.title) count++;
    if (filters.company) count++;
    count += filters.categories.length;
    count += filters.positionTypes.length;
    count += filters.experienceLevels.length;
    count += filters.workplaceTypes.length;
    if (filters.city) count++;
    if (filters.state) count++;
    if (filters.country) count++;
    if (filters.payType) count++;
    if (filters.minPay) count++;
    if (filters.maxPay) count++;
    if (filters.payFrequency) count++;
    if (filters.bipocOwned) count++;
    return count;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
            )}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Search */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="title">Job Title/Keywords</Label>
            <Input
              id="title"
              placeholder="e.g. Software Engineer"
              value={filters.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="e.g. Google"
              value={filters.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
            />
          </div>
        </div>

        {/* Job Categories */}
        <div>
          <Label className="text-sm font-medium">Job Categories</Label>
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
            {jobCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => handleMultiSelectChange('categories', category)}
                />
                <Label htmlFor={category} className="text-sm">{category}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Position Types */}
        <div>
          <Label className="text-sm font-medium">Position Type</Label>
          <div className="mt-2 space-y-2">
            {positionTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={filters.positionTypes.includes(type)}
                  onCheckedChange={() => handleMultiSelectChange('positionTypes', type)}
                />
                <Label htmlFor={type} className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <Label className="text-sm font-medium">Experience Level</Label>
          <div className="mt-2 space-y-2">
            {experienceLevels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={level}
                  checked={filters.experienceLevels.includes(level)}
                  onCheckedChange={() => handleMultiSelectChange('experienceLevels', level)}
                />
                <Label htmlFor={level} className="text-sm">{level}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Workplace Type */}
        <div>
          <Label className="text-sm font-medium">Workplace Type</Label>
          <div className="mt-2 space-y-2">
            {workplaceTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={filters.workplaceTypes.includes(type)}
                  onCheckedChange={() => handleMultiSelectChange('workplaceTypes', type)}
                />
                <Label htmlFor={type} className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Location Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Location</Label>
          <div className="space-y-2">
            <Input
              placeholder="City"
              value={filters.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
            <Input
              placeholder="State"
              value={filters.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
            />
            <Input
              placeholder="Country"
              value={filters.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
            />
          </div>
        </div>

        {/* Compensation Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Compensation</Label>
          <div className="space-y-2">
            <Input
              placeholder="Pay Type (e.g. Salary, Hourly)"
              value={filters.payType}
              onChange={(e) => handleInputChange('payType', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min Pay"
                type="number"
                value={filters.minPay}
                onChange={(e) => handleInputChange('minPay', e.target.value)}
              />
              <Input
                placeholder="Max Pay"
                type="number"
                value={filters.maxPay}
                onChange={(e) => handleInputChange('maxPay', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Pay Frequency</Label>
              <div className="mt-1 space-y-1">
                {payFrequencies.map((frequency) => (
                  <div key={frequency} className="flex items-center space-x-2">
                    <Checkbox
                      id={frequency}
                      checked={filters.payFrequency === frequency}
                      onCheckedChange={() => handleInputChange('payFrequency',
                        filters.payFrequency === frequency ? '' : frequency)}
                    />
                    <Label htmlFor={frequency} className="text-sm">{frequency}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Filters */}
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bipocOwned"
              checked={filters.bipocOwned}
              onCheckedChange={(checked) => handleBooleanChange('bipocOwned', checked as boolean)}
            />
            <Label htmlFor="bipocOwned" className="text-sm">BIPOC-Owned Business</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
