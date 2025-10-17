'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ItemDashboard = ({ item }) => {
  const currentPath = usePathname();

  const { name, path, icon, tag, onClick, hiddenOnMobile } = item;
  const isActive = currentPath === path ? true : false;

  // 공통 스타일 클래스
  const commonClasses = `${
    isActive ? 'text-primaryColor' : 'text-contentColor dark:text-contentColor-dark '
  } hover:text-primaryColor dark:hover:text-primaryColor leading-1.8 flex gap-3 text-nowrap`;

  // 모바일/태블릿에서 숨김 처리
  const displayClasses = hiddenOnMobile ? 'hidden lg:flex' : 'flex';

  return (
    <li
      className={`py-10px border-b border-borderColor dark:border-borderColor-dark ${displayClasses} ${
        tag ? 'justify-between items-center' : ''
      }`}
    >
      {onClick ? (
        <button onClick={onClick} className={commonClasses}>
          {icon} {name}
        </button>
      ) : (
        <Link href={path} className={commonClasses}>
          {icon} {name}
        </Link>
      )}
      {tag ? (
        <span className="text-size-10 font-medium text-whiteColor px-9px bg-primaryColor leading-14px rounded-2xl">
          {tag}
        </span>
      ) : (
        ''
      )}
    </li>
  );
};

export default ItemDashboard;
