"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { GiftifyABI } from "../utils/abi/Giftify";
import sUSDeLogo from "../public/Images/usde.svg";
import { ethers } from "ethers";

const Profile: React.FC = () => {
  const { address } = useAccount();
  const [donatedAmount, setDonatedAmount] = useState<string>("0");
  const [donateUnclaimed, setDonateUnclaimed] = useState<string>("0");
  const [yieldEarned, setYieldEarned] = useState<string>("0");
  const [claimableShares, setClaimableShares] = useState<string>("0");
  const [isWithdrawing, setIsWithdrawing] = useState(false);


  const { data: gifterData, isLoading: isGifterDataLoading } = useReadContract({
    abi: GiftifyABI,
    address: "0x50458e85B625CF27E3E96D71AeEF8808262bDc9d",
    functionName: "gifters",
    args: [address],
  });

  console.log("Gifter Data:", gifterData);
  const { data: yieldData, isLoading: isYieldLoading } = useReadContract({
    abi: GiftifyABI,
    address: "0x50458e85B625CF27E3E96D71AeEF8808262bDc9d",
    functionName: "getYield",
    args: [address],
  });

  const { data: creatorsData, isLoading: isCreatorsLoading } = useReadContract({
    abi: GiftifyABI,
    address: "0x50458e85B625CF27E3E96D71AeEF8808262bDc9d",
    functionName: "creators",
    args: [address],
  });

  const {
    data: withdrawHash,
    isPending,
    writeContract: withdraw,
    error: withdrawError,
  } = useWriteContract();

  const { isSuccess: isWithdrawSuccess, isError: isWithdrawError } =
    useWaitForTransactionReceipt({
      hash: withdrawHash,
    });

  useEffect(() => {
    if (gifterData && Array.isArray(gifterData) && gifterData.length > 1) {
      const rawDonatedAmount = gifterData[1];
      console.log("Donated Amount:", rawDonatedAmount.toString());
      const formattedAmount = ethers.formatEther(rawDonatedAmount.toString());
      setDonatedAmount(formattedAmount);
    }
  }, [gifterData]);

  useEffect(() => {
    if (yieldData) {
      const formattedYield = parseFloat(
        ethers.formatEther(yieldData.toString())
      ).toFixed(2);
      console.log("Yield Earned:", formattedYield);
      setYieldEarned(formattedYield);
    }
  }, [yieldData]);

  useEffect(() => {
    if (creatorsData && Array.isArray(creatorsData) && creatorsData.length > 1) {
      try {
        const totalDonation = BigInt(creatorsData[0] || 0);
        const claimableAmount = BigInt(creatorsData[1] || 0);
        const formatClaimableShares = parseFloat(
          ethers.formatEther(claimableAmount.toString())
        ).toFixed(2);
        setClaimableShares(formatClaimableShares);
        
        const unclaimed = totalDonation;
        console.log("Unclaimed Donation:", unclaimed.toString());
        const formattedUnclaimed = parseFloat(
          ethers.formatEther(unclaimed.toString())
        ).toFixed(2);
        setDonateUnclaimed(formattedUnclaimed);
      } catch (error) {
        console.error("Error calculating donateUnclaimed:", error);
      }
    }
  }, [creatorsData]);

  useEffect(() => {
    if (isWithdrawSuccess) {
      setIsWithdrawing(false);
      console.log("Withdrawal successful!");
    }
    if (isWithdrawError || withdrawError) {
      setIsWithdrawing(false);
      console.error("Withdrawal failed:", withdrawError);
    }
  }, [isWithdrawSuccess, isWithdrawError, withdrawError]);

  const handleWithdraw = async () => {
    if (!address || isWithdrawing || parseFloat(claimableShares) <= 0) return;

    try {
      setIsWithdrawing(true);
      const claimableSharesInWei = ethers.parseEther(claimableShares);
      console.log("Claimable Shares in Wei:", claimableSharesInWei.toString());
      
      await withdraw({
        abi: GiftifyABI,
        address: "0x50458e85B625CF27E3E96D71AeEF8808262bDc9d",
        functionName: "initiateWithdraw",
        args: [claimableSharesInWei],
      });
    } catch (error) {
      console.error("Withdrawal Error:", error);
      setIsWithdrawing(false);
    }
  };

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
                <span className="space-x-2 mt-2">
                  {claimableShares} <span className="font-bold">USDe</span>
                </span>
              </span>
            </span>
          </div>
          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing || parseFloat(claimableShares) <= 0}
            className={`cursor-pointer text-center mt-[3rem] px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 
              ${
                isWithdrawing || parseFloat(claimableShares) <= 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-blue-500 hover:to-teal-400'
              } 
              text-white font-medium transition-all shadow-lg hover:shadow-xl w-full`}
          >
            {isWithdrawing 
              ? "Withdrawing..." 
              : parseFloat(claimableShares) <= 0 
                ? "No Claimable Amount" 
                : "Withdraw Donation"
            }
          </button>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-bold text-gray-300 mb-2">Yield Earned</h2>
          <div className="flex items-center justify-center space-x-2 mr-[12rem]">
            <Image src={sUSDeLogo} alt="sUSDe" width={24} height={24} />
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