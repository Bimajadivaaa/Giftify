import React from "react";
import Image from "next/image";
import donateImage from "../Public/Images/donate.png";
import Navbar from "../components/Navbar";
import Link from "next/link";

const GiftifyPage: React.FC = () => {

  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen pt-8">
      <Navbar />
      <div className="relative flex flex-col lg:flex-row justify-between items-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-8">
        <div className="lg:w-1/2 max-w-4xl text-left mb-10 lg:mb-0 lg:pl-20 ml-[60px]">
          <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-green-400 to-teal-400 mb-6">
            Giftify
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            A cutting-edge solution for YouTubers and content creators to
            withdraw donations once a month. The price difference of sUSDe
            between the time of donation and withdrawal will be shared with
            donors, with a small percentage taken as profit. This innovative
            approach transforms donations into a rewarding experience by
            offering cashback incentives.
          </p>
          <button className="mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white font-medium transition-all shadow-lg hover:shadow-2xl">
            <Link href="/Donate">Explore Donation</Link>
          </button>
        </div>

        {/* Right Section: Image */}
        <div className="lg:w-1/2 flex justify-center items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r rounded-full blur-xl opacity-30"></div>
            <Image
              src={donateImage}
              alt="Donate"
              width={400}
              height={400}
              className="relative z-10 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* <button
        className="ml-[200px] mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white font-medium transition-all shadow-lg hover:shadow-2xl"
        onClick={handleApproval}
      >
        {isApprovalPending ? "Approving..." : "Approve"}
        {isLoading ? " Loading..." : ""}
        {isError ? "Error" : ""}
      </button> */}

      {/* <button
        className="ml-[50px] mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white font-medium transition-all shadow-lg hover:shadow-2xl"
        onClick={handleDeposit}
      >
        {isDepositPending ? "Deposit..." : "Deposit"}
        {isError ? " Loading..." : ""}
        {isLoading ? "Error" : ""}
      </button> */}

      <footer className="bg-black text-gray-400 text-center p-10">
        <p>© 2024 Giftify. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default GiftifyPage;
