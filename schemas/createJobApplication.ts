import { z } from "zod";

export const createJobSchema = z.object({
  jobLink: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Job link is required"),
  date: z.date({ required_error: "Please select a date" }),
});
