/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4c669f',
                secondary: '#3b5998',
                accent: '#FFD700', // Gold
                dark: {
                    bg: '#1a1a2e',
                    card: 'rgba(255, 255, 255, 0.1)',
                    text: '#ffffff',
                    muted: '#a1a1aa'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
