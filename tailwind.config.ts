import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 10s linear infinite',
                'spin-reverse-slow': 'spin-reverse 14s linear infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                'spin-reverse': {
                    from: { transform: 'rotate(360deg)' },
                    to: { transform: 'rotate(0deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
            },
            perspective: {
                '3d': '800px',
            },
        }
    },
    plugins: [],
}

export default config
