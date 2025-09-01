import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dataManager } from '@/lib/data-manager';
import { Download, Upload, FileText, AlertTriangle, CheckCircle, Info, ArrowUpDown } from 'lucide-react';

interface ImportExportProps {
  onDataChange?: () => void;
}

export function ImportExportComponent({ onDataChange }: ImportExportProps) {
  const [showModal, setShowModal] = useState(false);
  const [importMode, setImportMode] = useState<'override' | 'merge'>('override');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    try {
      const data = await dataManager.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportStatus('idle');
    setImportPreview(null);

    try {
      const text = await file.text();
      const preview = await dataManager.getImportPreview(text);
      setImportPreview(preview);
    } catch (error) {
      console.error('Failed to parse file:', error);
      setImportPreview({ isValid: false });
    }
  };

  const handleImport = async () => {
    if (!importFile || !importPreview?.isValid) return;

    setIsProcessing(true);
    try {
      const text = await importFile.text();
      const success = await dataManager.importData(text, importMode);
      
      if (success) {
        setImportStatus('success');
        onDataChange?.();
        setTimeout(() => {
          setShowModal(false);
          resetImportState();
        }, 2000);
      } else {
        setImportStatus('error');
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetImportState = () => {
    setImportFile(null);
    setImportPreview(null);
    setImportStatus('idle');
    setImportMode('override');
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetImportState();
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setShowModal(true)} 
        className="w-full justify-start"
      >
        <ArrowUpDown className="h-4 w-4 mr-2" />
        Import / Export
      </Button>

      <Dialog open={showModal} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5" />
              Import / Export Data
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import Data
              </TabsTrigger>
            </TabsList>

            {/* Export Tab */}
            <TabsContent value="export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Your Resume Data
                  </CardTitle>
                  <CardDescription>
                    Download all your resume data as a JSON file for backup or sharing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This will download a complete backup of all your experiences, projects, skills, 
                      education, certifications, activities, and LaTeX templates.
                    </AlertDescription>
                  </Alert>
                  
                  <Button onClick={handleExport} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume Data
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Import Tab */}
            <TabsContent value="import" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Import Resume Data
                  </CardTitle>
                  <CardDescription>
                    Upload a JSON file to restore or merge resume data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Selection */}
                  <div>
                    <Label htmlFor="import-file" className="text-sm font-medium">
                      Select JSON File
                    </Label>
                    <input
                      id="import-file"
                      type="file"
                      accept=".json"
                      onChange={handleFileSelect}
                      className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </div>

                  {/* Import Mode Selection */}
                  {importFile && importPreview?.isValid && (
                    <div>
                      <Label className="text-sm font-medium">Import Mode</Label>
                      <RadioGroup 
                        value={importMode} 
                        onValueChange={(value: string) => setImportMode(value as 'override' | 'merge')} 
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="override" id="override" />
                          <Label htmlFor="override" className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            Override - Replace all existing data
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="merge" id="merge" />
                          <Label htmlFor="merge" className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Merge - Keep existing data and add new items
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Import Preview */}
                  {importPreview && (
                    <div>
                      {importPreview.isValid ? (
                        <div className="space-y-4">
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                              {importMode === 'override' 
                                ? 'This will replace all your current data with the imported data.'
                                : 'This will add new items to your existing data. Items with duplicate IDs will be skipped.'
                              }
                            </AlertDescription>
                          </Alert>

                          {/* Data Summary */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Import Summary</CardTitle>
                              <CardDescription>Items found in the import file</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-between">
                                  <span>Experiences:</span>
                                  <Badge variant="secondary">{importPreview.summary.experiences}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>Projects:</span>
                                  <Badge variant="secondary">{importPreview.summary.projects}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>Certifications:</span>
                                  <Badge variant="secondary">{importPreview.summary.certifications}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>Activities:</span>
                                  <Badge variant="secondary">{importPreview.summary.activities}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>Skills:</span>
                                  <Badge variant="secondary">{importPreview.summary.skills}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>Education:</span>
                                  <Badge variant="secondary">{importPreview.summary.education}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>Templates:</span>
                                  <Badge variant="secondary">{importPreview.summary.templates}</Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Conflicts Warning */}
                          {importPreview.conflicts && importPreview.conflicts.length > 0 && importMode === 'merge' && (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <div className="space-y-2">
                                  <p className="font-medium">
                                    {importPreview.conflicts.length} item(s) have ID conflicts and will be skipped:
                                  </p>
                                  <div className="space-y-1">
                                    {importPreview.conflicts.slice(0, 5).map((conflict: any, index: number) => (
                                      <div key={index} className="text-sm">
                                        <Badge variant="outline">{conflict.type}</Badge>
                                        <span className="ml-2">{conflict.incoming}</span>
                                      </div>
                                    ))}
                                    {importPreview.conflicts.length > 5 && (
                                      <p className="text-sm text-muted-foreground">
                                        ... and {importPreview.conflicts.length - 5} more
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      ) : (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Invalid file format. Please select a valid resume data JSON file.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  {/* Status Messages */}
                  {importStatus === 'success' && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Data imported successfully! The dialog will close automatically.
                      </AlertDescription>
                    </Alert>
                  )}

                  {importStatus === 'error' && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Failed to import data. Please check the file format and try again.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Import Button */}
                  {importFile && importPreview?.isValid && (
                    <Button 
                      onClick={handleImport} 
                      disabled={isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? 'Importing...' : `Import Data (${importMode})`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleModalClose} disabled={isProcessing}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
