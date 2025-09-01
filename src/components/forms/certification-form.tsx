"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Certification } from "@/types";
import { CERTIFICATION_STATUS, CERTIFICATION_WORTHINESS } from "@/lib/constants";

interface CertificationFormProps {
  certification?: Certification;
  onSubmit: (data: Omit<Certification, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function CertificationForm({ certification, onSubmit, onCancel }: CertificationFormProps) {
  const [formData, setFormData] = useState({
    title: certification?.title || "",
    description: certification?.description || "",
    issuer: certification?.issuer || "",
    issueDate: certification?.issueDate || "",
    expirationDate: certification?.expirationDate || "",
    credentialId: certification?.credentialId || "",
    credentialUrl: certification?.credentialUrl || "",
    status: certification?.status || "active" as const,
    worthiness: certification?.worthiness || "earned" as const,
    tags: certification?.tags || [],
  });

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
          <Label htmlFor="title">Certification Title*</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., AWS Solutions Architect"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="issuer">Issuing Organization*</Label>
          <Input
            id="issuer"
            value={formData.issuer}
            onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
            placeholder="e.g., Amazon Web Services"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the certification..."
          rows={3}
        />
      </div>

      {/* Status and Worthiness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status*</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {CERTIFICATION_STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Worthiness*</Label>
          <Select value={formData.worthiness} onValueChange={(value: any) => setFormData(prev => ({ ...prev, worthiness: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select worthiness" />
            </SelectTrigger>
            <SelectContent>
              {CERTIFICATION_WORTHINESS.map((worthiness) => (
                <SelectItem key={worthiness.value} value={worthiness.value}>
                  {worthiness.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date*</Label>
          <Input
            id="issueDate"
            type="month"
            value={formData.issueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expirationDate">Expiration Date</Label>
          <Input
            id="expirationDate"
            type="month"
            value={formData.expirationDate}
            onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
            placeholder="Leave empty if no expiration"
          />
        </div>
      </div>

      {/* Credential Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="credentialId">Credential ID</Label>
          <Input
            id="credentialId"
            value={formData.credentialId}
            onChange={(e) => setFormData(prev => ({ ...prev, credentialId: e.target.value }))}
            placeholder="e.g., ABC123XYZ"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="credentialUrl">Credential URL</Label>
          <Input
            id="credentialUrl"
            type="url"
            value={formData.credentialUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, credentialUrl: e.target.value }))}
            placeholder="https://..."
          />
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
          {certification ? 'Update Certification' : 'Add Certification'}
        </Button>
      </div>
    </form>
  );
}
