import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, ExternalLink, Award } from "lucide-react";
import { Certification } from "@/types";

interface CertificationListProps {
  certifications: Certification[];
  viewMode: 'cards' | 'table';
  onEdit: (certification: Certification) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'expired':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getWorthinessColor = (worthiness: string) => {
  switch (worthiness) {
    case 'premium':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'earned':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'free':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'basic':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getWorthinessLabel = (worthiness: string) => {
  switch (worthiness) {
    case 'premium':
      return 'Premium';
    case 'earned':
      return 'Earned';
    case 'free':
      return 'Free';
    case 'basic':
      return 'Basic';
    default:
      return worthiness;
  }
};

function CertificationCard({ certification, onEdit, onDelete }: { certification: Certification; onEdit: (cert: Certification) => void; onDelete: (id: string) => void }) {
  const isExpired = certification.expirationDate && new Date(certification.expirationDate) < new Date();
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">{certification.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{certification.issuer}</p>
            <p className="text-xs text-muted-foreground">
              Issued: {new Date(certification.issueDate).toLocaleDateString()}
              {certification.expirationDate && (
                <span className={isExpired ? 'text-red-500' : ''}>
                  {" • Expires: "}{new Date(certification.expirationDate).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(certification)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(certification.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {certification.description && (
          <p className="text-sm text-muted-foreground">{certification.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(certification.status)}>
            {certification.status}
          </Badge>
          <Badge className={getWorthinessColor(certification.worthiness)}>
            {getWorthinessLabel(certification.worthiness)}
          </Badge>
        </div>

        {certification.credentialId && (
          <p className="text-xs text-muted-foreground">
            ID: {certification.credentialId}
          </p>
        )}

        {certification.credentialUrl && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(certification.credentialUrl, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Verify
            </Button>
          </div>
        )}

        {certification.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {certification.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CertificationTable({ certifications, onEdit, onDelete }: { certifications: Certification[]; onEdit: (cert: Certification) => void; onDelete: (id: string) => void }) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Certification</TableHead>
            <TableHead>Issuer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Worthiness</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certifications.map((certification) => {
            const isExpired = certification.expirationDate && new Date(certification.expirationDate) < new Date();
            
            return (
              <TableRow key={certification.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{certification.title}</div>
                    {certification.description && (
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {certification.description}
                      </div>
                    )}
                    {certification.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {certification.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {certification.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{certification.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{certification.issuer}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(certification.status)}>
                    {certification.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getWorthinessColor(certification.worthiness)}>
                    {getWorthinessLabel(certification.worthiness)}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(certification.issueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {certification.expirationDate ? (
                    <span className={isExpired ? 'text-red-500' : ''}>
                      {new Date(certification.expirationDate).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No expiration</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {certification.credentialUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(certification.credentialUrl, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(certification)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(certification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function CertificationList({ certifications, viewMode, onEdit, onDelete }: CertificationListProps) {
  if (certifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No certifications yet</h3>
        <p className="text-muted-foreground mb-4">
          Add your first certification to showcase your credentials.
        </p>
      </div>
    );
  }

  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((certification) => (
          <CertificationCard
            key={certification.id}
            certification={certification}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return <CertificationTable certifications={certifications} onEdit={onEdit} onDelete={onDelete} />;
}
