"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ExperienceList } from "@/components/data-display/experience-list";
import { ExperienceForm } from "@/components/forms/experience-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Experience } from "@/types";
import dataManager from "@/lib/data-manager";

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | undefined>();

  // Load data on mount
  useEffect(() => {
    loadExperiences();
  }, []);

  // Update filtered results when search/tags change
  useEffect(() => {
    let filtered = experiences;
    
    if (searchQuery) {
      filtered = dataManager.searchItems<Experience>('experiences', searchQuery);
    }
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(exp => 
        selectedTags.some(tag => exp.tags.includes(tag))
      );
    }
    
    setFilteredExperiences(filtered);
  }, [experiences, searchQuery, selectedTags]);

  const loadExperiences = () => {
    const data = dataManager.getAllItems<Experience>('experiences');
    setExperiences(data);
    setFilteredExperiences(data);
    setAvailableTags(dataManager.getAllTags('experiences'));
  };

  const handleAdd = () => {
    setEditingExperience(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      dataManager.deleteItem('experiences', id);
      loadExperiences();
    }
  };

  const handleFormSubmit = (data: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingExperience) {
      dataManager.updateItem('experiences', editingExperience.id, data);
    } else {
      dataManager.createItem('experiences', data);
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

  const handleExport = () => {
    const data = dataManager.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            if (dataManager.importData(data)) {
              alert('Data imported successfully!');
              loadExperiences();
            } else {
              alert('Failed to import data. Please check the file format.');
            }
          } catch (error) {
            alert('Error reading file. Please try again.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <DashboardLayout
      title="Experiences"
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      selectedTags={selectedTags}
      onTagSelect={handleTagSelect}
      onTagRemove={handleTagRemove}
      availableTags={availableTags}
      onExport={handleExport}
      onImport={handleImport}
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

        {/* Experience List */}
        <ExperienceList
          experiences={filteredExperiences}
          viewMode={viewMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

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
