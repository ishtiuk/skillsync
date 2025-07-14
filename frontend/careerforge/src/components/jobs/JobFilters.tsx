import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, RotateCcw } from 'lucide-react';

interface Filters {
  organization_name: string;
  job_category: string[];
  position_type: string[];
  city: string;
  state: string;
  country: string;
  minimum_pay: string;
  maximum_pay: string;
  pay_frequency: string;
  sector_focus: string[];
}

interface JobFiltersProps {
  onFiltersChange: (filters: Filters) => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<Filters>({
    organization_name: '',
    job_category: [] as string[],
    position_type: [] as string[],
    city: '',
    state: '',
    country: '',
    minimum_pay: '',
    maximum_pay: '',
    pay_frequency: '',
    sector_focus: [] as string[],
  });

  const jobCategories = [
    'Software Engineering',
    'Supply Chain',
    'HR',
    'Advocacy & Policy',
    'Climate & Sustainability',
    'Investment',
    'Sales & Account Management',
    'Content',
    'Marketing & Design',
    'Product',
    'Data',
    'Education',
    'Science'
  ];

  const positionTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Volunteer'];

  const payFrequencies = ['Weekly', 'Bi-Weekly', 'Monthly'];

  const handleMultiSelectChange = (field: string, value: string) => {
    const currentValues = filters[field as keyof typeof filters] as string[];
    const valueToCompare = value.toLowerCase();
    const newValues = currentValues.map(v => v.toLowerCase()).includes(valueToCompare)
      ? currentValues.filter(item => item.toLowerCase() !== valueToCompare)
      : [...currentValues, value];

    const newFilters = { ...filters, [field]: newValues };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleInputChange = (field: string, value: string) => {
    // Store the original case for display purposes
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
    const clearedFilters: Filters = {
      organization_name: '',
      job_category: [],
      position_type: [],
      city: '',
      state: '',
      country: '',
      minimum_pay: '',
      maximum_pay: '',
      pay_frequency: '',
      sector_focus: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.organization_name) count++;
    count += filters.job_category.length;
    count += filters.position_type.length;
    if (filters.city) count++;
    if (filters.state) count++;
    if (filters.country) count++;
    if (filters.minimum_pay) count++;
    if (filters.maximum_pay) count++;
    if (filters.pay_frequency) count++;
    count += filters.sector_focus.length;
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
        {/* Company Search */}
        <div>
          <Label htmlFor="organization_name">Company</Label>
          <Input
            id="organization_name"
            placeholder="e.g. Google"
            value={filters.organization_name}
            onChange={(e) => handleInputChange('organization_name', e.target.value)}
          />
        </div>

        {/* Job Categories */}
        <div>
          <Label className="text-sm font-medium">Job Categories</Label>
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
            {jobCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.job_category.includes(category)}
                  onCheckedChange={() => handleMultiSelectChange('job_category', category)}
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
                  checked={filters.position_type.includes(type)}
                  onCheckedChange={() => handleMultiSelectChange('position_type', type)}
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
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min Pay"
                type="number"
                value={filters.minimum_pay}
                onChange={(e) => handleInputChange('minimum_pay', e.target.value)}
              />
              <Input
                placeholder="Max Pay"
                type="number"
                value={filters.maximum_pay}
                onChange={(e) => handleInputChange('maximum_pay', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Pay Frequency</Label>
              <div className="mt-2 space-y-2">
                {payFrequencies.map((frequency) => (
                  <div key={frequency} className="flex items-center space-x-2">
                    <Checkbox
                      id={frequency}
                      checked={filters.pay_frequency === frequency}
                      onCheckedChange={() => handleInputChange('pay_frequency',
                        filters.pay_frequency === frequency ? '' : frequency)}
                    />
                    <Label htmlFor={frequency} className="text-sm">{frequency}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


      </CardContent>
    </Card>
  );
};
