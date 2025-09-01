"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Education } from "@/types";
import { DEGREE_TYPES, EDUCATION_STATUS, LOCATIONS } from "@/lib/constants";

interface EducationFormProps {
  education?: Education;
  onSubmit: (data: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function EducationForm({ education, onSubmit, onCancel }: EducationFormProps) {
  const [formData, setFormData] = useState({
    title: education?.title || "",
    description: education?.description || "",
    institution: education?.institution || "",
    degree: education?.degree || "bachelor" as const,
    field: education?.field || "",
    location: education?.location || "",
    startDate: education?.startDate || "",
    endDate: education?.endDate || "",
    status: education?.status || "completed" as const,
    coursework: education?.coursework || [],
    tags: education?.tags || [],
  });

  const [newCoursework, setNewCoursework] = useState("");
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
          <Label htmlFor="institution">Institution*</Label>
          <Input
            id="institution"
            value={formData.institution}
            onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
            placeholder="e.g., University of Technology"
            required
          />
        </div>
        
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Degree Type*</Label>
          <Select value={formData.degree} onValueChange={(value: any) => setFormData(prev => ({ ...prev, degree: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select degree type" />
            </SelectTrigger>
            <SelectContent>
              {DEGREE_TYPES.map((degree) => (
                <SelectItem key={degree.value} value={degree.value}>
                  {degree.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="field">Field of Study*</Label>
          <Input
            id="field"
            value={formData.field}
            onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
            placeholder="e.g., Computer Science"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Program Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Bachelor of Science in Computer Science (if different from field)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the program, thesis, or special achievements..."
          rows={3}
        />
      </div>

      {/* Status and Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Status*</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
          <Label htmlFor="endDate">
            {formData.status === 'completed' ? 'Graduation Date' : 'Expected End Date'}
          </Label>
          <Input
            id="endDate"
            type="month"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            placeholder={formData.status === 'pending' ? 'Leave empty if unknown' : ''}
          />
        </div>
      </div>

      {/* Coursework Highlights */}
      <div className="space-y-2">
        <Label>Coursework Highlights</Label>
        <div className="flex gap-2">
          <Input
            value={newCoursework}
            onChange={(e) => setNewCoursework(e.target.value)}
            placeholder="Add relevant coursework..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('coursework', newCoursework, setNewCoursework))}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => addToArray('coursework', newCoursework, setNewCoursework)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.coursework.map((course) => (
            <Badge key={course} variant="secondary" className="flex items-center gap-1">
              {course}
              <button
                type="button"
                className="ml-1 p-0 border-0 bg-transparent cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromArray('coursework', course);
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
          {education ? 'Update Education' : 'Add Education'}
        </Button>
      </div>
    </form>
  );
}
