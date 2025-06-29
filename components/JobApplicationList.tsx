import { JobApplication } from "@/convex/schema";
import JobApplicationCard from "./JobApplicationCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function JobApplicationList() {
  const jobApplications = useQuery(
    api.jobApplications.getJobApplicationsForUser,
  );

  if (jobApplications === undefined) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

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
