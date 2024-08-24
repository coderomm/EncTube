/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'var(--Bg-background, linear-gradient(95deg, #181818 7.27%, #151515 99.21%))',
      },
      fontFamily: {
        lowballBold: ['Lowball Bold', 'sans-serif'],
        lowballLight: ['Lowball Light', 'sans-serif'],
        lowballMedium: ['Lowball Medium', 'sans-serif'],
        lowballRegular: ['Lowball Regular', 'sans-serif'],
        lowballThin: ['Lowball Thin', 'sans-serif'],
        bigShoulders: ['Big Shoulders Display', 'sans-serif']
      },
    },
    plugins: [],
  }
}

