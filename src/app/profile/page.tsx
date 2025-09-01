'use client';

import { useState, useEffect } from 'react';
import { Profile } from '@/types';
import { DashboardLayout } from '@/components/dashboard-layout';
import ProfileForm from '@/components/profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Twitter, 
  Briefcase,
  Edit,
  Calendar,
  Building
} from 'lucide-react';

const dataManager = {
  async getProfile() {
    const response = await fetch('/api/profile');
    if (response.ok) {
      return await response.json();
    }
    return null;
  },
  
  async createProfile(profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return await response.json();
  },
  
  async updateProfile(updates: Partial<Omit<Profile, 'id' | 'createdAt'>>) {
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return await response.json();
  }
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await dataManager.getProfile();
      setProfile(profileData);
      
      // If no profile exists, start in editing mode
      if (!profileData) {
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setIsEditing(true); // Start editing if loading fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (profileData: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSaving(true);
      
      let savedProfile;
      if (profile) {
        savedProfile = await dataManager.updateProfile(profileData);
      } else {
        savedProfile = await dataManager.createProfile(profileData);
      }
      
      setProfile(savedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      // TODO: Show error message to user
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (isEditing || !profile) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {profile ? 'Edit Profile' : 'Create Profile'}
              </h1>
              <p className="text-muted-foreground">
                {profile ? 'Update your personal information and career details' : 'Set up your personal information and career details'}
              </p>
            </div>
            {profile && (
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
          
          <ProfileForm
            profile={profile || undefined}
            onSave={handleSave}
            isLoading={isSaving}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Your personal information and career details
          </p>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.profilePhoto} alt={`${profile.firstName} ${profile.lastName}`} />
              <AvatarFallback className="text-2xl">
                {profile.firstName[0]}{profile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h2>
                {profile.jobTitle && (
                  <p className="text-lg text-muted-foreground">{profile.jobTitle}</p>
                )}
                {profile.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </p>
                )}
              </div>

              {/* Professional Roles */}
              {profile.roles && profile.roles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Professional Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.roles.map(role => (
                      <Badge key={role} variant="default" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="flex flex-wrap gap-4 text-sm">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </a>
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <Phone className="w-4 h-4" />
                    {profile.phone}
                  </a>
                )}
                {profile.yearsOfExperience && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    {profile.yearsOfExperience} years experience
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      {profile.professionalSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {profile.professionalSummary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Online Presence */}
      {(profile.website || profile.linkedin || profile.github || profile.twitter || profile.portfolio) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Online Presence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.website && (
                <a 
                  href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Globe className="w-4 h-4" />
                  Personal Website
                </a>
              )}
              {profile.portfolio && (
                <a 
                  href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Briefcase className="w-4 h-4" />
                  Portfolio
                </a>
              )}
              {profile.linkedin && (
                <a 
                  href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
              {profile.github && (
                <a 
                  href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}
              {profile.twitter && (
                <a 
                  href={profile.twitter.startsWith('http') ? profile.twitter : `https://${profile.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Career Preferences */}
      {profile.preferredIndustries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Career Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Preferred Industries</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.preferredIndustries.map(industry => (
                    <Badge key={industry} variant="secondary">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span> {new Date(profile.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> {new Date(profile.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);
}
