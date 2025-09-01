"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Activity } from "@/types";
import { ACTIVITY_TYPES, LOCATIONS } from "@/lib/constants";

interface ActivityFormProps {
  activity?: Activity;
  onSubmit: (data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
  const [formData, setFormData] = useState({
    title: activity?.title || "",
    description: activity?.description || "",
    organization: activity?.organization || "",
    role: activity?.role || "",
    location: activity?.location || "",
    type: activity?.type || "volunteering" as const,
    startDate: activity?.startDate || "",
    endDate: activity?.endDate || "",
    current: activity?.current || false,
    impact: activity?.impact || [],
    skills: activity?.skills || [],
    tags: activity?.tags || [],
  });

  const [newImpact, setNewImpact] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");

  const addToArray = (field: keyof typeof formData, value: string, setValue: (value: string) => void) => {
    if (value.trim()) {
      const currentArray = formData[field] as string[];
      if (!currentArray.includes(value.trim())) {
        setFormData(prev => ({
          ...prev,
          [field]: [...currentArray, value.trim()]
        }));
      }
      setValue("");
    }
  };

  const removeFromArray = (field: keyof typeof formData, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.filter(item => item !== value);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Activity Title*</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Youth Mentor, Conference Speaker"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Activity Type*</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="organization">Organization*</Label>
          <Input
            id="organization"
            value={formData.organization}
            onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
            placeholder="e.g., Local Community Center, Tech Conference"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Your Role</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            placeholder="e.g., Volunteer, Speaker, Organizer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your involvement and activities..."
          rows={4}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date*</Label>
          <Input
            id="startDate"
            type="month"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="month"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            disabled={formData.current}
          />
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <input
            type="checkbox"
            id="current"
            checked={formData.current}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              current: e.target.checked,
              endDate: e.target.checked ? "" : prev.endDate
            }))}
            className="rounded"
          />
          <Label htmlFor="current">Currently active</Label>
        </div>
      </div>

      {/* Impact & Outcomes */}
      <div className="space-y-2">
        <Label>Impact & Outcomes</Label>
        <div className="flex gap-2">
          <Input
            value={newImpact}
            onChange={(e) => setNewImpact(e.target.value)}
            placeholder="Add an impact or outcome..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('impact', newImpact, setNewImpact))}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => addToArray('impact', newImpact, setNewImpact)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.impact.map((item) => (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {item}
              <button
                type="button"
                className="ml-1 p-0 border-0 bg-transparent cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromArray('impact', item);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Skills Developed */}
      <div className="space-y-2">
        <Label>Skills Developed</Label>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill you developed..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('skills', newSkill, setNewSkill))}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => addToArray('skills', newSkill, setNewSkill)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="flex items-center gap-1">
              {skill}
              <button
                type="button"
                className="ml-1 p-0 border-0 bg-transparent cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromArray('skills', skill);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('tags', newTag, setNewTag))}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => addToArray('tags', newTag, setNewTag)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <Badge key={tag} variant="default" className="flex items-center gap-1">
              {tag}
              <button
                type="button"
                className="ml-1 p-0 border-0 bg-transparent cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromArray('tags', tag);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {activity ? 'Update Activity' : 'Add Activity'}
        </Button>
      </div>
    </form>
  );
}
