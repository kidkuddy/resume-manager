"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Experience } from "@/types";
import { LOCATIONS, EXPERIENCE_TYPES, COMMON_TECHNOLOGIES } from "@/lib/constants";

interface ExperienceFormProps {
  experience?: Experience;
  onSubmit: (data: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ExperienceForm({ experience, onSubmit, onCancel }: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    title: experience?.title || "",
    description: experience?.description || "",
    company: experience?.company || "",
    position: experience?.position || "",
    location: experience?.location || "",
    type: experience?.type || "full-time" as const,
    startDate: experience?.startDate || "",
    endDate: experience?.endDate || "",
    current: experience?.current || false,
    responsibilities: experience?.responsibilities || [],
    achievements: experience?.achievements || [],
    technologies: experience?.technologies || [],
    tags: experience?.tags || [],
  });

  const [newResponsibility, setNewResponsibility] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [newTechnology, setNewTechnology] = useState("");
  const [newTag, setNewTag] = useState("");

  // Clear end date when current is true
  useEffect(() => {
    if (formData.current) {
      setFormData(prev => ({ ...prev, endDate: "" }));
    }
  }, [formData.current]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      endDate: formData.current ? undefined : formData.endDate,
    });
  };

  const addToArray = (field: keyof typeof formData, value: string, setValue: (val: string) => void) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">Position Title*</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            placeholder="e.g., Senior Software Engineer"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company*</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            placeholder="e.g., Google"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location*</Label>
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
          <Label htmlFor="type">Employment Type*</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date*</Label>
          <Input
            id="startDate"
            type="text"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            placeholder="e.g., January 2023"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="text"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            placeholder="e.g., Present"
            disabled={formData.current}
          />
        </div>

        <div className="flex items-center space-x-2 pt-7">
          <Switch
            id="current"
            checked={formData.current}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, current: checked }))}
          />
          <Label htmlFor="current">Currently working here</Label>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the role..."
          rows={3}
        />
      </div>

      {/* Responsibilities */}
      <div className="space-y-2">
        <Label>Responsibilities</Label>
        <div className="flex gap-2">
          <Input
            value={newResponsibility}
            onChange={(e) => setNewResponsibility(e.target.value)}
            placeholder="Add a responsibility..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('responsibilities', newResponsibility, setNewResponsibility))}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => addToArray('responsibilities', newResponsibility, setNewResponsibility)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.responsibilities.map((resp) => (
            <Badge key={resp} variant="secondary" className="flex items-center gap-1">
              {resp}
              <button
                type="button"
                className="ml-1 p-0 border-0 bg-transparent cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromArray('responsibilities', resp);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-2">
        <Label>Achievements</Label>
        <div className="flex gap-2">
          <Input
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            placeholder="Add an achievement..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('achievements', newAchievement, setNewAchievement))}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => addToArray('achievements', newAchievement, setNewAchievement)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.achievements.map((achievement) => (
            <Badge key={achievement} variant="secondary" className="flex items-center gap-1">
              {achievement}
              <button
                type="button"
                className="ml-1 p-0 border-0 bg-transparent cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromArray('achievements', achievement);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Technologies */}
      <div className="space-y-2">
        <Label>Technologies</Label>
        <div className="space-y-2">
          <Select value={newTechnology} onValueChange={(value) => {
            addToArray('technologies', value, setNewTechnology);
            setNewTechnology("");
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select or type technology..." />
            </SelectTrigger>
            <SelectContent>
              {COMMON_TECHNOLOGIES.filter(tech => !formData.technologies.includes(tech)).map((tech) => (
                <SelectItem key={tech} value={tech}>
                  {tech}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              value={newTechnology}
              onChange={(e) => setNewTechnology(e.target.value)}
              placeholder="Or type custom technology..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('technologies', newTechnology, setNewTechnology))}
            />
            <Button
              type="button"
              size="sm"
              onClick={() => addToArray('technologies', newTechnology, setNewTechnology)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technologies.map((tech) => (
            <Badge key={tech} variant="outline" className="flex items-center gap-1">
              {tech}
              <button
                type="button"
                className="ml-1 p-0 border-0 bg-transparent cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromArray('technologies', tech);
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
          {experience ? 'Update Experience' : 'Add Experience'}
        </Button>
      </div>
    </form>
  );
}
