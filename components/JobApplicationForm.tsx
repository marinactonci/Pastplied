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
import { jobApplicationFormSchema } from "@/schemas/schema";

export default function JobApplicationForm() {
  const createJob = useMutation(api.jobApplications.createJobApplication);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof jobApplicationFormSchema>>({
    resolver: zodResolver(jobApplicationFormSchema),
    defaultValues: {
      jobLink: "",
      date: undefined,
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof jobApplicationFormSchema>,
  ) => {
    setIsLoading(true);
    try {
      const jobData = await getJobListingData(values.jobLink);

      await createJob({
        url: values.jobLink,
        title: jobData?.title,
        company: jobData?.company,
        location: jobData?.location,
        appliedDate: values.date
          ? format(values.date, "yyyy-MM-dd")
          : undefined,
        status: "waiting",
      });

      form.reset();
    } catch (error) {
      console.error("Error creating job application:", error);
      alert("Failed to create job application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex items-center space-x-4 py-4">
            <FormField
              control={form.control}
              name="jobLink"
              render={({ field }) => (
                <FormItem className="flex-1">
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
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
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
            >
              {isLoading ? "Processing..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
