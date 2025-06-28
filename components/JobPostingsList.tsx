import { JobPosting } from "@/types/job-posting";
import JobPostingCard from "./JobPostingCard";

interface JobPostingsListProps {
  jobPostings: JobPosting[];
}

export default function JobPostingsList({ jobPostings }: JobPostingsListProps) {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-semibold">Your Job Applications</h2>
      {jobPostings.length === 0 ? (
        <p className="text-muted-foreground">
          No job applications yet. Add one above!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobPostings.map((job) => (
            <JobPostingCard
              key={job.id}
              jobName={job.jobName}
              firmName={job.firmName}
              location={job.location}
              appliedDate={job.appliedDate}
              originalLink={job.originalLink}
            />
          ))}
        </div>
      )}
    </div>
  );
}
