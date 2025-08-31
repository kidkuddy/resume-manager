"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EducationPage() {
  return (
    <DashboardLayout title="Education">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Education</h1>
            <p className="text-muted-foreground">
              Track your academic background and achievements
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No education records yet</h3>
                <p className="text-muted-foreground">
                  Add your academic background, degrees, and achievements.
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Education Record
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
