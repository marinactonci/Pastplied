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
      .filter((q) => q.eq(q.field("userId"), identity.tokenIdentifier))
      .order("desc")
      .collect();

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
      createdAt: Date.now(),
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
