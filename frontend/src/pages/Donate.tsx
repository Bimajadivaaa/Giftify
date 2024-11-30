'use client';

import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GiftifyABI } from "../utils/abi/Giftify";
import { USDE } from "../utils/abi/USDE";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const creators = [
  {
    name: "Alex",
    yield: "5%",
    walletAddress: "0xFFA3EceD063276266924700C726f4BD94A18c0E8",
  },
  {
    name: "John Doe",
    yield: "5%",
    walletAddress: "0xeC79671059c31901DB1E2411E57AdedaBC1F7806",
  },
  {
    name: "Michael",
    yield: "5%",
    walletAddress: "0x568eccd69EE795b83395Aa3825879439B21bd955",
  },
  {
    name: "Mr. Beast",
    yield: "5%",
    walletAddress: "0xB7A19852cdb7B5dDF83348DEBE8B398fd48F5032",
  },
];

const Donation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<{
    name: string;
    yield: string;
    walletAddress: string;
  } | null>(null);
  const [donationAmount, setDonationAmount] = useState<number | string>("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Approve Contract Interaction
  const {
    data: approvalHash,
    isPending: isApprovalPending,
    writeContract: approveUSDE,
  } = useWriteContract();

  const { isSuccess: isApprovalSuccess, isError: isApprovalError } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
    });

  const handleApproval = async () => {
    try {
      if (!donationAmount || Number(donationAmount) <= 0) {
        toast.error("Invalid approval amount!");
        return;
      }

      const weiAmount = ethers.parseEther(donationAmount.toString());
      await approveUSDE({
        abi: USDE,
        address: "0x7D6AF0F5F5A00685dB264ee5506eDEbf1CcaeBac", // USDE contract
        functionName: "approve",
        args: ["0x5b5e57e208074Bb5397F26067C147276bD5b82D5", weiAmount],
      });
    } catch (error) {
      toast.error("Approval failed!");
      console.error("Approval Error:", error);
    }
  };

  // Donate Contract Interaction
  const {
    data: donateHash,
    isPending: isDonationPending,
    writeContract: donate,
  } = useWriteContract();

  const { isSuccess: isDonationSuccess, isError: isDonationError } =
    useWaitForTransactionReceipt({
      hash: donateHash,
    });

  useEffect(() => {
    if (isDonationSuccess) {
      toast.success("Donation succeeded!");
    }

    if (isDonationError) {
      toast.error("Donation failed!");
    }
  }, [isDonationSuccess, isDonationError]);

  const handleDonate = async () => {
    try {
      if (!donationAmount || Number(donationAmount) <= 0) {
        toast.error("Invalid donation amount!");
        return;
      }

      if (!selectedCreator) {
        toast.error("No creator selected!");
        return;
      }

      const weiAmount = ethers.parseEther(donationAmount.toString());
      await donate({
        abi: GiftifyABI,
        address: "0x5b5e57e208074Bb5397F26067C147276bD5b82D5", // Giftify contract
        functionName: "donate",
        args: [weiAmount, selectedCreator.walletAddress],
      });
    } catch (error) {
      toast.error("Donation failed!");
      console.error("Donation Error:", error);
    }
  };

  const filteredCreators = creators.filter((creator) =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen p-8">
      <ToastContainer position="top-right" autoClose={5000} />
      <Navbar />
      <div className="max-w-4xl mx-auto mt-20">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Find your Content Creator
        </h1>

        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search creators..."
            className="w-full max-w-lg bg-gray-900 text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCreators.map((creator, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-lg transition-shadow border border-transparent hover:border-blue-500 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-2">{creator.name}</h2>
              <p className="text-gray-400 text-sm mb-4">
                Wallet:{" "}
                <span className="text-blue-400">{formatAddress(creator.walletAddress)}</span>
              </p>
              <p className="text-gray-300 mb-6">
                Yield: {creator.yield} / Donation
              </p>
              <button
                className="border border-gray-400 text-white py-2 px-4 rounded-lg transition-colors hover:border-blue-500 hover:text-blue-500"
                onClick={() => {
                  setSelectedCreator(creator);
                  setIsPopupOpen(true);
                }}
              >
                Donate
              </button>
            </div>
          ))}
        </div>

        {filteredCreators.length === 0 && (
          <p className="text-center text-gray-400 mt-6">
            No creators found. Try searching for a different name.
          </p>
        )}
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            {selectedCreator && (
              <h2 className="text-md font-bold mb-4">
                Donate to {selectedCreator.name}
                <h2>Address : {formatAddress(selectedCreator.walletAddress)}</h2>
              </h2>
            )}
            <input
              type="number"
              placeholder="Enter donation amount"
              className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg mb-4"
              value={donationAmount}
              onChange={(e) => setDonationAmount(Number(e.target.value))}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white font-medium transition-all"
                onClick={handleApproval}
                disabled={isApprovalPending}
              >
                {isApprovalPending ? "Approving..." : "Approve"}
              </button>
              <button
                className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white font-medium transition-all"
                onClick={handleDonate}
                disabled={isDonationPending}
              >
                {isDonationPending ? "Donating..." : "Donate"}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Donation;