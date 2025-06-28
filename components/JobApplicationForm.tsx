"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function JobApplicationForm() {
  const [jobLink, setJobLink] = useState("");
  const [date, setDate] = useState<Date>();

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Job Link:", jobLink);
    console.log("Date:", date);
  };

  return (
    <div className="flex items-center space-x-4 p-4">
      <Input
        type="text"
        placeholder="Paste the link of the job posting"
        value={jobLink}
        onChange={(e) => setJobLink(e.target.value)}
        className="flex-1"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
