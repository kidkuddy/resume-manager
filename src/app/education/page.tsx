"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { EducationForm } from "@/components/forms/education-form";
import { EducationList } from "@/components/data-display/education-list";
import { dataManager } from "@/lib/data-manager";
import { Education } from "@/types";
import { GraduationCap, Plus, Search, LayoutGrid, Table2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [filteredEducation, setFilteredEducation] = useState<Education[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [showForm, setShowForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEducation();
  }, []);

  useEffect(() => {
    filterEducation();
  }, [education, searchTerm, selectedTags]);

  const loadEducation = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getAllEducation();
      setEducation(data);
    } catch (error) {
      console.error('Failed to load education:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEducation = () => {
    let filtered = education;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(edu =>
        edu.institution.toLowerCase().includes(term) ||
        edu.field.toLowerCase().includes(term) ||
        edu.degree.toLowerCase().includes(term) ||
        (edu.title && edu.title.toLowerCase().includes(term)) ||
        (edu.description && edu.description.toLowerCase().includes(term)) ||
        edu.location.toLowerCase().includes(term) ||
        edu.coursework.some(course => course.toLowerCase().includes(term)) ||
        edu.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(edu =>
        selectedTags.some(tag => edu.tags.includes(tag))
      );
    }

    setFilteredEducation(filtered);
  };

  const handleSubmit = async (data: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingEducation) {
        await dataManager.updateEducation(editingEducation.id, data);
      } else {
        await dataManager.addEducation(data);
      }
      await loadEducation();
      setShowForm(false);
      setEditingEducation(undefined);
    } catch (error) {
      console.error('Failed to save education:', error);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this education record?')) {
      try {
        await dataManager.deleteEducation(id);
        await loadEducation();
      } catch (error) {
        console.error('Failed to delete education:', error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingEducation(undefined);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEducation(undefined);
  };

  const allTags = Array.from(new Set(education.flatMap(edu => edu.tags))).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-9 w-32 mb-2" />
              <Skeleton className="h-5 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Education</h1>
            <p className="text-muted-foreground">
              Manage your educational background and achievements
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search education..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <ToggleGroup type="single" value={view} onValueChange={(value: string) => value && setView(value as 'cards' | 'table')}>
            <ToggleGroupItem value="cards" aria-label="Card view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <Table2 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <EducationList
          education={filteredEducation}
          onEdit={handleEdit}
          onDelete={handleDelete}
          view={view}
        />

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEducation ? 'Edit Education' : 'Add Education'}
              </DialogTitle>
            </DialogHeader>
            <EducationForm
              education={editingEducation}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
