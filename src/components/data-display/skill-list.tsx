"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skill } from "@/types";
import { Edit, Trash2, Star, Code, Users, Briefcase, Target } from "lucide-react";

interface SkillListProps {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
  view: 'cards' | 'table';
  groupByCategory?: boolean;
}

export function SkillList({ skills, onEdit, onDelete, view, groupByCategory = true }: SkillListProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <Code className="h-4 w-4" />;
      case 'soft':
        return <Users className="h-4 w-4" />;
      case 'leadership':
        return <Target className="h-4 w-4" />;
      case 'business':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'expert':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'proficient':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'familiar':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'experimented':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getProficiencyProgress = (proficiency: string) => {
    switch (proficiency) {
      case 'expert':
        return 90;
      case 'proficient':
        return 70;
      case 'familiar':
        return 45;
      case 'experimented':
        return 20;
      default:
        return 0;
    }
  };

  const formatCategory = (category: string) => {
    const categories = {
      'technical': 'Technical',
      'soft': 'Soft Skills',
      'leadership': 'Leadership',
      'business': 'Business',
      'language': 'Languages',
      'creative': 'Creative',
      'other': 'Other'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const formatProficiency = (proficiency: string) => {
    const levels = {
      'experimented': 'Experimented',
      'familiar': 'Familiar',
      'proficient': 'Proficient',
      'expert': 'Expert'
    };
    return levels[proficiency as keyof typeof levels] || proficiency;
  };

  const groupedSkills = groupByCategory ? 
    skills.reduce((acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>) :
    { '': skills };

  if (skills.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No skills recorded</h3>
        <p>Add your skills and expertise to showcase your abilities.</p>
      </div>
    );
  }

  if (view === 'cards') {
    return (
      <div className="space-y-8">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            {groupByCategory && category && (
              <div className="flex items-center gap-2 mb-4">
                {getCategoryIcon(category)}
                <h3 className="text-lg font-semibold">{formatCategory(category)}</h3>
                <Badge variant="outline" className="ml-auto">
                  {categorySkills.length} skills
                </Badge>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySkills.map((skill) => (
                <Card key={skill.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getCategoryIcon(skill.category)}
                          {skill.title}
                        </CardTitle>
                        {skill.description && (
                          <CardDescription className="mt-1 line-clamp-2">
                            {skill.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(skill)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(skill.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getProficiencyColor(skill.proficiency)}>
                        {formatProficiency(skill.proficiency)}
                      </Badge>
                    </div>

                    {skill.projects.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Related Projects</div>
                        <div className="flex flex-wrap gap-1">
                          {skill.projects.slice(0, 3).map((project) => (
                            <Badge key={project} variant="outline" className="text-xs">
                              {project}
                            </Badge>
                          ))}
                          {skill.projects.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{skill.projects.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {skill.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {skill.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {skill.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{skill.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Skill</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Proficiency</TableHead>
            <TableHead>Projects</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map((skill) => (
            <TableRow key={skill.id}>
              <TableCell>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {getCategoryIcon(skill.category)}
                    {skill.title}
                  </div>
                  {skill.description && (
                    <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {skill.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {formatCategory(skill.category)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getProficiencyColor(skill.proficiency)}>
                  {formatProficiency(skill.proficiency)}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {skill.projects.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {skill.projects.slice(0, 2).map((project) => (
                      <Badge key={project} variant="outline" className="text-xs">
                        {project}
                      </Badge>
                    ))}
                    {skill.projects.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{skill.projects.length - 2}
                      </span>
                    )}
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(skill)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(skill.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
