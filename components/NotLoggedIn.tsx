import React from "react";
import { SignUpButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

function NotLoggedIn() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)]">
      <h1 className="text-4xl font-bold mb-4">You are not logged in</h1>
      <p className="text-lg mb-6">Please log in to access the application.</p>
      <div className="flex gap-4">
        <SignInButton>
          <Button variant="outline">Sign in</Button>
        </SignInButton>
        <SignUpButton>
          <Button>Sign up</Button>
        </SignUpButton>
      </div>
    </div>
  );
}

export default NotLoggedIn;
