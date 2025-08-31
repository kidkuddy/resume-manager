"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function ExperiencesPage() {
  return (
    <DashboardLayout title="Experiences">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Work Experience</h1>
            <p className="text-muted-foreground">
              Manage your career history and professional experience
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No experiences yet</h3>
                <p className="text-muted-foreground">
                  Start building your professional profile by adding your work experience.
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
