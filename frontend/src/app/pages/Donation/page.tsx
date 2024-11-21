'use client';
import Navbar from "@/app/components/Navbar";
import React, { useState } from "react";

const creators = [
  { name: "Sadbor", yield: "5%", walletAddress: "0x123...abc1" },
  { name: "Windah Basudara", yield: "5%", walletAddress: "0x456...def2" },
  { name: "Jonathan Liandi", yield: "5%", walletAddress: "0x789...ghi3" },
  { name: "Lionel Messi", yield: "5%", walletAddress: "0xabc...jkl4" },
];

const Donation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter creators based on search term
  const filteredCreators = creators.filter((creator) =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="bg-black text-white min-h-screen p-8">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-20">
        <h1 className="text-4xl font-bold mb-8 text-center">Find your Content Creator</h1>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search creators..."
            className="w-full max-w-lg bg-gray-900 text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Creator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCreators.map((creator, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-lg transition-shadow border border-transparent hover:border-blue-500 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-2">{creator.name}</h2>
              <p className="text-gray-400 text-sm mb-4">
                Wallet: <span className="text-blue-400">{creator.walletAddress}</span>
              </p>
              <p className="text-gray-300 mb-6">Yield: {creator.yield} / Donation</p>
              <button className="border border-gray-400 text-white py-2 px-4 rounded-lg transition-colors hover:border-blue-500 hover:text-blue-500">
                Donate
              </button>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredCreators.length === 0 && (
          <p className="text-center text-gray-400 mt-6">
            No creators found. Try searching for a different name.
          </p>
        )}
      </div>
    </main>
  );
};

export default Donation;
