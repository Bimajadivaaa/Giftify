"use client";
import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import sUSDeLogo from "../public/Images/usde.svg";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { contracts } from "../constants/contracts";
import axios from "axios";
import { formatEther } from "viem";
import { parseEther } from "ethers";

const ClaimYieldPage: React.FC = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [walletAddress, setWalletAddress] = useState("");
  const [claimable, setClaimable] = useState<boolean>(false);
  const [claimAmount, setClaimAmount] = useState<string>("0.00");
  const [activeYield, setActiveYield] = useState<string>("0.00");
  const [proof, setProof] = useState<string[]>([]);

  let currentBatch = useReadContract({
    address: contracts.GIFTIFY.contract as `0x${string}`,
    abi: contracts.GIFTIFY.abi,
    functionName: "currentBatch",
  });

  let claimed = useReadContract({
    address: contracts.GIFTIFY.contract as `0x${string}`,
    abi: contracts.GIFTIFY.abi,
    functionName: "claimed",
    args: [currentBatch.data, address ?? `0x0`],
  });

  let userYield = useReadContract({
    address: contracts.GIFTIFY.contract as `0x${string}`,
    abi: contracts.GIFTIFY.abi,
    functionName: "getYield",
    args: [address ?? `0x0`],
  });

  const handleClaim = () => {
    console.log(`Claiming yield for wallet address: ${walletAddress}`);

    writeContractAsync({
      address: contracts.GIFTIFY.contract as `0x${string}`,
      abi: contracts.GIFTIFY.abi,
      functionName: "claim",
      args: [parseEther(claimAmount), proof],
    })
      .then((tx) => {
        console.log(tx);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!address) return;
    setWalletAddress(address);

    axios
      .get(`https://api.giftify.alwaysbedream.dev/users/claim/${address}`)
      .then((res) => {
        const data: { address: string; amount: number; proof: string[] } =
          res.data.data;
        if (data?.amount > 0 && data?.proof) {
          setClaimable(!claimed.data);
          setClaimAmount(parseFloat(formatEther(BigInt(data.amount))).toFixed(2));
          setProof(data.proof);
        }
      })
      .catch((err) => console.error(err));

    if (userYield.data) {
      setActiveYield(parseFloat(formatEther(userYield.data as bigint)).toFixed(2));
    }
  }, [address, claimed.data, userYield.data]);

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
        <div className="bg-gray-900 rounded-lg p-4 text-center mb-6 flex justify-between items-center">
          <div className="mx-2">
            <h2 className="text-lg font-bold text-gray-300 mb-2">
              Active Yield
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <Image src={sUSDeLogo} alt="sUSDe" width={24} height={24} />
              <p className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
                {activeYield} USDe
              </p>
            </div>
          </div>
          <div className="mx-2">
            <h2 className="text-lg font-bold text-gray-300 mb-2">
              Claimable Yield
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <Image src={sUSDeLogo} alt="sUSDe" width={24} height={24} />
              <p className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
                {claimAmount} USDe
              </p>
            </div>
          </div>
        </div>

        {/* Claim Button */}
        <div className="text-center">
          <button
            onClick={handleClaim}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 hover:from-blue-500 hover:to-teal-400 text-white font-medium transition-all shadow-lg hover:shadow-xl"
            disabled={!claimable}
          >
            {claimable ? "Claim Yield" : "No Claimable Yield"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ClaimYieldPage;
