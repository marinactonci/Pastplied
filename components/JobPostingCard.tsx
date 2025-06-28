import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit, Trash2 } from "lucide-react";

interface JobPostingCardProps {
  jobName: string;
  firmName: string;
  location: string;
  appliedDate: string;
  originalLink: string;
}

export default function JobPostingCard({
  jobName,
  firmName,
  location,
  appliedDate,
  originalLink,
}: JobPostingCardProps) {
  const onUpdate = () => {
    console.log(`Update job: ${jobName}`);
  };

  const onDelete = () => {
    console.log(`Delete job: ${jobName}`);
  };

  const handleDetailsClick = () => {
    window.open(originalLink, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{jobName}</h3>
            <p className="text-sm text-muted-foreground">{firmName}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Location:</span>
            <span>{location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Applied:</span>
            <span>{appliedDate}</span>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDetailsClick}
              className="flex items-center space-x-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Details</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onUpdate}
              className="flex items-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>Update</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="flex items-center space-x-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
