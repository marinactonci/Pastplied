"use client";

import React, { createContext, useContext, useState, useRef } from "react";

interface JobApplicationContextType {
  newlyAddedJobs: Set<string>;
  addNewlyAddedJob: (jobId: string) => void;
  removeNewlyAddedJob: (jobId: string) => void;
  isJobNewlyAdded: (jobId: string) => boolean;
}

const JobApplicationContext = createContext<JobApplicationContextType | undefined>(undefined);

export function JobApplicationProvider({ children }: { children: React.ReactNode }) {
  const [newlyAddedJobs, setNewlyAddedJobs] = useState<Set<string>>(new Set());
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const addNewlyAddedJob = (jobId: string) => {
    setNewlyAddedJobs(prev => new Set(prev).add(jobId));

    // Clear any existing timeout for this job
    const existingTimeout = timeoutRefs.current.get(jobId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      timeoutRefs.current.delete(jobId);
    }
  };

  const removeNewlyAddedJob = (jobId: string) => {
    setNewlyAddedJobs(prev => {
      const newSet = new Set(prev);
      newSet.delete(jobId);
      return newSet;
    });

    const timeout = timeoutRefs.current.get(jobId);
    if (timeout) {
      clearTimeout(timeout);
      timeoutRefs.current.delete(jobId);
    }
  };

  const isJobNewlyAdded = (jobId: string) => {
    return newlyAddedJobs.has(jobId);
  };

  return (
    <JobApplicationContext.Provider
      value={{
        newlyAddedJobs,
        addNewlyAddedJob,
        removeNewlyAddedJob,
        isJobNewlyAdded,
      }}
    >
      {children}
    </JobApplicationContext.Provider>
  );
}

export function useJobApplicationContext() {
  const context = useContext(JobApplicationContext);
  if (context === undefined) {
    throw new Error("useJobApplicationContext must be used within a JobApplicationProvider");
  }
  return context;
}
