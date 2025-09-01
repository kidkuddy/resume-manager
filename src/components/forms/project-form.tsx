"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Project } from "@/types";
import { PROJECT_TYPES, PROJECT_STATUS, COMMON_TECHNOLOGIES } from "@/lib/constants";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    type: project?.type || "personal" as const,
    status: project?.status || "completed" as const,
    year: project?.year || new Date().getFullYear(),
    url: project?.url || "",
    repository: project?.repository || "",
    technologies: project?.technologies || [],
    highlights: project?.highlights || [],
    tags: project?.tags || [],
  });

  const [newTechnology, setNewTechnology] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
      <div className="space-y-2">
        <Label htmlFor="title">Project Title*</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., E-commerce Platform"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the project..."
          rows={3}
        />
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Project Type*</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status*</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year*</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            min="1990"
            max={new Date().getFullYear() + 5}
            required
          />
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="url">Project URL</Label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://project.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="repository">Repository URL</Label>
          <Input
            id="repository"
            type="url"
            value={formData.repository}
            onChange={(e) => setFormData(prev => ({ ...prev, repository: e.target.value }))}
            placeholder="https://github.com/username/repo"
          />
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

      {/* Highlights */}
      <div className="space-y-2">
        <Label>Project Highlights</Label>
        <div className="flex gap-2">
          <Input
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            placeholder="Add a key highlight..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('highlights', newHighlight, setNewHighlight))}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => addToArray('highlights', newHighlight, setNewHighlight)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.highlights.map((highlight) => (
            <Badge key={highlight} variant="secondary" className="flex items-center gap-1">
              {highlight}
              <button
                type="button"
                className="ml-1 p-0 border-0 bg-transparent cursor-pointer hover:text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromArray('highlights', highlight);
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
          {project ? 'Update Project' : 'Add Project'}
        </Button>
      </div>
    </form>
  );
}
