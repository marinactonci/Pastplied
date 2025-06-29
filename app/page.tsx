"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import NotLoggedIn from "@/components/NotLoggedIn";
import JobApplicationForm from "@/components/JobApplicationForm";
import JobApplicationList from "@/components/JobApplicationList";

export default function Home() {
  return (
    <>
      <main>
        <Authenticated>
          <div className="container mx-auto py-6 px-4">
            <JobApplicationForm />
            <JobApplicationList />
          </div>
        </Authenticated>
        <Unauthenticated>
          <NotLoggedIn />
        </Unauthenticated>
      </main>
    </>
  );
}
