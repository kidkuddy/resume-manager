"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ActivityForm } from "@/components/forms/activity-form";
import { ActivityList } from "@/components/data-display/activity-list";
import { dataManager } from "@/lib/data-manager";
import { Activity } from "@/types";
import { Users, Plus, Search, LayoutGrid, Table2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, selectedTags]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getAllActivities();
      setActivities(data);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(term) ||
        activity.organization.toLowerCase().includes(term) ||
        activity.type.toLowerCase().includes(term) ||
        (activity.role && activity.role.toLowerCase().includes(term)) ||
        (activity.description && activity.description.toLowerCase().includes(term)) ||
        (activity.location && activity.location.toLowerCase().includes(term)) ||
        activity.impact.some(impact => impact.toLowerCase().includes(term)) ||
        activity.skills.some(skill => skill.toLowerCase().includes(term)) ||
        activity.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(activity =>
        selectedTags.some(tag => activity.tags.includes(tag))
      );
    }

    setFilteredActivities(filtered);
  };

  const handleSubmit = async (data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingActivity) {
        await dataManager.updateActivity(editingActivity.id, data);
      } else {
        await dataManager.addActivity(data);
      }
      await loadActivities();
      setShowForm(false);
      setEditingActivity(undefined);
    } catch (error) {
      console.error('Failed to save activity:', error);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      try {
        await dataManager.deleteActivity(id);
        await loadActivities();
      } catch (error) {
        console.error('Failed to delete activity:', error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingActivity(undefined);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingActivity(undefined);
  };

  const allTags = Array.from(new Set(activities.flatMap(activity => activity.tags))).sort();

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
            <h1 className="text-3xl font-bold">Activities</h1>
            <p className="text-muted-foreground">
              Manage your community involvement and activities
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Activity
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
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

        <ActivityList
          activities={filteredActivities}
          onEdit={handleEdit}
          onDelete={handleDelete}
          view={view}
        />

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingActivity ? 'Edit Activity' : 'Add Activity'}
              </DialogTitle>
            </DialogHeader>
            <ActivityForm
              activity={editingActivity}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
