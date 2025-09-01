"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  FolderOpen, 
  Award, 
  Activity, 
  Code2, 
  GraduationCap, 
  FileCode,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dataManager from "@/lib/data-manager";

const sections = [
  { 
    title: "Experiences", 
    description: "Work experience and career history",
    icon: FileText, 
    path: "/experiences",
    color: "bg-blue-500"
  },
  { 
    title: "Projects", 
    description: "Personal and professional projects",
    icon: FolderOpen, 
    path: "/projects",
    color: "bg-green-500"
  },
  { 
    title: "Certifications", 
    description: "Professional certifications and credentials",
    icon: Award, 
    path: "/certifications",
    color: "bg-yellow-500"
  },
  { 
    title: "Activities", 
    description: "Volunteering, speaking, and community involvement",
    icon: Activity, 
    path: "/activities",
    color: "bg-purple-500"
  },
  { 
    title: "Skills", 
    description: "Technical and professional skills",
    icon: Code2, 
    path: "/skills",
    color: "bg-red-500"
  },
  { 
    title: "Education", 
    description: "Academic background and qualifications",
    icon: GraduationCap, 
    path: "/education",
    color: "bg-indigo-500"
  },
  { 
    title: "LaTeX Templates", 
    description: "Resume and CV templates",
    icon: FileCode, 
    path: "/templates",
    color: "bg-pink-500"
  }
];

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const allStats = await Promise.all([
        dataManager.getAllItems('experiences'),
        dataManager.getAllItems('projects'),
        dataManager.getAllItems('certifications'),
        dataManager.getAllActivities(),
        dataManager.getAllSkills(),
        dataManager.getAllEducation(),
        dataManager.getAllItems('templates'),
      ]);

      const [experiences, projects, certifications, activities, skills, education, templates] = allStats;

      // Calculate period counts for experiences
      const calculatePeriods = (items: any[]) => {
        return items.reduce((total, item) => {
          if (!item.startDate) return total;
          
          const start = new Date(item.startDate);
          const end = item.isCurrentRole ? new Date() : (item.endDate ? new Date(item.endDate) : new Date());
          
          const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + 
                              (end.getMonth() - start.getMonth());
          
          return total + Math.max(0, diffInMonths);
        }, 0);
      };

      const formatPeriod = (months: number) => {
        if (months === 0) return "0m";
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        
        if (years === 0) {
          return `${remainingMonths}m`;
        } else if (remainingMonths === 0) {
          return `${years}y`;
        } else {
          return `${years}y${remainingMonths}m`;
        }
      };

      const experiencePeriods = calculatePeriods(experiences);

      setStats({
        experiences: {
          count: experiences.length,
          period: formatPeriod(experiencePeriods)
        },
        projects: projects.length,
        certifications: certifications.length,
        activities: activities.length,
        skills: skills.length,
        education: education.length,
        templates: templates.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Dashboard" onDataChange={loadStats}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Resume Manager</h1>
          <p className="text-muted-foreground text-lg">
            Organize and manage all aspects of your professional profile in one place.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            // Loading skeletons
            [...Array(7)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12 mb-1" />
                  <Skeleton className="h-3 w-10" />
                </CardContent>
              </Card>
            ))
          ) : (
            // Actual stats cards
            sections.map((section) => {
              const sectionKey = section.title.toLowerCase().replace(/\s+/g, '').replace('latex', '');
              const count = section.title === 'Experiences' 
                ? stats.experiences?.count || 0 
                : stats[sectionKey] || 0;
              const period = section.title === 'Experiences' ? stats.experiences?.period : null;
              
              return (
                <Card key={section.title} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(section.path)}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {section.title}
                    </CardTitle>
                    <div className={`p-2 rounded-md ${section.color}`}>
                      <section.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{count}</div>
                    <p className="text-xs text-muted-foreground">
                      {section.title === 'Experiences' && period 
                        ? `${count} items (${period} total)` 
                        : `${count} items`}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.slice(0, 6).map((section) => (
              <Card key={section.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${section.color}`}>
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(section.path)}
                    >
                      View All
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`${section.path}?create=true`)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add New
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
