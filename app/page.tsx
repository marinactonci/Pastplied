"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import Navbar from "@/components/Navbar";
import NotLoggedIn from "@/components/NotLoggedIn";
import JobApplicationForm from "@/components/JobApplicationForm";
import JobPostingsList from "@/components/JobPostingsList";

export default function Home() {
  // Mock data for demonstration - replace with actual state management
  const jobPostings = [
    {
      id: "1",
      jobName: "Software Engineer",
      firmName: "Tech Company",
      location: "Remote",
      appliedDate: "2025-05-01",
      originalLink: "https://example.com/job1"
    },
    {
      id: "2",
      jobName: "Product Manager",
      firmName: "Business Inc.",
      location: "New York, NY",
      appliedDate: "2025-05-02",
      originalLink: "https://example.com/job2"
    },
    {
      id: "3",
      jobName: "UX Designer",
      firmName: "Creative Agency",
      location: "San Francisco, CA",
      appliedDate: "2025-05-03",
      originalLink: "https://example.com/job3"
    }
  ];

  return (
    <>
      <Navbar />
      <main>
        <Authenticated>
          <div className="container mx-auto py-6">
            <JobApplicationForm />
            <JobPostingsList jobPostings={jobPostings} />
          </div>
        </Authenticated>
        <Unauthenticated>
          <NotLoggedIn />
        </Unauthenticated>
      </main>
    </>
  );
}
