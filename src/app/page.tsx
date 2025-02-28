import GroceryList from "@/components/GroceryList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Iyaomolere Family HouseHold List
        </h1>

        <div className="text-center text-gray-800">
          Please insert items needed for the next 2 weeks
        </div>
        <GroceryList />
      </div>
    </main>
  );
}
