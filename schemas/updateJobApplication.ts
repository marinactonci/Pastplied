import { z } from "zod";

export const updateJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  url: z.string().url("Please enter a valid URL"),
  appliedDate: z.date({ required_error: "Please select a date" }),
  status: z.enum(["waiting", "interviewed", "rejected", "accepted"]),
});
