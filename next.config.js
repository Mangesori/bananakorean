/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google 프로필 이미지 도메인
      'rjloyerccxmzebkrlapm.supabase.co', // Supabase 스토리지 도메인 (필요한 경우)
      'platform-lookaside.fbsbx.com', // Facebook 프로필 이미지
    ],
  },
};

module.exports = nextConfig;
