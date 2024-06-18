"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
const Header = () => {
  const { user, isLoading } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
  function isString(value: string | null | undefined): value is string {
    return typeof value === "string";
  }
console.log(user)

  return (
    <div>
      {" "}
      <header className="bg-[#00235B] p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <Link href={"/"} className="text-2xl font-bold" data-testid="code-figma-logo">
            WDAT syllabus
          </Link>
          <div className="flex items-center">
            {user && (
              <div className="relative">
                {user && (
                  <Image
                    src={isString(user?.picture) ? user?.picture : ""}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full cursor-pointer"
                    onClick={toggleDropdown}
                    width={40}
                    height={40}
                  />
                )}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 py-2 min-w-lg bg-white border border-gray-300 rounded shadow-lg z-50">
                    <div className="px-4 py-2">
                      <p className="font-semibold text-gray-500">{user.name}</p>
                      <p className="font-semibold text-black">{user.email}</p>
                      <hr />
                    </div>
                    <a
                      href="/api/auth/logout"
                      className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-blue-100"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            )}
           
          </div>
        </div>
      </header>
    </div>
  );
};
export default Header;