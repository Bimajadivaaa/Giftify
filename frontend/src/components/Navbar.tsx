import React from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar: React.FC = () => {
  return (
    <nav className=" text-white px-6 py-4 shadow-lg fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
          <Link href="/">Giftify</Link>
        </div>

        <div className="flex items-center space-x-8">
          <Link
            href="/Donate"
            className="text-sm font-semibold flex items-center space-x-2 hover:text-gray-300 transition-colors"
          >
            <span>Donation</span>
          </Link>
          <Link
            href="/ClaimYield"
            className="text-sm font-semibold flex items-center space-x-2 hover:text-gray-300 transition-colors"
          >
            <span>Claim Yield</span>
          </Link>
          <Link
            href="/Profile"
            className="text-sm font-semibold flex items-center space-x-2 hover:text-gray-300 transition-colors"
          >
            <span>Profile</span>
          </Link>

          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
