"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import { GiftifyABI } from "../utils/abi/Giftify";
import sUSDeLogo from "../public/Images/usde.svg";
import { ethers } from "ethers";

const Profile: React.FC = () => {
  const { address } = useAccount(); // Get the connected wallet address
  const [donatedAmount, setDonatedAmount] = useState<string>("0"); // State for donated amount
  const [donateUnclaimed, setDonateUnclaimed] = useState<string>("0"); // State for donate unclaimed
  const [yieldEarned, setYieldEarned] = useState<string>("0"); // State for yield earned

  console.log("Address: ", address);

  // Fetch donated amount
  const { data: gifterData, isLoading: isGifterDataLoading }: { data: [string, string] | undefined, isLoading: boolean } = useReadContract({
    abi: GiftifyABI,
    address: "0x5b5e57e208074Bb5397F26067C147276bD5b82D5", // Replace with your contract address
    functionName: "gifters",
    args: [address], // Pass the user's wallet address
  });

  // Fetch yield data
  const { data: yieldData, isLoading: isYieldLoading } = useReadContract({
    abi: GiftifyABI,
    address: "0x5b5e57e208074Bb5397F26067C147276bD5b82D5", // Replace with your contract address
    functionName: "getYield",
    args: [address], // Pass the user's wallet address
  });

  // Fetch creators data
  const { data: creatorsData, isLoading: isCreatorsLoading }: { data: [string] | undefined, isLoading: boolean } = useReadContract({
    abi: GiftifyABI,
    address: "0x5b5e57e208074Bb5397F26067C147276bD5b82D5", // Replace with your contract address
    functionName: "creators",
    args: [address], // Pass the user's wallet address
  });

  useEffect(() => {
    if (gifterData && (gifterData as any[]).length > 0) {
      const rawDonatedAmount = gifterData[1]; // Index 1 refers to `donatedAmount`
      console.log("Raw Donated Amount: ", rawDonatedAmount);
      const formattedAmount = ethers.formatEther(rawDonatedAmount.toString());
      setDonatedAmount(formattedAmount);
    }
  }, [gifterData]);

  useEffect(() => {
    if (yieldData) {
      const formattedYield = parseFloat(ethers.formatEther(yieldData.toString())).toFixed(2);
      setYieldEarned(formattedYield);
    }
  }, [yieldData]);

  useEffect(() => {
    if (creatorsData) {
      try {
        const totalDonation = BigInt(creatorsData[0]); // Mengambil totalDonation dari indeks 0
        const unclaimed = totalDonation ; // Menghitung yang belum diklaim
        const formattedUnclaimed = parseFloat(ethers.formatEther(unclaimed.toString())).toFixed(2); // Format menjadi 2 desimal
        setDonateUnclaimed(formattedUnclaimed); // Set nilai state
      } catch (error) {
        console.error("Error calculating donateUnclaimed:", error);
      }
    }
  }, [creatorsData]);

  console.log("Gifter Data: ", gifterData);
  console.log("Yield Data: ", yieldData);
  console.log("Creators Data: ", creatorsData);

  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen px-8 py-12">
      <Navbar />

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto text-center mb-12 mt-20">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-green-400 to-teal-400">
          Profile
        </h1>
        <p className="text-lg text-gray-400 mt-4">
          View your donation stats and history
        </p>
      </div>

      {/* Profile Information */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-bold text-gray-300 mb-2">
            Total Donated
          </h2>
          <p className="text-2xl font-extrabold flex items-center space-x-2">
            <Image src={sUSDeLogo} alt="sUSDe" width={24} height={24} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              {isGifterDataLoading ? "Loading..." : `${donatedAmount} USDe`}
            </span>
          </p>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-bold text-gray-300 mb-2">
            Donate Unclaimed
          </h2>
          <p className="text-2xl font-extrabold flex items-center space-x-2">
            <Image src={sUSDeLogo} alt="sUSDe" width={24} height={24} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              {isCreatorsLoading ? "Loading..." : `${donateUnclaimed} USDe`}
            </span>
          </p>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-bold text-gray-300 mb-2">Yield Earned</h2>
          <p className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-400">
            {isYieldLoading ? "Loading..." : `${yieldEarned} USDe`}
          </p>
          <div className="text-center mt-12">
            <Link href="/ClaimYield">
              <p className=" px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 hover:from-blue-500 hover:to-teal-400 text-white font-medium transition-all shadow-lg hover:shadow-xl">
                Claim Your Yield
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
