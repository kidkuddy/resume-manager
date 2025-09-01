"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Education } from "@/types";
import { Edit, Trash2, GraduationCap, Calendar, MapPin, BookOpen } from "lucide-react";

interface EducationListProps {
  education: Education[];
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
  view: 'cards' | 'table';
}

export function EducationList({ education, onEdit, onDelete, view }: EducationListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getDegreeColor = (degree: string) => {
    switch (degree) {
      case 'phd':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'masters':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'bachelor':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'associate':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'engineering':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'certificate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatDegreeType = (degree: string) => {
    const types = {
      'bachelor': 'Bachelor\'s',
      'masters': 'Master\'s',
      'phd': 'PhD',
      'associate': 'Associate',
      'engineering': 'Engineering',
      'certificate': 'Certificate',
      'diploma': 'Diploma',
      'other': 'Other'
    };
    return types[degree as keyof typeof types] || degree;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (education.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No education records</h3>
        <p>Add your educational background to get started.</p>
      </div>
    );
  }

  if (view === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {education.map((edu) => (
          <Card key={edu.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    {edu.title || `${formatDegreeType(edu.degree)} in ${edu.field}`}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {edu.institution}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(edu)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(edu.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={getDegreeColor(edu.degree)}>
                  {formatDegreeType(edu.degree)}
                </Badge>
                <Badge className={getStatusColor(edu.status)}>
                  {edu.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {edu.location}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
              </div>

              {edu.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {edu.description}
                </p>
              )}

              {edu.coursework.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">Key Coursework</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {edu.coursework.slice(0, 3).map((course) => (
                      <Badge key={course} variant="outline" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                    {edu.coursework.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{edu.coursework.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {edu.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {edu.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {edu.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{edu.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Institution & Program</TableHead>
            <TableHead>Degree</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {education.map((edu) => (
            <TableRow key={edu.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{edu.institution}</div>
                  <div className="text-sm text-muted-foreground">
                    {edu.title || `${formatDegreeType(edu.degree)} in ${edu.field}`}
                  </div>
                  {edu.description && (
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {edu.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getDegreeColor(edu.degree)}>
                  {formatDegreeType(edu.degree)}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(edu.status)}>
                  {edu.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {edu.location}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(edu)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(edu.id)}
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
