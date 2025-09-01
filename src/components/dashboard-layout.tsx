"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImportExportComponent } from "@/components/import-export";
import { 
  FileText, 
  FolderOpen, 
  Award, 
  Activity, 
  Code2, 
  GraduationCap, 
  FileCode,
  Search,
  Download,
  Upload,
  Home
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const navigationItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Experiences", icon: FileText, path: "/experiences" },
  { title: "Projects", icon: FolderOpen, path: "/projects" },
  { title: "Certifications", icon: Award, path: "/certifications" },
  { title: "Activities", icon: Activity, path: "/activities" },
  { title: "Skills", icon: Code2, path: "/skills" },
  { title: "Education", icon: GraduationCap, path: "/education" },
  { title: "LaTeX Templates", icon: FileCode, path: "/templates" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  selectedTags?: string[];
  onTagSelect?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  availableTags?: string[];
  onDataChange?: () => void;
}

export function DashboardLayout({
  children,
  title = "Dashboard",
  searchValue = "",
  onSearchChange,
  selectedTags = [],
  onTagSelect,
  onTagRemove,
  availableTags = [],
  onDataChange,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar className="border-r border-border">
          <SidebarHeader className="p-6 border-b border-border">
            <h1 className="text-xl font-bold">Resume Manager</h1>
            <p className="text-sm text-muted-foreground">
              Manage your professional profile
            </p>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu className="p-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => router.push(item.path)}
                    isActive={pathname === item.path}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            
            {/* Import/Export Actions */}
            <div className="mt-auto p-4 border-t border-border">
              <ImportExportComponent onDataChange={onDataChange} />
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1">
          {/* Top Bar */}
          <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="h-8 w-8" />
              
              <h2 className="font-semibold text-lg">{title}</h2>
              
              <div className="ml-auto flex items-center gap-4">
                {/* Search */}
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            
            {/* Tags Filter */}
            {availableTags.length > 0 && (
              <div className="px-6 py-3 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                  {availableTags.slice(0, 10).map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          onTagRemove?.(tag);
                        } else {
                          onTagSelect?.(tag);
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {availableTags.length > 10 && (
                    <Badge variant="outline" className="text-muted-foreground">
                      +{availableTags.length - 10} more
                    </Badge>
                  )}
                </div>
                
                {selectedTags.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-muted-foreground">Selected:</span>
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => onTagRemove?.(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
