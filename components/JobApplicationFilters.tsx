"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { JollyRangeCalendar } from "@/components/ui/range-calendar";
import { Search, X, Filter, Calendar, Eye, EyeClosed } from "lucide-react";
import { parseDate, CalendarDate } from "@internationalized/date";

export interface JobApplicationFilters {
  searchText: string;
  location: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

interface JobApplicationFiltersComponentProps {
  filters: JobApplicationFilters;
  onFiltersChange: (filters: JobApplicationFilters) => void;
  locations: string[];
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "waiting", label: "Waiting" },
  { value: "interviewed", label: "Interviewed" },
  { value: "rejected", label: "Rejected" },
  { value: "accepted", label: "Accepted" },
];

export default function JobApplicationFiltersComponent({
  filters,
  onFiltersChange,
  locations,
}: JobApplicationFiltersComponentProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [localFilters, setLocalFilters] =
    useState<JobApplicationFilters>(filters);

  // Update local filters when external filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const hasActiveFilters =
    filters.searchText ||
    (filters.location && filters.location !== "all") ||
    (filters.status && filters.status !== "all") ||
    filters.dateFrom ||
    filters.dateTo;

  const hasUnappliedChanges =
    localFilters.searchText !== filters.searchText ||
    localFilters.location !== filters.location ||
    localFilters.status !== filters.status ||
    localFilters.dateFrom !== filters.dateFrom ||
    localFilters.dateTo !== filters.dateTo;

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      searchText: "",
      location: "all",
      status: "all",
      dateFrom: "",
      dateTo: "",
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const resetToApplied = () => {
    setLocalFilters(filters);
  };

  const updateLocalFilter = (
    key: keyof JobApplicationFilters,
    value: string,
  ) => {
    setLocalFilters({
      ...localFilters,
      [key]: value,
    });
  };

  // Helper function to convert date strings to CalendarDate
  const getDateRange = () => {
    try {
      const start = localFilters.dateFrom
        ? parseDate(localFilters.dateFrom)
        : null;
      const end = localFilters.dateTo ? parseDate(localFilters.dateTo) : null;

      if (start && end) {
        return { start, end };
      }
      return null;
    } catch {
      return null;
    }
  };

  // Handle date range selection
  const handleDateRangeChange = (
    range: { start: CalendarDate; end: CalendarDate } | null,
  ) => {
    if (range) {
      setLocalFilters({
        ...localFilters,
        dateFrom: range.start.toString(),
        dateTo: range.end.toString(),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        dateFrom: "",
        dateTo: "",
      });
    }
  };

  const formatDateRange = () => {
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } catch {
        return dateString;
      }
    };

    if (localFilters.dateFrom && localFilters.dateTo) {
      return `${formatDate(localFilters.dateFrom)} to ${formatDate(localFilters.dateTo)}`;
    } else if (localFilters.dateFrom) {
      return `From ${formatDate(localFilters.dateFrom)}`;
    } else if (localFilters.dateTo) {
      return `Until ${formatDate(localFilters.dateTo)}`;
    }
    return "Select date range";
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="text-sm font-medium">Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-2 text-xs"
          >
            {isExpanded ? (
              <EyeClosed className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
            {isExpanded ? "Hide" : "Show"} Filters
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="flex items-start flex-wrap gap-4">
            {/* Search Input - Made wider */}
            <div className="space-y-1 min-w-[300px] flex-1">
              <label className="text-xs font-medium text-muted-foreground">
                Search by Title or Company
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={localFilters.searchText}
                  onChange={(e) =>
                    updateLocalFilter("searchText", e.target.value)
                  }
                  className="pl-9"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-1 w-auto">
              <label className="text-xs font-medium text-muted-foreground">
                Location
              </label>
              <Select
                value={localFilters.location || "all"}
                onValueChange={(value) => updateLocalFilter("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1 w-auto">
              <label className="text-xs font-medium text-muted-foreground">
                Status
              </label>
              <Select
                value={localFilters.status || "all"}
                onValueChange={(value) => updateLocalFilter("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range with Range Calendar */}
            <div className="space-y-1 w-auto">
              <label className="text-xs font-medium text-muted-foreground">
                Applied Date Range
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-9"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="truncate">{formatDateRange()}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3">
                    <JollyRangeCalendar
                      value={getDateRange()}
                      onChange={handleDateRangeChange}
                    />
                    {(localFilters.dateFrom || localFilters.dateTo) && (
                      <div className="flex justify-end pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDateRangeChange(null)}
                          className="h-8 px-2 text-xs"
                        >
                          Clear Dates
                        </Button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Filter Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            {hasUnappliedChanges && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToApplied}
                className="h-8 px-3 text-xs"
              >
                Reset
              </Button>
            )}
            <Button
              onClick={applyFilters}
              size="sm"
              className="h-8 px-4 text-xs"
              disabled={!hasUnappliedChanges}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
