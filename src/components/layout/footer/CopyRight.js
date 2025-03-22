import Image from 'next/image';
import React from 'react';
import logoImage from '@/assets/images/logo/pnglogo.png';
import useIsSecondary from '@/hooks/useIsSecondary';

const CopyRight = () => {
  const { isSecondary } = useIsSecondary();
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-9 gap-5 lg:gap-30px pt-0 -mt-4 items-center">
        <div className="text-right lg:col-start-10 lg:col-span-3 mr-10">
          <p className="text-blackColor">
            Copyright © <span className="text-primaryColor">2025 </span> by Banana Korean. All
            Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopyRight;
