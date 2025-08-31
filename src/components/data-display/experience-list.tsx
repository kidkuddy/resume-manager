"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Edit, Trash2, MapPin, Calendar, Building } from "lucide-react";
import { Experience } from "@/types";

interface ExperienceListProps {
  experiences: Experience[];
  viewMode: 'cards' | 'table';
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

export function ExperienceList({ experiences, viewMode, onEdit, onDelete }: ExperienceListProps) {
  if (experiences.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center">
              <Building className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No experiences yet</h3>
              <p className="text-muted-foreground">
                Start building your professional profile by adding your work experience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'table') {
    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell className="font-medium">{experience.position}</TableCell>
                <TableCell>{experience.company}</TableCell>
                <TableCell>{experience.location}</TableCell>
                <TableCell>
                  {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {experience.type.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {experience.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {experience.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{experience.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(experience)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(experience.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {experiences.map((experience) => (
        <Card key={experience.id} className="group hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{experience.position}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Building className="h-4 w-4" />
                  {experience.company}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(experience)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(experience.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {experience.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="capitalize">
                {experience.type.replace('-', ' ')}
              </Badge>
              {experience.tags.map((tag) => (
                <Badge key={tag} variant="default" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {experience.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {experience.description}
              </p>
            )}

            {experience.responsibilities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Key Responsibilities</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {experience.responsibilities.slice(0, 3).map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      <span className="line-clamp-2">{resp}</span>
                    </li>
                  ))}
                  {experience.responsibilities.length > 3 && (
                    <li className="text-xs italic">+{experience.responsibilities.length - 3} more...</li>
                  )}
                </ul>
              </div>
            )}

            {experience.achievements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Achievements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {experience.achievements.slice(0, 2).map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="line-clamp-2">{achievement}</span>
                    </li>
                  ))}
                  {experience.achievements.length > 2 && (
                    <li className="text-xs italic">+{experience.achievements.length - 2} more...</li>
                  )}
                </ul>
              </div>
            )}

            {experience.technologies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-1">
                  {experience.technologies.slice(0, 6).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {experience.technologies.length > 6 && (
                    <Badge variant="secondary" className="text-xs">
                      +{experience.technologies.length - 6}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
