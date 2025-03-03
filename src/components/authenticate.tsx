"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Authenticate() {
  return (
    <div>
      <div className="flex flex-col gap-2 justify-center">
        <div className="flex justify-center mt-5">
          <SignInButton mode="modal">
            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded">
              Click here to sign in
            </button>
          </SignInButton>
        </div>
        <div className="mt-4 flex justify-center">
          <SignUpButton mode="modal">
            <button className="w-full md:w-auto border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2 px-6 rounded">
              Create an Account
            </button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
