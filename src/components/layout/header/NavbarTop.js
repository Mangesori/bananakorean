import Image from 'next/image';
import flagImage1 from '@/assets/images/icon/flag1.webp';
import flagImage2 from '@/assets/images/icon/flag2.webp';
import flagImage3 from '@/assets/images/icon/flag3.webp';
import LoginButton from './LoginButton';
import DropdownWrapper from '@/components/shared/wrappers/DropdownWrapper';

const NavbarTop = () => {
  return (
    <div className="hidden lg:grid grid-cols-12 py-5 pl-15px items-center gap-30px border-b border-borderColor dark:border-borderColor-dark -mx-15px">
      <div className="col-start-1 col-span-3">
        <ul className="flex items-center nav-list">
          <li className="relative group">
            <button className="text-contentColor dark:text-contentColor-dark pr-10px flex items-center">
              <Image src={flagImage1} alt="" className="w-6 h-6 mr-1 rounded-lg2" />
              ENG
              <i className="icofont-rounded-down"></i>
            </button>
            {/* dropdown menu */}
            <DropdownWrapper>
              <div className="w-150px p-15px bg-whiteColor dark:bg-whiteColor-dark shadow-dropdown rounded-lg2">
                <ul>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-size-13 text-blackColor p-10px transition duration-300 hover:bg-darkdeep4 hover:text-whiteColor dark:text-blackColor-dark dark:hover:text-whiteColor-dark dark:hover:bg-darkdeep4"
                    >
                      <Image src={flagImage2} alt="" className="w-18px h-18px rounded-lg mr-10px" />
                      FR
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center text-size-13 text-blackColor p-10px transition duration-300 hover:bg-darkdeep4 hover:text-whiteColor dark:text-blackColor-dark dark:hover:text-whiteColor-dark dark:hover:bg-darkdeep4"
                    >
                      <Image src={flagImage3} alt="" className="w-18px h-18px rounded-lg mr-10px" />
                      DE
                    </a>
                  </li>
                </ul>
              </div>
            </DropdownWrapper>
          </li>
        </ul>
      </div>
      <div className="col-start-10 col-span-3">
        <LoginButton />
      </div>
    </div>
  );
};

export default NavbarTop;
