import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { JobApplication } from "@/convex/schema";
import { format, formatDistanceToNow } from "date-fns";
import DeleteJobButton from "./DeleteJobButton";
import UpdateJobButton from "./UpdateJobButton";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useJobApplicationContext } from "@/contexts/JobApplicationContext";
import { cn } from "@/lib/utils";

interface JobApplicationCardProps {
  job: JobApplication;
}

export default function JobApplicationCard({
  job,
}: JobApplicationCardProps) {
  const deleteJob = useMutation(api.jobApplications.deleteJobApplication);
  const { title, company, location, status, appliedDate, url } = job;
  const { isJobNewlyAdded, removeNewlyAddedJob } = useJobApplicationContext();
  const isNewlyAdded = isJobNewlyAdded(job._id);

  const handleMouseEnter = () => {
    if (isNewlyAdded) {
      removeNewlyAddedJob(job._id);
    }
  };

  const onDelete = async () => {
    await deleteJob({ id: job._id });
  };

  const handleDetailsClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case "waiting":
        return {
          cardBorder: "border-l-orange-500 border-l-4",
          statusText: "text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400",
        };
      case "interviewed":
        return {
          cardBorder: "border-l-blue-500 border-l-4",
          statusText: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
        };
      case "rejected":
        return {
          cardBorder: "border-l-red-500 border-l-4",
          statusText: "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400",
        };
      case "accepted":
        return {
          cardBorder: "border-l-green-500 border-l-4",
          statusText: "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400",
        };
      default:
        return {
          cardBorder: "border-l-gray-500 border-l-4",
          statusText: "text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400",
        };
    }
  };

  const statusColors = getStatusColors(status);

  return (
    <Card
      className={cn(
        "w-full flex flex-col justify-between gap-4 relative",
        isNewlyAdded ? "new-job-card border-l-orange-500 border-l-4" : statusColors.cardBorder,
        isNewlyAdded && "new-job-application"
      )}
      onMouseEnter={handleMouseEnter}
    >
      {isNewlyAdded && (
        <span
          className="new-job-badge absolute -top-1 -right-1 capitalize px-2 py-1 rounded-md text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400"
        >
          NEW
        </span>
      )}
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
            <span>{format(appliedDate!, "PPP")} ({formatDistanceToNow(appliedDate!)} ago)</span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-muted-foreground font-semibold">Status:</span>
            <span className={`capitalize px-2 py-1 rounded-md text-xs font-medium ${statusColors.statusText}`}>
              {status}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={handleDetailsClick}>
              <ExternalLink className="h-4 w-4" />
              <span>Details</span>
            </Button>

            <UpdateJobButton jobId={job._id} currentJob={job} />

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
