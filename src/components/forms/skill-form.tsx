"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Skill } from "@/types";
import { SKILL_CATEGORIES, SKILL_PROFICIENCY } from "@/lib/constants";

interface SkillFormProps {
  skill?: Skill;
  onSubmit: (data: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function SkillForm({ skill, onSubmit, onCancel }: SkillFormProps) {
  const [formData, setFormData] = useState({
    title: skill?.title || "",
    name: skill?.name || "",
    category: skill?.category || "technical" as const,
    proficiency: skill?.proficiency || "familiar" as const,
    description: skill?.description || "",
    projects: skill?.projects || [],
    tags: skill?.tags || [],
  });

  const [newProject, setNewProject] = useState("");
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
          <Label htmlFor="title">Skill Name*</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, name: e.target.value }))}
            placeholder="e.g., React, Python, Project Management"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Category*</Label>
          <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {SKILL_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Proficiency Level*</Label>
          <Select value={formData.proficiency} onValueChange={(value: any) => setFormData(prev => ({ ...prev, proficiency: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select proficiency" />
            </SelectTrigger>
            <SelectContent>
              {SKILL_PROFICIENCY.map((proficiency) => (
                <SelectItem key={proficiency.value} value={proficiency.value}>
                  <div className="flex flex-col">
                    <span>{proficiency.label}</span>
                    <span className="text-xs text-muted-foreground">{proficiency.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of your experience with this skill..."
          rows={3}
        />
      </div>

      {/* Related Projects */}
      <div className="space-y-2">
        <Label>Related Projects</Label>
        <div className="flex gap-2">
          <Input
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            placeholder="Add related project..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('projects', newProject, setNewProject))}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => addToArray('projects', newProject, setNewProject)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.projects.map((project) => (
            <Badge key={project} variant="secondary" className="flex items-center gap-1">
              {project}
              <button
                type="button"
                className="ml-1 p-0 border-0 bg-transparent cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromArray('projects', project);
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
          {skill ? 'Update Skill' : 'Add Skill'}
        </Button>
      </div>
    </form>
  );
}
