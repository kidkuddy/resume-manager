"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    description: "Academic background and achievements",
    icon: GraduationCap, 
    path: "/education",
    color: "bg-indigo-500"
  },
  { 
    title: "LaTeX Templates", 
    description: "Resume templates and formatting",
    icon: FileCode, 
    path: "/templates",
    color: "bg-orange-500"
  },
];

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    experiences: 0,
    projects: 0,
    certifications: 0,
    activities: 0,
    skills: 0,
    education: 0,
    templates: 0,
  });

  useEffect(() => {
    // Load stats from data manager
    setStats({
      experiences: dataManager.getAllItems('experiences').length,
      projects: dataManager.getAllItems('projects').length,
      certifications: dataManager.getAllItems('certifications').length,
      activities: dataManager.getAllItems('activities').length,
      skills: dataManager.getAllItems('skills').length,
      education: dataManager.getAllItems('education').length,
      templates: dataManager.getAllItems('templates').length,
    });
  }, []);

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
              window.location.reload(); // Refresh to show new data
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
      title="Dashboard"
      onExport={handleExport}
      onImport={handleImport}
    >
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
          {sections.map((section) => {
            const count = stats[section.path.slice(1) as keyof typeof stats];
            const Icon = section.icon;
            
            return (
              <Card 
                key={section.path} 
                className="cursor-pointer transition-colors hover:bg-accent/50"
                onClick={() => router.push(section.path)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {section.title}
                  </CardTitle>
                  <div className={`p-2 rounded-md ${section.color}/10`}>
                    <Icon className={`h-4 w-4 text-${section.color.split('-')[1]}-500`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground">
                    {count === 1 ? 'item' : 'items'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            
            return (
              <Card key={section.path} className="relative group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${section.color}/10`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {stats[section.path.slice(1) as keyof typeof stats]} items
                    </Badge>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push(section.path)}
                      >
                        View All
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => router.push(`${section.path}?new=true`)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add New
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Start building your professional profile by adding your information to each section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. Add Your Experience</h4>
                <p className="text-sm text-muted-foreground">
                  Start with your work history, including positions, companies, and achievements.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">2. Showcase Your Projects</h4>
                <p className="text-sm text-muted-foreground">
                  Add personal and professional projects that demonstrate your skills.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">3. List Your Skills</h4>
                <p className="text-sm text-muted-foreground">
                  Organize your technical and professional skills with categories and levels.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">4. Create LaTeX Templates</h4>
                <p className="text-sm text-muted-foreground">
                  Store and manage different resume formats and templates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
