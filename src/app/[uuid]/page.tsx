import UrlDisplay from "@/components/url-display";
import { currentUser } from "@clerk/nextjs/server";
import { getUserFullName } from "../api/servercalls";
import Link from "next/link";
import List from "@/components/curated-list";
import Authenticate from "@/components/authenticate";

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
            Welcome back {user?.fullName}
          </h1>
        )}
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          {userFullName ? `${userFullName} List` : "Curated List"}
        </h1>
        {userFullName ? (
          <>
            <div className="text-center text-gray-800">Please insert items into the list</div>

            <List userId={uuid} />
            <h1 className="text-1xl font-bold text-center mb-2 text-gray-800">
              <UrlDisplay userId={uuid} />
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-2 text-red-500">Invalid List Link</h1>
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
              <Authenticate />
            )}
          </>
        )}
      </div>
    </main>
  );
}
