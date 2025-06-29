import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
const schema = defineSchema({
  jobApplication: defineTable({
    userId: v.string(),
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
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_applied_date", ["userId", "appliedDate"]),
});

export default schema;

// Export the JobApplication type
export type JobApplication = Doc<"jobApplication">;
