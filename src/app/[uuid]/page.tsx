import UrlDisplay from "@/components/url-display";
import { currentUser } from "@clerk/nextjs/server";
import { getUserFullName } from "../api/servercalls";
import Link from "next/link";
import List from "@/components/curated-list";
import Authenticate from "@/components/authenticate";
import Accordion from "@/components/accordion";

interface PageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const user = await currentUser();
  const { uuid } = await params;
  const userFullName = await getUserFullName(uuid);

  console.log("userFullName", userFullName);

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {user && (
          <h1 className="text-2xl font-bold text-center mb-2 text-foreground">
            Welcome back {user?.fullName}
          </h1>
        )}
        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">
          {userFullName ? `${userFullName} List` : "Curated List"}
        </h1>
        {userFullName ? (
          <>
            <div className="text-center text-muted-foreground mb-2">
              Please insert items into the list
            </div>
            <List userId={uuid} />
            <h1 className="text-1xl font-bold text-center mb-2 mt-6 text-foreground">
              <UrlDisplay userId={uuid} />
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-2 text-destructive">
              Invalid List Link
            </h1>
            <div className="text-center text-muted-foreground">
              Check the link you received or contact the list owner
            </div>
            {user ? (
              <div className="text-center text-muted-foreground">
                We know you are a user.{" "}
                <Link
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50"
                  href="/"
                >
                  Go back to your list
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <Accordion title="Create your own list?" defaultOpen={false}>
                  <div className="text-center text-muted-foreground py-4">
                    You can click on one of the buttons below to have your own unique list
                  </div>
                  <Authenticate />
                </Accordion>
              </div>
            )}
          </>
        )}
        {user && user.id !== uuid && (
          <>
            <div className="text-center text-muted-foreground">We know this is not your list.</div>
            <div className="text-center text-muted-foreground mt-2">
              <Link
                className="inline-block px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50"
                href="/"
              >
                Go back to your list
              </Link>
            </div>
          </>
        )}

        {/* {!user && (
          <>
            <Accordion title="Create your own list?" defaultOpen={false}>
              <div className="text-center text-muted-foreground py-4">
                You can click on one of the buttons below to have your own unique list
              </div>
              <Authenticate />
            </Accordion>
          </>
        )} */}
      </div>
    </main>
  );
}
