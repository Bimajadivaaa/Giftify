"use client";
import Navbar from "@/app/components/Navbar";
import React, { useState } from "react";

const ClaimYieldPage: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const handleClaim = () => {
    // Placeholder for claim logic
    console.log(`Claiming yield for wallet address: ${walletAddress}`);
  };

  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen px-8 py-12">
      <Navbar />
      <div className="max-w-4xl mx-auto text-center mb-12 mt-20">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-green-400 to-teal-400">
          Claim your Yield
        </h1>
        <p className="text-lg text-gray-400 mt-4">
          Claim your yield as a creator or gifter.
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-gray-800 bg-opacity-50 rounded-lg shadow-md p-8">
        {/* Wallet Address Input */}
        <div className="mb-6">
          <label
            htmlFor="walletAddress"
            className="block text-gray-300 mb-2 font-medium"
            
          >
            Wallet Address
          </label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0xebFACa8463E1c3495a09684137fEd7A4b4574179"
            disabled
            className="w-full bg-gray-900 text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Yield Info */}
        <div className="bg-gray-900 rounded-lg p-4 text-center mb-6">
          <h2 className="text-lg font-bold text-gray-300 mb-2">Your Yield</h2>
          <p className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
            0 sUSDe
          </p>
        </div>

        {/* Claim Button */}
        <div className="text-center">
          <button
            onClick={handleClaim}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 hover:from-blue-500 hover:to-teal-400 text-white font-medium transition-all shadow-lg hover:shadow-xl"
          >
            Claim Yield
          </button>
        </div>
      </div>
    </main>
  );
};

export default ClaimYieldPage;
