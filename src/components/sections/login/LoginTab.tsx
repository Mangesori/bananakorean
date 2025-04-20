'use client';

import { ReactNode } from 'react';
import TabButtonPrimary from '@/components/shared/buttons/TabButtonPrimary';
import LoginForm from '@/components/shared/login/LoginForm';
import SignUpForm from '@/components/shared/login/SignUpForm';
import TabContentWrapper from '@/components/shared/wrappers/TabContentWrapper';
import Image from 'next/image';
import shapImage2 from '@/assets/images/education/hero_shape2.png';
import shapImage3 from '@/assets/images/education/hero_shape3.png';
import shapImage4 from '@/assets/images/education/hero_shape4.png';
import shapImage5 from '@/assets/images/education/hero_shape5.png';
import useTab from '@/hooks/useTab';

interface TabButton {
  name: string;
  content: ReactNode;
}

const LoginTab = () => {
  const { currentIdx, handleTabClick } = useTab();
  const tabButtons: TabButton[] = [
    { name: 'Login', content: <LoginForm /> },
    {
      name: 'Sign up',
      content: <SignUpForm />,
    },
  ];

  return (
    <div className="relative">
      <div className="absolute -left-25px -top-25px">
        <Image src={shapImage2} alt="shape" />
      </div>
      <div className="absolute -right-25px -top-25px">
        <Image src={shapImage3} alt="shape" />
      </div>
      <div className="absolute -left-25px -bottom-25px">
        <Image src={shapImage4} alt="shape" />
      </div>
      <div className="absolute -right-25px -bottom-25px">
        <Image src={shapImage5} alt="shape" />
      </div>
      <div className="flex items-center gap-5 mb-30px">
        {tabButtons.map((button, idx) => (
          <TabButtonPrimary
            key={button.name}
            name={button.name}
            handleTabClick={handleTabClick}
            idx={idx}
            currentIdx={currentIdx}
            button="lg"
          />
        ))}
      </div>
      <TabContentWrapper isShow={true}>{tabButtons[currentIdx].content}</TabContentWrapper>
    </div>
  );
};

export default LoginTab;
