/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        // WIZniche brand colors (from screenshot analysis)
        primary: '#059669',    // Emerald-600 - main green
        secondary: '#10B981',  // Emerald-500 - lighter green
      },
    },
  },
  plugins: [],
}
