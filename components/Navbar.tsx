import { UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import { SignUpButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Briefcase } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky h-14 top-0 z-10 border-b shadow-sm grid place-items-center">
      <div className="container mx-auto px-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">ApplyNote</h1>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Authenticated>
            <UserButton />
          </Authenticated>
          <Unauthenticated>
            <div className="flex items-center gap-4">
              <SignInButton>
                <Button variant="outline">Sign in</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign up</Button>
              </SignUpButton>
            </div>
          </Unauthenticated>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
