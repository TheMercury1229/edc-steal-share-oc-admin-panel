import PlayerTable from "@/components/PlayerTable";

const HomePage = () => {
  return (
    <main className="h-full w-full max-w-4xl mx-auto p-5 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-4">Update Points</h1>
      <div className="mb-6">
        <p className="text-lg mb-2">Enter the new points for each player:</p>
        <p className="text-sm text-gray-500">
          Admin ID: <span className="font-semibold">1234</span>
        </p>
      </div>

      <PlayerTable />
    </main>
  );
};

export default HomePage;
