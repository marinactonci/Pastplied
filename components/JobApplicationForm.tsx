"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getJobListingData } from "@/lib/ai";
import { createJobSchema } from "@/schemas/createJobApplication";
import { toast } from "sonner";
import { useJobApplicationContext } from "@/contexts/JobApplicationContext";

export default function JobApplicationForm() {
  const createJob = useMutation(api.jobApplications.createJobApplication);
  const [isLoading, setIsLoading] = useState(false);
  const { addNewlyAddedJob } = useJobApplicationContext();

  const form = useForm<z.infer<typeof createJobSchema>>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      jobLink: "",
      date: new Date(),
    },
  });

  const handleSubmit = async (values: z.infer<typeof createJobSchema>) => {
    setIsLoading(true);
    try {
      const jobData = await getJobListingData(values.jobLink);

      if (jobData === null) {
        toast.warning("Invalid job posting", {
          description: "Please check the job link and try again.",
          duration: 5000,
        });
        return;
      }

      const newJobId = await createJob({
        url: values.jobLink,
        title: jobData?.title,
        company: jobData?.company,
        location: jobData?.location,
        appliedDate: values.date
          ? format(values.date, "yyyy-MM-dd")
          : undefined,
        status: "waiting",
      });

      // Add to newly added jobs for animation
      addNewlyAddedJob(newJobId);

      // Check if title, company or location is missing
      if (!jobData?.title || !jobData?.company || !jobData?.location) {
        // Show warning toast
        toast.warning("Some job details are missing", {
          description: "Please refresh the page and try again.",
          duration: 5000,
        });
      } else {
        // Show success toast
        toast.success("Application added successfully!", {
          description: `${jobData?.title || "Job"} at ${jobData?.company || "Unknown Company"} has been added to your applications.`,
          duration: 4000,
        });
      }

      form.reset();
    } catch (error) {
      console.error("Error creating job application:", error);
      toast.error("Failed to add application", {
        description: "Please check the job link and try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 py-4">
            <FormField
              control={form.control}
              name="jobLink"
              render={({ field }) => (
                <FormItem className="w-full md:flex-1">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Paste the link of the job posting"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field, fieldState }) => (
                <FormItem className="w-full md:w-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full md:w-[280px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                            fieldState.error && "border-destructive",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
              className="w-full md:w-auto"
            >
              {isLoading ? "Processing..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
