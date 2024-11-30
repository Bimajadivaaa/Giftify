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
  const { address } = useAccount();
  const [donatedAmount, setDonatedAmount] = useState<string>("0");
  const [donateUnclaimed, setDonateUnclaimed] = useState<string>("0");
  const [yieldEarned, setYieldEarned] = useState<string>("0");
  const [claimableShares, setcClaimableShares] = useState<string>("0");

  console.log("Address: ", address);

  const { data: gifterData, isLoading: isGifterDataLoading } = useReadContract({
    abi: GiftifyABI,
    address: "0x5b5e57e208074Bb5397F26067C147276bD5b82D5",
    functionName: "gifters",
    args: [address],
  });

  const { data: yieldData, isLoading: isYieldLoading } = useReadContract({
    abi: GiftifyABI,
    address: "0x5b5e57e208074Bb5397F26067C147276bD5b82D5",
    functionName: "getYield",
    args: [address],
  });

  const { data: creatorsData, isLoading: isCreatorsLoading } = useReadContract({
    abi: GiftifyABI,
    address: "0x5b5e57e208074Bb5397F26067C147276bD5b82D5",
    functionName: "creators",
    args: [address],
  });

  useEffect(() => {
    if (gifterData && Array.isArray(gifterData) && gifterData.length > 1) {
      const rawDonatedAmount = gifterData[1];
      console.log("Raw Donated Amount: ", rawDonatedAmount);
      const formattedAmount = ethers.formatEther(rawDonatedAmount.toString());
      setDonatedAmount(formattedAmount);
    }
  }, [gifterData]);

  useEffect(() => {
    if (yieldData) {
      const formattedYield = parseFloat(
        ethers.formatEther(yieldData.toString())
      ).toFixed(2);
      setYieldEarned(formattedYield);
    }
  }, [yieldData]);

  useEffect(() => {
    if (
      creatorsData &&
      Array.isArray(creatorsData) &&
      creatorsData.length > 1
    ) {
      try {
        const totalDonation = BigInt(creatorsData[0] || 0); // Mengambil totalDonation dari indeks 0
        const claimableShares = BigInt(creatorsData[1] || 0); // Mengambil claimableShares dari indeks 1
        const formatClaimableShares = parseFloat(
          ethers.formatEther(claimableShares.toString())
        ).toFixed(2);
        setcClaimableShares(formatClaimableShares.toString());
        console.log("claimableShares: ", claimableShares);
        const unclaimed = totalDonation; // Menghitung yang belum diklaim
        const formattedUnclaimed = parseFloat(
          ethers.formatEther(unclaimed.toString())
        ).toFixed(2);
        setDonateUnclaimed(formattedUnclaimed);
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

      <div className="max-w-4xl mx-auto text-center mb-12 mt-20">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-green-400 to-teal-400">
          Profile
        </h1>
        <p className="text-lg text-gray-400 mt-4">
          View your donation stats and history
        </p>
      </div>

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
            Total Creator Donation
          </h2>
          <p className="text-2xl font-extrabold flex items-center space-x-2">
            <Image src={sUSDeLogo} alt="sUSDe" width={24} height={24} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              {isCreatorsLoading ? "Loading..." : `${donateUnclaimed} USDe`}
            </span>
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="mt-3 text-md font-light bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              Claimable amount :{" "}
              <span className="flex items-center gap-2 ">
                {" "}
                <Image
                  src={sUSDeLogo}
                  alt="sUSDe"
                  width={24}
                  height={24}
                  className="mt-2"
                />
                <span className="space-x-2 mt-2">{claimableShares} <span className="font-bold">USDe</span></span>
              </span>
            </span>
          </div>
          <p className="cursor-pointer text-center mt-[3rem] px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 hover:from-blue-500 hover:to-teal-400 text-white font-medium transition-all shadow-lg hover:shadow-xl">
            Withdraw Donation
          </p>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-bold text-gray-300 mb-2">Yield Earned</h2>
          <div className="flex items-center justify-center space-x-2 mr-[8.4rem]">
            {/* Logo sUSDe */}
            <Image src={sUSDeLogo} alt="sUSDe" width={24} height={24} />
            {/* Yield Amount */}
            <p className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-400">
              {isYieldLoading ? "Loading..." : `${yieldEarned} USDe`}
            </p>
          </div>
          <div className="text-center mt-[7.7rem]">
            <Link href="/ClaimYield">
              <p className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 hover:from-blue-500 hover:to-teal-400 text-white font-medium transition-all shadow-lg hover:shadow-xl">
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