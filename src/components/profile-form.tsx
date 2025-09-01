'use client';

import { useState, useEffect } from 'react';
import { Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, User, Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Briefcase } from 'lucide-react';

interface ProfileFormProps {
  profile?: Profile;
  onSave: (profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

const COMMON_ROLES = [
  'Developer', 'Frontend Developer', 'Backend Developer', 'Full-Stack Developer',
  'DevOps Engineer', 'Software Engineer', 'System Administrator', 'Cloud Engineer',
  'Project Manager', 'Product Manager', 'Scrum Master', 'Technical Lead',
  'Data Engineer', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer',
  'UI/UX Designer', 'Product Designer', 'Business Analyst', 'Quality Assurance',
  'Security Engineer', 'Mobile Developer', 'Game Developer', 'Consultant'
];

const COMMON_INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
  'Consulting', 'Manufacturing', 'Retail', 'Media', 'Non-profit',
  'Government', 'Real Estate', 'Automotive', 'Energy', 'Transportation',
];

export default function ProfileForm({ profile, onSave, isLoading }: ProfileFormProps) {
  const [formData, setFormData] = useState<Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    twitter: '',
    portfolio: '',
    professionalSummary: '',
    profilePhoto: '',
    jobTitle: '',
    yearsOfExperience: undefined,
    preferredIndustries: [],
    roles: [],
  });

  const [industryInput, setIndustryInput] = useState('');
  const [roleInput, setRoleInput] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone || '',
        location: profile.location || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        twitter: profile.twitter || '',
        portfolio: profile.portfolio || '',
        professionalSummary: profile.professionalSummary,
        profilePhoto: profile.profilePhoto || '',
        jobTitle: profile.jobTitle || '',
        yearsOfExperience: profile.yearsOfExperience,
        preferredIndustries: profile.preferredIndustries,
        roles: profile.roles || [],
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    // Auto-clean URLs for GitHub and LinkedIn
    if (field === 'github' && typeof value === 'string') {
      value = value
        .replace(/^https?:\/\/(www\.)?/, '')
        .replace(/^github\.com\//, '')
        .replace(/\/$/, '');
      if (value && !value.startsWith('github.com/')) {
        value = `github.com/${value}`;
      }
    }
    
    if (field === 'linkedin' && typeof value === 'string') {
      value = value
        .replace(/^https?:\/\/(www\.)?/, '')
        .replace(/^linkedin\.com\/in\//, '')
        .replace(/\/$/, '');
      if (value && !value.startsWith('linkedin.com/in/')) {
        value = `linkedin.com/in/${value}`;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddIndustry = () => {
    if (industryInput.trim() && !formData.preferredIndustries.includes(industryInput.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredIndustries: [...prev.preferredIndustries, industryInput.trim()]
      }));
      setIndustryInput('');
    }
  };

  const handleRemoveIndustry = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      preferredIndustries: prev.preferredIndustries.filter(i => i !== industry)
    }));
  };

  const handleAddRole = () => {
    if (roleInput.trim() && !formData.roles.includes(roleInput.trim())) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, roleInput.trim()]
      }));
      setRoleInput('');
    }
  };

  const handleRemoveRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(r => r !== role)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header with Photo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Basic information that will appear on your resume
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10"
                    placeholder="City, Country"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Current Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className="pl-10"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                max="50"
                value={formData.yearsOfExperience || ''}
                onChange={(e) => handleInputChange('yearsOfExperience', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g., 5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Summary</CardTitle>
            <CardDescription>
              A brief overview of your professional background and career objectives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="professionalSummary">Summary *</Label>
              <Textarea
                id="professionalSummary"
                value={formData.professionalSummary}
                onChange={(e) => handleInputChange('professionalSummary', e.target.value)}
                rows={6}
                placeholder="Write a compelling professional summary that highlights your key strengths, experience, and career goals..."
                required
              />
              <p className="text-sm text-muted-foreground">
                {formData.professionalSummary.length}/500 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Online Presence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Online Presence
            </CardTitle>
            <CardDescription>
              Links to your professional profiles and websites
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Personal Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="pl-10"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="portfolio"
                    value={formData.portfolio}
                    onChange={(e) => handleInputChange('portfolio', e.target.value)}
                    className="pl-10"
                    placeholder="https://portfolio.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="pl-10"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className="pl-10"
                    placeholder="github.com/username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="pl-10"
                    placeholder="twitter.com/username"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Career Preferences</CardTitle>
            <CardDescription>
              Information about your professional roles and career preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Professional Roles */}
            <div className="space-y-2">
              <Label>Professional Roles</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="Add role"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
                />
                <Button type="button" onClick={handleAddRole}>Add</Button>
              </div>
              
              {/* Common Roles */}
              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-2">Quick add:</p>
                <div className="flex flex-wrap gap-1">
                  {COMMON_ROLES.map(role => (
                    <Button
                      key={role}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!formData.roles.includes(role)) {
                          setFormData(prev => ({
                            ...prev,
                            roles: [...prev.roles, role]
                          }));
                        }
                      }}
                      className="text-xs"
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selected Roles */}
              <div className="flex flex-wrap gap-2">
                {formData.roles.map(role => (
                  <Badge key={role} variant="default" className="flex items-center gap-1 pr-1">
                    {role}
                    <button
                      type="button"
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveRole(role);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Preferred Industries */}
            <div className="space-y-2">
              <Label>Preferred Industries</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={industryInput}
                  onChange={(e) => setIndustryInput(e.target.value)}
                  placeholder="Add industry"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIndustry())}
                />
                <Button type="button" onClick={handleAddIndustry}>Add</Button>
              </div>
              
              {/* Common Industries */}
              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-2">Quick add:</p>
                <div className="flex flex-wrap gap-1">
                  {COMMON_INDUSTRIES.map(industry => (
                    <Button
                      key={industry}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!formData.preferredIndustries.includes(industry)) {
                          setFormData(prev => ({
                            ...prev,
                            preferredIndustries: [...prev.preferredIndustries, industry]
                          }));
                        }
                      }}
                      className="text-xs"
                    >
                      {industry}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selected Industries */}
              <div className="flex flex-wrap gap-2">
                {formData.preferredIndustries.map(industry => (
                  <Badge key={industry} variant="secondary" className="flex items-center gap-1 pr-1">
                    {industry}
                    <button
                      type="button"
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveIndustry(industry);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="min-w-32">
            {isLoading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
