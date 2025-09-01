"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CertificationList } from "@/components/data-display/certification-list";
import { CertificationForm } from "@/components/forms/certification-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ExperienceListSkeleton } from "@/components/ui/loading-skeletons";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Certification } from "@/types";
import dataManager from "@/lib/data-manager";

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<Certification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadCertifications();
  }, []);

  // Update filtered results when search/tags change
  useEffect(() => {
    let filtered = certifications;
    
    if (searchQuery) {
      filtered = dataManager.searchItemsSync<Certification>('certifications', searchQuery);
    }
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(certification => 
        selectedTags.some(tag => certification.tags.includes(tag))
      );
    }
    
    setFilteredCertifications(filtered);
  }, [certifications, searchQuery, selectedTags]);

  const loadCertifications = async () => {
    setIsLoading(true);
    try {
      const data = await dataManager.getAllItems<Certification>('certifications');
      setCertifications(data);
      setFilteredCertifications(data);
      const tags = await dataManager.getAllTags('certifications');
      setAvailableTags(tags);
    } catch (error) {
      console.error('Failed to load certifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCertification(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      await dataManager.deleteItem('certifications', id);
      loadCertifications();
    }
  };

  const handleFormSubmit = async (data: Omit<Certification, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCertification) {
      await dataManager.updateItem('certifications', editingCertification.id, data);
    } else {
      await dataManager.createItem('certifications', data);
    }
    loadCertifications();
    setIsFormOpen(false);
    setEditingCertification(undefined);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingCertification(undefined);
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
              loadCertifications();
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
      title="Certifications"
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
            <h1 className="text-2xl font-bold">Certifications</h1>
            <p className="text-muted-foreground">
              Track your professional certifications and credentials ({filteredCertifications.length} {filteredCertifications.length === 1 ? 'item' : 'items'})
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
              Add Certification
            </Button>
          </div>
        </div>

        {/* Certifications List */}
        {isLoading ? (
          <ExperienceListSkeleton viewMode={viewMode} />
        ) : (
          <CertificationList
            certifications={filteredCertifications}
            viewMode={viewMode}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Certification Form Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCertification ? 'Edit Certification' : 'Add New Certification'}
              </DialogTitle>
            </DialogHeader>
            <CertificationForm
              certification={editingCertification}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
