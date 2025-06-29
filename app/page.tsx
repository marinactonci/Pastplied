"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import Navbar from "@/components/Navbar";
import NotLoggedIn from "@/components/NotLoggedIn";
import JobApplicationForm from "@/components/JobApplicationForm";
import { api } from "@/convex/_generated/api";
import JobApplicationList from "@/components/JobApplicationList";

export default function Home() {
  const jobApplications = useQuery(
    api.jobApplications.getJobApplicationsForUser,
  );

  return (
    <>
      <Navbar />
      <main>
        <Authenticated>
          <div className="container mx-auto py-6 px-4">
            <JobApplicationForm />
            <JobApplicationList jobApplications={jobApplications || []} />
          </div>
        </Authenticated>
        <Unauthenticated>
          <NotLoggedIn />
        </Unauthenticated>
      </main>
    </>
  );
}
