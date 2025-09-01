"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ExperienceList } from "@/components/data-display/experience-list";
import { ExperienceForm } from "@/components/forms/experience-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ExperienceListSkeleton } from "@/components/ui/loading-skeletons";
import { Plus, LayoutGrid, List, Clock } from "lucide-react";
import { Experience } from "@/types";
import dataManager from "@/lib/data-manager";
import { calculateTotalExperience } from "@/lib/date-utils";

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Load data on mount
  useEffect(() => {
    loadExperiences();
  }, []);

  // Update filtered results when search/tags change
  useEffect(() => {
    let filtered = experiences;
    
    if (searchQuery) {
      filtered = dataManager.searchItemsSync<Experience>('experiences', searchQuery);
    }
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(experience => 
        selectedTags.some(tag => experience.tags.includes(tag))
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(experience => 
        selectedTypes.includes(experience.type)
      );
    }
    
    setFilteredExperiences(filtered);
  }, [experiences, searchQuery, selectedTags, selectedTypes]);

  const loadExperiences = async () => {
    setIsLoading(true);
    try {
      const data = await dataManager.getAllItems<Experience>('experiences');
      setExperiences(data);
      setFilteredExperiences(data);
      const tags = await dataManager.getAllTags('experiences');
      setAvailableTags(tags);
    } catch (error) {
      console.error('Failed to load experiences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingExperience(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      await dataManager.deleteItem('experiences', id);
      loadExperiences();
    }
  };

  const handleFormSubmit = async (data: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingExperience) {
      await dataManager.updateItem('experiences', editingExperience.id, data);
    } else {
      await dataManager.createItem('experiences', data);
    }
    loadExperiences();
    setIsFormOpen(false);
    setEditingExperience(undefined);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingExperience(undefined);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => [...prev, tag]);
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  // Experience type counters
  const getExperienceCount = (type?: string) => {
    if (!type) return filteredExperiences.length;
    return experiences.filter(exp => exp.type === type).length;
  };

  const getExperienceDuration = (type?: string) => {
    const relevantExperiences = type 
      ? experiences.filter(exp => exp.type === type)
      : experiences;
    
    return calculateTotalExperience(relevantExperiences.map(exp => ({
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current
    })));
  };

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const experienceTypes = [
    { key: 'full-time', label: 'Full Time', color: 'bg-blue-500' },
    { key: 'part-time', label: 'Part Time', color: 'bg-green-500' },
    { key: 'internship', label: 'Internships', color: 'bg-purple-500' },
    { key: 'freelance', label: 'Freelance', color: 'bg-orange-500' },
  ];

  return (
    <DashboardLayout
      title="Experiences"
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      selectedTags={selectedTags}
      onTagSelect={handleTagSelect}
      onTagRemove={handleTagRemove}
      availableTags={availableTags}
      onDataChange={loadExperiences}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Work Experience</h1>
            <p className="text-muted-foreground">
              Manage your career history and professional experience ({filteredExperiences.length} {filteredExperiences.length === 1 ? 'item' : 'items'})
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Label htmlFor="view-mode" className="text-sm">View:</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
        </div>

        {/* Experience Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Total Experience Card */}
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Experience</p>
                  <p className="text-2xl font-bold">{getExperienceDuration()}</p>
                </div>
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {experienceTypes.map((type) => (
            <Card 
              key={type.key} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTypes.includes(type.key) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => toggleTypeFilter(type.key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{type.label}</p>
                    <p className="text-2xl font-bold">{getExperienceCount(type.key)}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${type.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{getExperienceDuration(type.key)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Experience List */}
        {isLoading ? (
          <ExperienceListSkeleton viewMode={viewMode} />
        ) : (
          <ExperienceList
            experiences={filteredExperiences}
            viewMode={viewMode}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Experience Form Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              </DialogTitle>
            </DialogHeader>
            <ExperienceForm
              experience={editingExperience}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}