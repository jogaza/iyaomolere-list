"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-slate-500 hover:bg-slate-400 text-sm normal-case",
            footerActionLink: "text-slate-500 hover:text-slate-400",
          },
        }}
        afterSignUpUrl="/"
        signInUrl="/sign-in"
      />
    </div>
  );
}
