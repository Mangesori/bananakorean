"use client";
import Link from "next/link";
import React from "react";

const ButtonPrimary = ({
  children,
  color,
  type,
  path,
  arrow,
  width,
  size, // Added 'size' prop
  onClick,
}) => {
  let sizeClasses = "";
  if (size === "large") {
    sizeClasses = "text-size-18 px-35px py-15px";
  } else {
    sizeClasses = "text-size-15 px-25px py-10px"; // default size
  }

  return type === "button" || type === "submit" ? (
    <button
      {...{ type: type === "submit" ? "submit" : "" }}
      onClick={onClick ? onClick : () => {}}
      className={`text-whiteColor rounded-xl border hover:bg-whiteColor inline-block dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor ${sizeClasses} ${
        width === "full" ? "w-full" : ""
      } ${
        color === "secondary"
          ? "bg-secondaryColor border-secondaryColor hover:text-secondaryColor"
          : "bg-primaryColor border-primaryColor hover:text-primaryColor"
      }`}
    >
      {children} {arrow && <i className="icofont-long-arrow-right"></i>}
    </button>
  ) : (
    <Link
      className={`text-whiteColor rounded-xl border hover:bg-whiteColor inline-block dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor ${sizeClasses} ${
        color === "secondary"
          ? "bg-secondaryColor border-secondaryColor hover:text-secondaryColor"
          : "bg-primaryColor border-primaryColor hover:text-primaryColor"
      }`}
      href={path}
    >
      {children} {arrow && <i className="icofont-long-arrow-right"></i>}
    </Link>
  );
};

export default ButtonPrimary;
