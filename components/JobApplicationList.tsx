import { JobApplication } from "@/convex/schema";
import JobApplicationCard from "./JobApplicationCard";

interface JobApplicationListProps {
  jobApplications: JobApplication[];
}

export default function JobApplicationList({
  jobApplications,
}: JobApplicationListProps) {
  return (
    <div className="space-y-4 py-4">
      <h2 className="text-2xl font-semibold">Your Job Applications</h2>
      {jobApplications.length === 0 ? (
        <p className="text-muted-foreground">
          No job applications yet. Add one above!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobApplications.map((job) => (
            <JobApplicationCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
