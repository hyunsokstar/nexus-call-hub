// postcss.config.js
export default {
    plugins: {
        '@tailwindcss/postcss': {}, // ✅ 요렇게 바뀜!
        autoprefixer: {},
    },
};
