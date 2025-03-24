'use client';

import React from 'react';
import Link from 'next/link';

const HeroPrimary = ({ title, path }) => {
  return (
    <section data-aos="fade-up">
      <div className="bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible py-50px md:py-20 lg:py-100px 2xl:pb-150px 2xl:pt-40.5">
        <div className="container">
          <div className="text-center">
            <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold text-blackColor2 dark:text-blackColor2-dark leading-18 md:leading-15 lg:leading-18">
              {title}
            </h1>
            <ul className="flex gap-1 justify-center">
              <li>
                <Link
                  href="/"
                  className="text-lg text-blackColor2 dark:text-blackColor2-dark hover:text-primaryColor dark:hover:text-primaryColor"
                >
                  Home <i className="icofont-simple-right"></i>
                </Link>
              </li>
              <li>
                <span className="text-lg text-blackColor2 dark:text-blackColor2-dark mr-1.5">
                  {path}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPrimary;
