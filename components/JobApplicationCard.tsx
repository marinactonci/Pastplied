import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit } from "lucide-react";
import { JobApplication } from "@/convex/schema";
import { format } from "date-fns";
import DeleteJobButton from "./DeleteJobButton";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

interface JobApplicationCardProps {
  job: JobApplication;
}

export default function JobApplicationCard({
  job,
}: JobApplicationCardProps) {
  const deleteJob = useMutation(api.jobApplications.deleteJobApplication);
  const { title, company, location, status, appliedDate, url } = job;

  const onUpdate = () => {
    console.log(`Update job: ${title}`);
  };

  const onDelete = () => {
    deleteJob({ id: job._id });
  };

  const handleDetailsClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="w-full flex flex-col justify-between gap-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{company}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex gap-2 text-sm">
            <span className="text-muted-foreground font-semibold">
              Location:
            </span>
            <span>{location}</span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-muted-foreground font-semibold">
              Applied:
            </span>
            <span>{format(appliedDate!, "PPP")}</span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-muted-foreground font-semibold">Status:</span>
            <span className="capitalize">{status}</span>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" size="sm" onClick={handleDetailsClick}>
              <ExternalLink className="h-4 w-4" />
              <span>Details</span>
            </Button>

            <Button variant="outline" size="sm" onClick={onUpdate}>
              <Edit className="h-4 w-4" />
              <span>Update</span>
            </Button>

            <DeleteJobButton
              jobTitle={title}
              company={company}
              onDelete={onDelete}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
