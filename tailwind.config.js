// C:\pilot-tauri\nexus-call-hub\tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./launcher.html",
        "./login.html",
        "./call-control.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // 상담 시스템 컬러 팔레트
                primary: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    900: '#1e3a8a',
                },
                success: {
                    500: '#10b981',
                    600: '#059669',
                },
                warning: {
                    500: '#f59e0b',
                    600: '#d97706',
                },
                danger: {
                    500: '#ef4444',
                    600: '#dc2626',
                }
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            }
        },
    },
    plugins: [],
}