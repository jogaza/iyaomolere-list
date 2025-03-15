"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Authenticate() {
  return (
    <div>
      <div className="flex flex-col gap-2 justify-center">
        <div className="flex justify-center mt-5">
          <SignInButton mode="modal">
            <Button className="w-full md:w-auto">Click here to sign in</Button>
          </SignInButton>
        </div>
        <div className="mt-4 flex justify-center">
          <SignUpButton mode="modal">
            <Button variant="outline" className="w-full md:w-auto">
              Create an Account
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
