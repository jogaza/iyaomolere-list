import List from "@/components/List";
import UrlDisplay from "@/components/UrlDisplay";
import { currentUser } from "@clerk/nextjs/server";
import { getUserFullName } from "../api/servercalls";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const user = await currentUser();
  const { uuid } = await params;
  const userFullName = await getUserFullName(uuid);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {user && (
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
            Hello {user?.fullName}
          </h1>
        )}
        {userFullName ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
              {userFullName} List
            </h1>
            <List userId={uuid} />
            <div className="text-center text-gray-800">Please insert items into the list</div>
            <h1 className="text-1xl font-bold text-center mb-2 text-gray-800">
              <UrlDisplay userId={uuid} />
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Invalid List Link</h1>
            <div className="text-center text-gray-800">
              Check the link you received or contact the list owner
            </div>
            {user ? (
              <div className="text-center text-gray-800">
                We know you are a user.{" "}
                <Link className=" text-blue-800" href="/">
                  click here to go back to your own list
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 justify-center">
                {/* <div className="flex justify-center items-center">
                  <div className="bg-white p-4 rounded-lg shadow-md">Click here to sign in</div>
                </div> */}
                <div className="flex justify-center items-center">
                  <Link className=" text-blue-800" href="/sign-in">
                    Click here to Sign in
                  </Link>
                </div>
                <div className="flex justify-center items-center">
                  <Link className=" text-blue-800" href="/sign-up">
                    Click here to sign up
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
