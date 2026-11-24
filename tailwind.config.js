/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0F19', // Modern sleek midnight slate (not pitch black)
        surface: '#141C2E',   // Premium cyber navy card surface
        surfaceLight: '#1E293B', // Highlight surface
        surfaceCard: '#182235',
        neonOrange: '#FF5500',
        neonGold: '#FFAA00',
        neonCyan: '#00E5FF',
        neonGreen: '#10B981',
        cyberRed: '#EF4444'
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 25px rgba(255, 85, 0, 0.45)',
        'glow-cyan': '0 0 25px rgba(0, 229, 255, 0.45)',
        'glow-gold': '0 0 25px rgba(255, 170, 0, 0.45)',
        'glow-green': '0 0 25px rgba(16, 185, 129, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-scroll': 'gridMove 20s linear infinite',
        'scanline': 'scan 3s linear infinite',
      },
      keyframes: {
        gridMove: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        }
      }
    },
  },
  plugins: [],
}
