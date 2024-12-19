import Image from "next/image";
import React from "react";
import logoImage from "@/assets/images/logo/pnglogo.png";
import useIsSecondary from "@/hooks/useIsSecondary";

const CopyRight = () => {
  const { isSecondary } = useIsSecondary();
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-9 gap-5 lg:gap-30px pt-0 -mt-4 items-center">
        <div className="lg:col-start-1 lg:col-span-5 xs:mx-auto sm:mx-auto md:mx-auto">
          <a href="index.html">
            <Image
              src={logoImage}
              alt=""
              placeholder="blur"
              className="w-[400px] sm:w-[400px] md:w-[600px] lg:w-[600px]"
            />
          </a>
        </div>

        <div className="text-right lg:col-start-10 lg:col-span-3">
          <p className="text-blackColor">
            Copyright © <span className="text-primaryColor">2024 </span> by
            Banana Korean. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopyRight;
