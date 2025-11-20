import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getJobApplicationsForUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User is not authenticated");
    }

    const jobApplications = await ctx.db
      .query("jobApplication")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    // Sort by applied date (most recent first), then by createdAt (most recent first) for same dates
    jobApplications.sort((a, b) => {
      // Handle cases where appliedDate might be missing
      if (!a.appliedDate && !b.appliedDate) {
        return b._creationTime - a._creationTime;
      }
      if (!a.appliedDate) return 1; // Put entries without applied date at the end
      if (!b.appliedDate) return -1;

      // Compare applied dates first
      const dateComparison =
        new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();

      // If applied dates are the same, sort by createdAt (most recent first)
      if (dateComparison === 0) {
        return b._creationTime - a._creationTime;
      }

      return dateComparison;
    });

    return jobApplications;
  },
});

export const getJobApplication = query({
  args: {
    id: v.id("jobApplication"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User is not authenticated");
    }

    const jobApplication = await ctx.db.get(args.id);

    if (!jobApplication || jobApplication.userId !== identity.tokenIdentifier) {
      throw new Error("Job application not found or access denied");
    }

    return jobApplication;
  },
});

export const createJobApplication = mutation({
  args: {
    url: v.string(),
    title: v.optional(v.string()),
    company: v.optional(v.string()),
    location: v.optional(v.string()),
    appliedDate: v.optional(v.string()),
    status: v.union(
      v.literal("waiting"),
      v.literal("interviewed"),
      v.literal("rejected"),
      v.literal("accepted"),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User is not authenticated");
    }

    const jobApplication = await ctx.db.insert("jobApplication", {
      userId: identity.tokenIdentifier,
      url: args.url,
      title: args.title,
      company: args.company,
      location: args.location,
      appliedDate: args.appliedDate,
      status: args.status,
    });

    return jobApplication;
  },
});

export const updateJobApplication = mutation({
  args: {
    id: v.id("jobApplication"),
    url: v.optional(v.string()),
    title: v.optional(v.string()),
    company: v.optional(v.string()),
    location: v.optional(v.string()),
    appliedDate: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("waiting"),
        v.literal("interviewed"),
        v.literal("rejected"),
        v.literal("accepted"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User is not authenticated");
    }

    const jobApplication = await ctx.db.get(args.id);

    if (!jobApplication || jobApplication.userId !== identity.tokenIdentifier) {
      throw new Error("Job application not found or access denied");
    }

    const updatedJobApplication = await ctx.db.patch(args.id, {
      url: args.url,
      title: args.title,
      company: args.company,
      location: args.location,
      appliedDate: args.appliedDate,
      status: args.status,
    });

    return updatedJobApplication;
  },
});

export const getFilteredJobApplicationsForUser = query({
  args: {
    searchText: v.optional(v.string()),
    location: v.optional(v.string()),
    status: v.optional(v.string()),
    dateFrom: v.optional(v.string()),
    dateTo: v.optional(v.string()),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User is not authenticated");
    }

    let jobApplications = await ctx.db
      .query("jobApplication")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    // Apply filters
    if (args.searchText && args.searchText.trim()) {
      const searchLower = args.searchText.toLowerCase();
      jobApplications = jobApplications.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchLower) ||
          false ||
          job.company?.toLowerCase().includes(searchLower) ||
          false,
      );
    }

    if (args.location && args.location !== "all") {
      jobApplications = jobApplications.filter(
        (job) => job.location === args.location,
      );
    }

    if (args.status && args.status !== "all") {
      jobApplications = jobApplications.filter(
        (job) => job.status === args.status,
      );
    }

    if (args.dateFrom || args.dateTo) {
      jobApplications = jobApplications.filter((job) => {
        if (!job.appliedDate) return false;

        const jobDate = new Date(job.appliedDate);
        let withinRange = true;

        if (args.dateFrom) {
          const fromDate = new Date(args.dateFrom);
          withinRange = withinRange && jobDate >= fromDate;
        }

        if (args.dateTo) {
          const toDate = new Date(args.dateTo);
          toDate.setHours(23, 59, 59, 999); // Include the entire end date
          withinRange = withinRange && jobDate <= toDate;
        }

        return withinRange;
      });
    }

    // Sort by applied date (most recent first), then by createdAt (most recent first) for same dates
    jobApplications.sort((a, b) => {
      // Handle cases where appliedDate might be missing
      if (!a.appliedDate && !b.appliedDate) {
        return b._creationTime - a._creationTime;
      }
      if (!a.appliedDate) return 1; // Put entries without applied date at the end
      if (!b.appliedDate) return -1;

      // Compare applied dates first
      const dateComparison =
        new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();

      // If applied dates are the same, sort by createdAt (most recent first)
      if (dateComparison === 0) {
        return b._creationTime - a._creationTime;
      }

      return dateComparison;
    });

    // Calculate pagination
    const page = args.page || 1;
    const pageSize = args.pageSize || 9; // 3x3 grid
    const totalCount = jobApplications.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedJobs = jobApplications.slice(startIndex, endIndex);

    return {
      jobs: paginatedJobs,
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  },
});

export const getUniqueLocations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User is not authenticated");
    }

    const jobApplications = await ctx.db
      .query("jobApplication")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    const locations = jobApplications
      .map((job) => job.location)
      .filter((location): location is string => Boolean(location))
      .filter((location, index, array) => array.indexOf(location) === index)
      .sort();

    return locations;
  },
});

export const deleteJobApplication = mutation({
  args: {
    id: v.id("jobApplication"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User is not authenticated");
    }

    const jobApplication = await ctx.db.get(args.id);

    if (!jobApplication || jobApplication.userId !== identity.tokenIdentifier) {
      throw new Error("Job application not found or access denied");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
