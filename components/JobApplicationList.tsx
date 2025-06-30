import { useState } from "react";
import JobApplicationCard from "./JobApplicationCard";
import JobApplicationFiltersComponent, { JobApplicationFilters } from "./JobApplicationFilters";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function JobApplicationList() {
  const [filters, setFilters] = useState<JobApplicationFilters>({
    searchText: "",
    location: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Get filtered job applications
  const jobApplications = useQuery(
    api.jobApplications.getFilteredJobApplicationsForUser,
    {
      searchText: filters.searchText || undefined,
      location: filters.location === "all" ? undefined : filters.location,
      status: filters.status === "all" ? undefined : filters.status,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
    }
  );

  // Get unique locations for filter dropdown
  const locations = useQuery(api.jobApplications.getUniqueLocations);

  const resultCount = jobApplications?.length ?? 0;
  const hasFilters = filters.searchText ||
    (filters.location && filters.location !== "all") ||
    (filters.status && filters.status !== "all") ||
    filters.dateFrom ||
    filters.dateTo;

  if (!jobApplications || !locations) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="space-y-4 py-4">
      <h2 className="text-2xl font-semibold">Your Job Applications</h2>

      <JobApplicationFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        locations={locations}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {hasFilters ? (
            <>Showing {resultCount} filtered result{resultCount !== 1 ? 's' : ''}</>
          ) : (
            <>{resultCount} job application{resultCount !== 1 ? 's' : ''}</>
          )}
        </p>
      </div>

      {jobApplications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {hasFilters
              ? "No job applications match your current filters."
              : "No job applications yet. Add one above!"
            }
          </p>
        </div>
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
