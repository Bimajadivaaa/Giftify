import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className=" text-white px-6 py-4 shadow-lg fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">

        <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
          <Link href="/">Giftify</Link>
        </div>


        <div className="flex items-center space-x-8">
          <Link
            href="/pages/Donation"
            className="text-sm font-semibold flex items-center space-x-2 hover:text-gray-300 transition-colors"
          >
            <span>Donation</span>
          </Link>
          <Link
            href="/pages/Profile"
            className="text-sm font-semibold flex items-center space-x-2 hover:text-gray-300 transition-colors"
          >
            <span>Profile</span>
          </Link>


          <button className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 text-sm font-semibold text-white hover:from-blue-500 hover:to-teal-400 transition-all shadow-md hover:shadow-lg">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
