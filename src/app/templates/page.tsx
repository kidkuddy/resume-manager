"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TemplatesPage() {
  return (
    <DashboardLayout title="LaTeX Templates">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">LaTeX Templates</h1>
            <p className="text-muted-foreground">
              Manage resume templates and formatting options
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No templates yet</h3>
                <p className="text-muted-foreground">
                  Store and manage your LaTeX resume templates.
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
