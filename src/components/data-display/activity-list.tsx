"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity } from "@/types";
import { Edit, Trash2, Calendar, MapPin, Users, Mic, Heart, Target } from "lucide-react";

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  view: 'cards' | 'table';
}

export function ActivityList({ activities, onEdit, onDelete, view }: ActivityListProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'volunteering':
        return <Heart className="h-4 w-4" />;
      case 'speaking':
        return <Mic className="h-4 w-4" />;
      case 'mentoring':
        return <Users className="h-4 w-4" />;
      case 'community':
        return <Target className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'volunteering':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'speaking':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'mentoring':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'community':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatType = (type: string) => {
    const types = {
      'volunteering': 'Volunteering',
      'speaking': 'Speaking',
      'mentoring': 'Mentoring',
      'community': 'Community',
      'other': 'Other'
    };
    return types[type as keyof typeof types] || type;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (startDate: string, endDate?: string, current?: boolean) => {
    const start = formatDate(startDate);
    if (current) return `${start} - Present`;
    if (endDate) return `${start} - ${formatDate(endDate)}`;
    return start;
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No activities recorded</h3>
        <p>Add your community involvement and activities to showcase your engagement.</p>
      </div>
    );
  }

  if (view === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getTypeIcon(activity.type)}
                    {activity.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {activity.organization}
                  </CardDescription>
                  {activity.role && (
                    <CardDescription className="text-xs mt-1">
                      {activity.role}
                    </CardDescription>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(activity)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(activity.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={getTypeColor(activity.type)}>
                  {formatType(activity.type)}
                </Badge>
                {activity.current && (
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDateRange(activity.startDate, activity.endDate, activity.current)}
              </div>

              {activity.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {activity.location}
                </div>
              )}

              {activity.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {activity.description}
                </p>
              )}

              {activity.impact.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Impact & Outcomes</div>
                  <div className="flex flex-wrap gap-1">
                    {activity.impact.slice(0, 2).map((impact) => (
                      <Badge key={impact} variant="secondary" className="text-xs">
                        {impact}
                      </Badge>
                    ))}
                    {activity.impact.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{activity.impact.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {activity.skills.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Skills Developed</div>
                  <div className="flex flex-wrap gap-1">
                    {activity.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {activity.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{activity.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {activity.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {activity.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="default" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {activity.tags.length > 3 && (
                    <Badge variant="default" className="text-xs">
                      +{activity.tags.length - 3} more
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
            <TableHead>Activity & Organization</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Impact</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {getTypeIcon(activity.type)}
                    {activity.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activity.organization}
                    {activity.role && ` • ${activity.role}`}
                  </div>
                  {activity.description && (
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {activity.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getTypeColor(activity.type)}>
                  {formatType(activity.type)}
                </Badge>
                {activity.current && (
                  <Badge variant="outline" className="ml-1 text-green-400 border-green-400">
                    Active
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {formatDateRange(activity.startDate, activity.endDate, activity.current)}
              </TableCell>
              <TableCell className="text-sm">
                {activity.location || '-'}
              </TableCell>
              <TableCell className="text-sm">
                {activity.impact.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {activity.impact.slice(0, 1).map((impact) => (
                      <Badge key={impact} variant="secondary" className="text-xs">
                        {impact}
                      </Badge>
                    ))}
                    {activity.impact.length > 1 && (
                      <span className="text-xs text-muted-foreground">
                        +{activity.impact.length - 1}
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
                    onClick={() => onEdit(activity)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(activity.id)}
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
