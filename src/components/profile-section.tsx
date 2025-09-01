'use client';

import { useState, useEffect } from 'react';
import { Profile } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProfileForm from '@/components/profile-form';
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
  Plus,
  ExternalLink
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

const AVAILABILITY_CONFIG = {
  'available': { label: 'Available', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
  'open-to-opportunities': { label: 'Open to opportunities', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
  'not-looking': { label: 'Not looking', color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50' },
  'busy': { label: 'Currently busy', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' },
};

interface ProfileSectionProps {
  onDataChange?: () => void;
}

export default function ProfileSection({ onDataChange }: ProfileSectionProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await dataManager.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load profile:', error);
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
      onDataChange?.();
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Dialog - Always render */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {profile ? 'Edit Profile' : 'Create Profile'}
              </DialogTitle>
            </DialogHeader>
            <ProfileForm
              profile={profile || undefined}
              onSave={handleSave}
              isLoading={isSaving}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
            <CardDescription>
              Set up your personal information and career details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No profile created yet</p>
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Dialog - Always render */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {profile ? 'Edit Profile' : 'Create Profile'}
              </DialogTitle>
            </DialogHeader>
            <ProfileForm
              profile={profile || undefined}
              onSave={handleSave}
              isLoading={isSaving}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const availabilityConfig = AVAILABILITY_CONFIG[profile.availabilityStatus];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Overview */}
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile.profilePhoto} alt={`${profile.firstName} ${profile.lastName}`} />
              <AvatarFallback className="text-lg">
                {(profile.firstName?.[0] || '?')}{(profile.lastName?.[0] || '?')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-lg font-semibold">
                  {profile.firstName} {profile.lastName}
                </h3>
                {profile.jobTitle && (
                  <p className="text-muted-foreground">{profile.jobTitle}</p>
                )}
                {profile.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {profile.location}
                  </p>
                )}
              </div>

              {/* Availability Status */}
              <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${availabilityConfig.bgColor}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${availabilityConfig.color}`} />
                <span className={`font-medium ${availabilityConfig.textColor}`}>
                  {availabilityConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground p-2 rounded hover:bg-muted/50">
              <Mail className="w-4 h-4" />
              <span className="truncate">{profile.email}</span>
            </a>
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground p-2 rounded hover:bg-muted/50">
                <Phone className="w-4 h-4" />
                {profile.phone}
              </a>
            )}
            {profile.yearsOfExperience && (
              <div className="flex items-center gap-2 text-muted-foreground p-2">
                <Briefcase className="w-4 h-4" />
                {profile.yearsOfExperience} years experience
              </div>
            )}
          </div>

          {/* Online Presence */}
          {(profile.website || profile.linkedin || profile.github || profile.twitter || profile.portfolio) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Online Presence</h4>
              <div className="grid grid-cols-2 gap-2">
                {profile.website && (
                  <a 
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground p-2 rounded hover:bg-muted/50"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="truncate">Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.linkedin && (
                  <a 
                    href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground p-2 rounded hover:bg-muted/50"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="truncate">LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.github && (
                  <a 
                    href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground p-2 rounded hover:bg-muted/50"
                  >
                    <Github className="w-4 h-4" />
                    <span className="truncate">GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.portfolio && (
                  <a 
                    href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground p-2 rounded hover:bg-muted/50"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span className="truncate">Portfolio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.twitter && (
                  <a 
                    href={profile.twitter.startsWith('http') ? profile.twitter : `https://${profile.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground p-2 rounded hover:bg-muted/50"
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="truncate">Twitter</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Professional Summary Preview */}
          {profile.professionalSummary && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Professional Summary</h4>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {profile.professionalSummary}
              </p>
            </div>
          )}

          {/* Preferred Industries */}
          {profile.preferredIndustries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Preferred Industries</h4>
              <div className="flex flex-wrap gap-1">
                {profile.preferredIndustries.slice(0, 3).map(industry => (
                  <Badge key={industry} variant="secondary" className="text-xs">
                    {industry}
                  </Badge>
                ))}
                {profile.preferredIndustries.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.preferredIndustries.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Dialog - Always render */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {profile ? 'Edit Profile' : 'Create Profile'}
            </DialogTitle>
          </DialogHeader>
          <ProfileForm
            profile={profile || undefined}
            onSave={handleSave}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
