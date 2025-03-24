'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import errorImage1 from '@/assets/images/icon/error__1.png';

const ErrorMain = () => {
  return (
    <section>
      <div className="container py-100px">
        <div className="w-full lg:max-w-770px lg:mx-auto text-center">
          <Image
            src={errorImage1}
            alt="Error"
            width={550}
            height={550}
            className="mx-auto mb-40px"
            placeholder="blur"
          />
          <h3 className="text-size-35 md:text-size-40 lg:text-size-50 leading-10 md:leading-14.5 lg:leading-20 text-blackColor dark:text-blackColor-dark font-bold">
            Oops... It looks like you&apos;re lost!
          </h3>
          <p className="text-lg text-contentColor dark:text-contentColor-dark leading-22px">
            Oops! The page you are looking for does not exist. It might have been moved or deleted.
          </p>
          <div className="mt-50px text-center">
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorMain;
