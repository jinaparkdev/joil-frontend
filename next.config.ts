import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    experimental: {
        esmExternals: false
    },

    webpack: (config) => {
        config.externals.push({
            'utf-8-validate': 'commonjs utf-8-validate',
            'bufferutil': 'commonjs bufferutil',
        })

        return config
    },
    // 3D 파일 타입 허용
    async headers() {
        return [
            {
                source: '/models/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ]
    },
};

export default nextConfig;
