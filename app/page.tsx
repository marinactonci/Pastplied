"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import NotLoggedIn from "@/components/NotLoggedIn";
import JobApplicationForm from "@/components/JobApplicationForm";
import JobApplicationList from "@/components/JobApplicationList";
import { JobApplicationProvider } from "@/contexts/JobApplicationContext";

export default function Home() {
  return (
    <>
      <main>
        <Authenticated>
          <JobApplicationProvider>
            <div className="container mx-auto py-6 px-4">
              <JobApplicationForm />
              <JobApplicationList />
            </div>
          </JobApplicationProvider>
        </Authenticated>
        <Unauthenticated>
          <NotLoggedIn />
        </Unauthenticated>
      </main>
    </>
  );
}
