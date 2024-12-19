import { useState } from "react";

const useAuth = () => {
  // 임시로 admin role을 가진 사용자로 설정
  const [user] = useState({
    id: 1,
    name: "Admin User",
    role: "admin", // 또는 'student'로 변경하여 테스트 가능
    email: "admin@example.com",
  });

  return {
    user,
    isAuthenticated: !!user,
  };
};

export default useAuth;
