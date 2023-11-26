"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Navbar = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">ExploreMe</p>
      </Link>

      {/* Desktop navigation */}
      <div className="sm:flex hidden">
        <div className="flex gap-3 md:gap-5">
          <Link href="/" className="black_btn">
            Home
          </Link>
          <Link href="/favorites" className="black_btn">
            Favorites
          </Link>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden flex relative">
        <div className="flex">
          <Image
            src={
              toggleDropdown
                ? "/assets/images/close.svg"
                : "/assets/images/menu.svg"
            }
            width={40}
            height={40}
            className="rounded-full"
            alt="menu-btn"
            onClick={() => setToggleDropdown((prev) => !prev)}
          />

          {toggleDropdown && (
            <div className="dropdown glassmorphism">
              <Link
                href="/"
                className="dropdown_link"
                onClick={() => setToggleDropdown(false)}
              >
                Home
              </Link>
              <Link
                href="/favorites"
                className="dropdown_link"
                onClick={() => setToggleDropdown(false)}
              >
                Favorites
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
