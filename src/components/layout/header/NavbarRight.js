"use client";
import React, { useState } from "react";
import Link from "next/link";
import MobileMenuOpen from "@/components/shared/buttons/MobileMenuOpen";
import useIsTrue from "@/hooks/useIsTrue";
import MessageDropdown from "./MessageDropdown";

const NavbarRight = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");
  const isHome2Dark = useIsTrue("/home-2-dark");

  return (
    <div className="lg:col-start-10 lg:col-span-3">
      <ul className="relative nav-list flex justify-end items-center gap-3">
        {isHome4 || isHome4Dark || isHome5 || isHome5Dark ? (
          ""
        ) : (
          <>
            <li className="hidden lg:block mr-4 relative">
              <div className="flex items-center relative">
                {showSearch ? (
                  <form className="absolute right-0 top-1/2 -translate-y-1/2 w-60 flex justify-between items-center bg-whitegrey2 rounded-xl dark:bg-whitegrey2-dark px-15px py-[11px] z-50">
                    <input
                      type="text"
                      placeholder="Search"
                      className="bg-transparent w-4/5 focus:outline-none text-sm text-darkdeep1 dark:text-blackColor-dark"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="block text-lg text-darkdeep1 hover:text-secondaryColor dark:text-blackColor-dark dark:hover:text-secondaryColor"
                      >
                        <i className="icofont icofont-search-2"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSearch(false)}
                        className="block text-lg text-darkdeep1 hover:text-secondaryColor dark:text-blackColor-dark dark:hover:text-secondaryColor"
                      >
                        <i className="icofont icofont-close-line"></i>
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    className="text-lg text-mainText hover:text-primary transition-colors"
                    aria-label="Search"
                    onClick={() => setShowSearch(!showSearch)}
                  >
                    <i className="icofont icofont-search-2"></i>
                  </button>
                )}
              </div>
            </li>
            {/* Message Button */}
            <li className="hidden lg:block">
              <button
                className="text-lg text-mainText hover:text-primary transition-colors"
                onClick={() => setShowMessages(!showMessages)}
              >
                <i className="icofont icofont-ui-message"></i>
              </button>
              {/* 기존 MessageDropdown 제거 */}
            </li>
            {/* Notification Button */}
            <li className="hidden lg:block ml-2 mr-2">
              {" "}
              {/* Added 'ml-4' to increase spacing */}
              <button className="text-lg text-mainText hover:text-primary transition-colors">
                <i className="icofont icofont-notification"></i>
              </button>
            </li>
            <li className="hidden lg:block">
              <Link
                href="/login"
                className="whitespace-nowrap text-size-12 2xl:text-size-15 text-primaryColor bg-transparent border border-primaryColor block px-15px py-2 rounded-xl hover:bg-primaryColor hover:text-whiteColor transition-colors -mt-2"
              >
                Log in
              </Link>
            </li>
            <li className="hidden lg:block relative">
              <Link
                href="/signup"
                className="whitespace-nowrap text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor border border-primaryColor block px-15px py-2 rounded-xl hover:bg-transparent hover:text-primaryColor transition-colors -mt-2"
              >
                Sign up
              </Link>
              {showMessages && (
                <div className="absolute right-0 top-full mt-5 z-50">
                  <MessageDropdown onClose={() => setShowMessages(false)} />
                </div>
              )}
            </li>
          </>
        )}
        <li className="block lg:hidden">
          <MobileMenuOpen />
        </li>
      </ul>
    </div>
  );
};

export default NavbarRight;
