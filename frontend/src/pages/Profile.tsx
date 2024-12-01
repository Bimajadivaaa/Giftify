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
  const [claimableSharesFormatted, setClaimableSharesFormatted] =
    useState<string>("0");
  const [claimableSharesRaw, setClaimableSharesRaw] = useState<bigint>(
    BigInt(0)
  );
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [totalShares, settotalShares] = useState<string>("0");

  const { data: gifterData, isLoading: isGifterDataLoading } = useReadContract({
    abi: GiftifyABI,
    address: "0x50458e85B625CF27E3E96D71AeEF8808262bDc9d",
    functionName: "gifters",
    args: [address],
  });

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

  console.log("Creators Data:", creatorsData);
  console.log("Gifter Data:", gifterData);
  console.log("Yield Data:", yieldData);

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
      const formattedAmount = ethers.formatEther(rawDonatedAmount.toString());
      setDonatedAmount(formattedAmount);

      const totalShares = gifterData[2];
      const formattedTotalShares = ethers.formatEther(totalShares.toString());
      const formatTotalShares = formattedTotalShares.slice(
        0,
        formattedTotalShares.indexOf(".") + 3
      );
      settotalShares(formatTotalShares);
    }
  }, [gifterData]);

  useEffect(() => {
    console.log("Yield Data:", yieldData);
    if (yieldData) {
      const formattedYield = parseFloat(ethers.formatEther(yieldData.toString())).toFixed(2);
      console.log("Yield Earned Formatted:", formattedYield);
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
        const totalDonation = BigInt(creatorsData[0] || 0);
        const claimableAmount = BigInt(creatorsData[1] || 0);

        // Store raw value for contract calls
        setClaimableSharesRaw(claimableAmount);

        // Store formatted value for display with slicing
        const formattedClaimableShares = ethers.formatEther(claimableAmount);
        setClaimableSharesFormatted(
          formattedClaimableShares.slice(
            0,
            formattedClaimableShares.indexOf(".") + 3
          )
        );
        console.log("Claimable Shares Formatted:", claimableSharesFormatted);

        const formattedUnclaimed = parseFloat(
          ethers.formatEther(totalDonation.toString())
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

  const handleWithdrawCreator = async () => {
    if (!address || isWithdrawing || claimableSharesRaw <= BigInt(0)) return;

    try {
      setIsWithdrawing(true);
      console.log("Initiating withdrawal...");
      console.log("Claimable Shares Raw:", claimableSharesRaw);

      await withdraw({
        abi: GiftifyABI,
        address: "0x50458e85B625CF27E3E96D71AeEF8808262bDc9d",
        functionName: "initiateWithdraw",
        args: [claimableSharesRaw], // Use the raw value for the smart contract call
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
            Total Gifter Donated
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
                <Image src={sUSDeLogo} alt="sUSDe" width={24} height={24} />
                <span className="space-x-2 mt-2">
                  {claimableSharesFormatted}{" "}
                  <span className="font-bold">USDe</span>
                </span>
              </span>
            </span>
          </div>
          <div className="mt-[3rem] flex items-center space-x-5 justify-center">
            <button
              onClick={handleWithdrawCreator}
              className={`cursor-pointer text-center px-2 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 
              ${
                isWithdrawing || claimableSharesRaw <= BigInt(0)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-blue-500 hover:to-teal-400"
              } 
              text-white font-medium transition-all shadow-lg hover:shadow-xl w-full`}
            >
              {isWithdrawing
                ? "Withdrawing..."
                : claimableSharesRaw <= BigInt(0)
                ? "No Claimable Amount"
                : "Withdraw Donation"}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-md ">
          <h2 className="text-lg font-bold text-gray-300 mb-2">Yield Earned</h2>
          <div className="flex items-center justify-center space-x-2 mr-[12rem]">
            <Image src={sUSDeLogo} alt="sUSDe" width={24} height={24} />
            <p className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-400">
              {isYieldLoading ? "Loading..." : `${yieldEarned} sUSDe`}
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
