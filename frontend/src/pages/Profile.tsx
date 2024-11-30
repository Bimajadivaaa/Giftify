"use client";
import Navbar from "../components/Navbar";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import sUSDeLogo from "../public/Images/usde.svg"; // Pastikan path dan nama file benar

const Profile: React.FC = () => {
  const donationHistory = [
    { address: "0x123...abc1", totalDonation: "5.00", yield: "5%" },
    { address: "0x456...def2", totalDonation: "10.00", yield: "5%" },
    { address: "0x789...ghi3", totalDonation: "7.50", yield: "5%" },
  ];

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
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-bold text-gray-300 mb-2">
            Total Donations
          </h2>

          <p className="text-2xl font-extrabold flex items-center space-x-2">
            <Image src={sUSDeLogo} alt="sUSDe" width={24} height={24} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              0 sUSDe
            </span>
          </p>
          <div className="text-center mt-12">
          <p className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 hover:from-blue-500 hover:to-teal-400 text-white font-medium transition-all shadow-lg hover:shadow-xl">
            Claim Your Donation
          </p>
          </div>
     
        </div>
        
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-bold text-gray-300 mb-2">Yield Earned</h2>
          <p className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-400">
            0%
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

      {/* Donation History */}
      <div className="max-w-6xl mx-auto bg-gray-800 bg-opacity-50 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-300 mb-6">
          Donation History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Total Donation</th>
                <th className="px-4 py-2">Yield</th>
              </tr>
            </thead>
            <tbody>
              {donationHistory.map((donation, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="px-4 py-2 text-blue-400">
                    {donation.address}
                  </td>
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <Image src={sUSDeLogo} alt="sUSDe" width={16} height={16} />
                    <span>{donation.totalDonation} sUSDe</span>
                  </td>
                  <td className="px-4 py-2">{donation.yield}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Profile;
