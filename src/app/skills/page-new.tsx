"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SkillForm } from "@/components/forms/skill-form";
import { SkillList } from "@/components/data-display/skill-list";
import { dataManager } from "@/lib/data-manager";
import { Skill } from "@/types";
import { Star, Plus, Search, LayoutGrid, Table2, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    filterSkills();
  }, [skills, searchTerm, selectedCategories, selectedTags]);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await dataManager.getAllSkills();
      setSkills(data);
    } catch (error) {
      console.error('Failed to load skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSkills = () => {
    let filtered = skills;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(term) ||
        skill.category.toLowerCase().includes(term) ||
        skill.proficiency.toLowerCase().includes(term) ||
        (skill.description && skill.description.toLowerCase().includes(term)) ||
        skill.projects.some(project => project.toLowerCase().includes(term)) ||
        skill.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(skill => selectedCategories.includes(skill.category));
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(skill =>
        selectedTags.some(tag => skill.tags.includes(tag))
      );
    }

    setFilteredSkills(filtered);
  };

  const handleSubmit = async (data: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingSkill) {
        await dataManager.updateSkill(editingSkill.id, data);
      } else {
        await dataManager.addSkill(data);
      }
      await loadSkills();
      setShowForm(false);
      setEditingSkill(undefined);
    } catch (error) {
      console.error('Failed to save skill:', error);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await dataManager.deleteSkill(id);
        await loadSkills();
      } catch (error) {
        console.error('Failed to delete skill:', error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingSkill(undefined);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSkill(undefined);
  };

  const allCategories = Array.from(new Set(skills.map(skill => skill.category))).sort();
  const allTags = Array.from(new Set(skills.flatMap(skill => skill.tags))).sort();

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

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
            <h1 className="text-3xl font-bold">Skills</h1>
            <p className="text-muted-foreground">
              Manage your skills and expertise levels
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="group-by-category"
                checked={groupByCategory}
                onCheckedChange={setGroupByCategory}
              />
              <Label htmlFor="group-by-category" className="text-sm">
                Group by category
              </Label>
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
        </div>

        {/* Category Filters */}
        {allCategories.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Tags</span>
            </div>
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
          </div>
        )}

        <SkillList
          skills={filteredSkills}
          onEdit={handleEdit}
          onDelete={handleDelete}
          view={view}
          groupByCategory={groupByCategory}
        />

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? 'Edit Skill' : 'Add Skill'}
              </DialogTitle>
            </DialogHeader>
            <SkillForm
              skill={editingSkill}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
