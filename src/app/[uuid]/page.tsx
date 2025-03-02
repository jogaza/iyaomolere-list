import List from "@/components/List";
import UrlDisplay from "@/components/UrlDisplay";
import { currentUser } from "@clerk/nextjs/server";

interface PageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const user = await currentUser();
  const { uuid } = await params;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {user && (
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
            Hello {user?.fullName}
          </h1>
        )}
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">{user?.fullName} List</h1>
        <div className="text-center text-gray-800">Please insert items into the list</div>

        <List userId={uuid} />
        <h1 className="text-1xl font-bold text-center mb-2 text-gray-800">
          <UrlDisplay userId={uuid} />
        </h1>
      </div>
    </main>
  );
}
