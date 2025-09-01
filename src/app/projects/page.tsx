"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProjectList } from "@/components/data-display/project-list";
import { ProjectForm } from "@/components/forms/project-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ExperienceListSkeleton } from "@/components/ui/loading-skeletons";
import { ProjectListSkeleton } from "@/components/ui/project-skeletons";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Project } from "@/types";
import dataManager from "@/lib/data-manager";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Update filtered results when search/tags change
  useEffect(() => {
    let filtered = projects;
    
    if (searchQuery) {
      filtered = dataManager.searchItemsSync<Project>('projects', searchQuery);
    }
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project => 
        selectedTags.some(tag => project.tags.includes(tag))
      );
    }
    
    setFilteredProjects(filtered);
  }, [projects, searchQuery, selectedTags]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await dataManager.getAllItems<Project>('projects');
      setProjects(data);
      setFilteredProjects(data);
      const tags = await dataManager.getAllTags('projects');
      setAvailableTags(tags);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProject(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await dataManager.deleteItem('projects', id);
      loadProjects();
    }
  };

  const handleFormSubmit = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProject) {
      await dataManager.updateItem('projects', editingProject.id, data);
    } else {
      await dataManager.createItem('projects', data);
    }
    loadProjects();
    setIsFormOpen(false);
    setEditingProject(undefined);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingProject(undefined);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => [...prev, tag]);
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleExport = async () => {
    const data = await dataManager.exportData();
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
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = e.target?.result as string;
            const success = await dataManager.importData(data);
            if (success) {
              alert('Data imported successfully!');
              loadProjects();
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
      title="Projects"
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
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Showcase your personal and professional projects ({filteredProjects.length} {filteredProjects.length === 1 ? 'item' : 'items'})
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
              Add Project
            </Button>
          </div>
        </div>

        {/* Projects List */}
        {isLoading ? (
          <ProjectListSkeleton viewMode={viewMode} />
        ) : (
          <ProjectList
            projects={filteredProjects}
            viewMode={viewMode}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Project Form Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
            </DialogHeader>
            <ProjectForm
              project={editingProject}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
