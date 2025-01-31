import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [typography],
};
