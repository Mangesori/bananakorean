import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: [
      'lh3.googleusercontent.com', // Google 프로필 이미지 도메인
      'iepcqrmxpdhfeicpfpxn.supabase.co', // 새 Supabase 스토리지 도메인
      'platform-lookaside.fbsbx.com', // Facebook 프로필 이미지
    ],
  },
  staticPageGenerationTimeout: 180,
  output: 'standalone',
  async redirects() {
    return [];
  },
};

export default withNextIntl(nextConfig);
