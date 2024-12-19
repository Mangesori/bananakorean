import Link from "next/link";

export default function Navitem({ navItem, idx, children }) {
  const { name, path, dropdown, isRelative } = navItem;

  return (
    <li key={idx} className={`nav-item group ${isRelative ? "relative" : ""}`}>
      <Link
        href={path}
        className={
          /* 패딩 설정
           * px-5: 기본 좌우 패딩 1.25rem
           * lg:px-10px: 대형 화면에서 좌우 패딩 10px
           * 2xl:px-15px: 2xl 화면에서 좌우 패딩 15px
           * 3xl:px-5: 3xl 화면에서 좌우 패딩 1.25rem
           * py-10: 기본 상하 패딩 2.5rem
           * lg:py-5: 대형 화면에서 상하 패딩 1.25rem
           * 2xl:py-30px: 2xl 화면에서 상하 패딩 30px
           * 3xl:py-10: 3xl 화면에서 상하 패딩 2.5rem
           *
           * 텍스트 스타일
           * leading-sm: 작은 행간
           * 2xl:leading-lg: 2xl 화면에서 큰 행간
           * text-base: 기본 폰트 크기
           * lg:text-sm: 대형 화면에서 작은 폰트 크기
           * 2xl:text-base: 2xl 화면에서 기본 폰트 크기
           * font-semibold: 글자 두께 600
           *
           * 레이아웃 및 상호작용
           * block: 블록 레벨 요소로 표시
           * group-hover:text-primaryColor: 그룹 호버시 기본 색상으로 변경
           * dark:text-whiteColor: 다크모드에서 흰색 텍스트
           */
          "px-5 lg:px-10px 2xl:px-15px 3xl:px-5 py-10 lg:py-5 2xl:py-30px 3xl:py-10 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold block group-hover:text-primaryColor dark:text-whiteColor"
        }
      >
        {name} {dropdown && <i className="icofont-rounded-down"></i>}
      </Link>

      {/* dropdown */}
      {children}
    </li>
  );
}
