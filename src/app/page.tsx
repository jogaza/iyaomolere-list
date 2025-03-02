import List from "@/components/List";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
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
        <List />
      </div>
    </main>
  );
}
