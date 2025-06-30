import { useState } from "react";
import JobApplicationCard from "./JobApplicationCard";
import JobApplicationFiltersComponent, {
  JobApplicationFilters,
} from "./JobApplicationFilters";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import NumberOfItemsForPagination from "./NumberOfItemsForPagination";

export default function JobApplicationList() {
  const [filters, setFilters] = useState<JobApplicationFilters>({
    searchText: "",
    location: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // Default to 9 for 3x3 grid

  // Get filtered job applications with pagination
  const jobApplicationsResult = useQuery(
    api.jobApplications.getFilteredJobApplicationsForUser,
    {
      searchText: filters.searchText || undefined,
      location: filters.location === "all" ? undefined : filters.location,
      status: filters.status === "all" ? undefined : filters.status,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      page: currentPage,
      pageSize: pageSize,
    },
  );

  // Get unique locations for filter dropdown
  const locations = useQuery(api.jobApplications.getUniqueLocations);

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: JobApplicationFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Reset to page 1 when page size changes
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const jobApplications = jobApplicationsResult?.jobs || [];
  const totalCount = jobApplicationsResult?.totalCount ?? 0;
  const totalPages = jobApplicationsResult?.totalPages ?? 0;
  const hasNextPage = jobApplicationsResult?.hasNextPage ?? false;
  const hasPreviousPage = jobApplicationsResult?.hasPreviousPage ?? false;

  const resultCount = totalCount;
  const hasFilters =
    filters.searchText ||
    (filters.location && filters.location !== "all") ||
    (filters.status && filters.status !== "all") ||
    filters.dateFrom ||
    filters.dateTo;

  if (!jobApplicationsResult || !locations) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show at least page 1
    if (totalPages === 0 || totalPages === 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={true}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
      return items;
    }

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // Show smart pagination with ellipsis
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
                className="cursor-pointer"
              >
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        }
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    }

    return items;
  };

  return (
    <div className="space-y-4 py-4">
      <h2 className="text-2xl font-semibold">Your Job Applications</h2>

      <JobApplicationFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        locations={locations}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {hasFilters ? (
            <>
              Showing {resultCount} filtered result
              {resultCount !== 1 ? "s" : ""}
            </>
          ) : (
            <>
              {resultCount} job application{resultCount !== 1 ? "s" : ""}
            </>
          )}
        </p>
        {resultCount > 0 && (
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.max(1, totalPages)}
          </p>
        )}
      </div>

      {jobApplications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {hasFilters
              ? "No job applications match your current filters."
              : "No job applications yet. Add one above!"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobApplications.map((job) => (
              <JobApplicationCard key={job._id} job={job} />
            ))}
          </div>

          <div className="flex flex-col gap-4 items-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={
                      hasPreviousPage
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-50"
                    }
                    aria-disabled={!hasPreviousPage}
                  />
                </PaginationItem>

                {generatePaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={
                      hasNextPage
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-50"
                    }
                    aria-disabled={!hasNextPage}
                  />
                </PaginationItem>
                <PaginationItem className="hidden md:block">
                  <NumberOfItemsForPagination
                    pageSize={pageSize}
                    setPageSize={handlePageSizeChange}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="flex md:hidden items-center gap-2 text-sm text-muted-foreground">
              <NumberOfItemsForPagination
                pageSize={pageSize}
                setPageSize={handlePageSizeChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
