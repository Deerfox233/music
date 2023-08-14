/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 'p1.music.126.net',
            },
            {
                protocol: 'http',
                hostname: 'p1.music.126.net',
            },
            {
                protocol: 'https',
                hostname: 'p2.music.126.net',
            },
            {
                protocol: 'http',
                hostname: 'p2.music.126.net',
            },
        ],
    },
}

module.exports = nextConfig
