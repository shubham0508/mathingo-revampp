const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './src/**/**/*.{js,ts,jsx,tsx,html,mdx}',
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
  ],
  darkMode: ['class'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      'max-md': {
        max: '767px',
      },
      'max-sm': {
        max: '639px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'content-background': 'hsl(var(--sidebar-content-background))',
        'heading-ha': 'hsl(var(--heading-ha))',
        'action-buttons-background': 'hsl(var(--action-buttons-background))',
        'action-buttons-foreground': 'hsl(var(--action-buttons-foreground))',
        'action-buttons-hover': 'var(--action-buttons-hover)',
        'button-background-question': 'var(--button-background-question)',
        'secondary-text': '#000000B2',
        'secondary-border': '#00000066',
        'button-order': 'hsl(212, 71%, 54%)',
        'custom-shadow': 'hsl(209, 70%, 49%)',
        'text-tertiary': '#7980A3',
        'tabs-background': '#E2E6FF',
        'solution-steps': 'rgba(42,53,148,0.8)',
        'secondary-background': '#F0F2FF',
        'landing-bg-image': '#C4E8FF',
        'landing-bg-border': '#2E90D0',
        'ha-image-blue-boxes': '#80BAFF',
        'mathzai-bg-start': '#D1E9FF', // Lightest blue for gradient top
        'mathzai-bg-end': '#A6D8FF', // Darker blue for gradient bottom
        'mathzai-circle-outer': '#C2E0FF', // Outer ring of the large circle
        'mathzai-circle-border': '#A9D3FF', // Border/glow of the large circle
        'mathzai-green': '#A8E0A3',
        'mathzai-pink': '#FDC0C0',
        'mathzai-yellow': '#FCE5A7',
        'mathzai-blue-icon': '#3B82F6',
        'mathzai-text-dark': '#374151', // For text on light bubbles
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        amber: {
          100: 'var(--amber-100)',
          300: 'var(--amber-300)',
          400: 'var(--amber-400)',
          500: 'var(--amber-500)',
          600: 'var(--amber-600)',
        },
        black: {
          600: 'var(--black-600)',
          900: 'var(--black-900)',
          DEFAULT: 'var(--black)',
          opacity: {
            30: 'var(--black-opacity-30)',
            40: 'var(--black-opacity-40)',
            60: 'var(--black-opacity-60)',
            70: 'var(--black-opacity-70)',
            80: 'var(--black-opacity-80)',
            90: 'var(--black-opacity-90)',
          },
        },
        blue: {
          50: 'var(--blue-50)',
          100: 'var(--blue-100)',
          200: 'var(--blue-200)',
          300: 'var(--blue-300)',
          400: 'var(--blue-400)',
          500: 'var(--blue-500)',
          600: 'var(--blue-600)',
          700: 'var(--blue-700)',
          800: 'var(--blue-800)',
          900: 'var(--blue-900)',
          gray: {
            300: 'var(--blue-gray-300)',
            400: 'var(--blue-gray-400)',
            500: 'var(--blue-gray-500)',
          },
        },
        cyan: {
          50: 'var(--cyan-50)',
          900: 'var(--cyan-900)',
        },
        gray: {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
        },
        green: {
          100: 'var(--green-100)',
          300: 'var(--green-300)',
          500: 'var(--green-500)',
          700: 'var(--green-700)',
          900: 'var(--green-900)',
          opacity: {
            80: 'var(--green-opacity-80)',
          },
        },
        indigo: {
          200: 'var(--indigo-200)',
          300: 'var(--indigo-300)',
          800: 'var(--indigo-800)',
          900: 'var(--indigo-900)',
        },
        lightBlue: {
          100: 'var(--light-blue-100)',
          600: 'var(--light-blue-600)',
          800: 'var(--light-blue-800)',
          900: 'var(--light-blue-900)',
        },
        lightGreen: {
          opacity: {
            30: 'var(--light-green-opacity-30)',
          },
        },
        lime: {
          900: 'var(--lime-900)',
        },
        pink: {
          50: 'var(--pink-50)',
        },
        red: {
          500: 'var(--red-500)',
          800: 'var(--red-800)',
        },
        teal: {
          200: 'var(--teal-200)',
          400: 'var(--teal-400)',
        },
        white: {
          DEFAULT: 'var(--white)',
          opacity: {
            80: 'var(--white-opacity-80)',
            90: 'var(--white-opacity-90)',
          },
        },
        yellow: {
          50: 'var(--yellow-50)',
          200: 'var(--yellow-200)',
          400: 'var(--yellow-400)',
          700: 'var(--yellow-700)',
        },
      },
      fontSize: {
        xs: [
          '0.75rem',
          {
            lineHeight: '1rem',
          },
        ],
        sm: [
          '0.875rem',
          {
            lineHeight: '1.25rem',
          },
        ],
        base: [
          '1rem',
          {
            lineHeight: '1.5rem',
          },
        ],
        lg: [
          '1.125rem',
          {
            lineHeight: '1.75rem',
          },
        ],
        xl: [
          '1.25rem',
          {
            lineHeight: '1.75rem',
          },
        ],
        '2xl': [
          '1.5rem',
          {
            lineHeight: '2rem',
          },
        ],
        '3xl': [
          '1.875rem',
          {
            lineHeight: '2.25rem',
          },
        ],
        '4xl': [
          '2.25rem',
          {
            lineHeight: '2.5rem',
          },
        ],
        '5xl': [
          '3rem',
          {
            lineHeight: '1',
          },
        ],
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        '4xl': 'var(--radius-4xl)',
        '5xl': 'var(--radius-5xl)',
        '6xl': 'var(--radius-6xl)',
        '7xl': 'var(--radius-7xl)',
        '8xl': 'var(--radius-8xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        'feature-bubble': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'main-circle': '0 8px 20px rgba(0,0,0,0.15)',
      },
      backgroundImage: {
        'hero-pattern': "url('/images/icons/img_group_4.png')",
        'gradient-primary': 'linear-gradient(180deg, #05a3e3, #3481dc)',
        'gradient-secondary': 'linear-gradient(90deg, #1588e9, #31cdae)',
        'gradient-button': 'linear-gradient(180deg, #05A3E4, #3482DD)',
        'gradient-background': 'linear-gradient(180deg, #05A3E4, #3482DD)',
        infinity: "url('/images/logos/infinity.png')",
        'mathz-radial': 'radial-gradient(circle, rgba(84,180,250,0.6) 9%, rgba(54,168,250,0.6) 64%, rgba(127,209,255,0.6) 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
        'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        '4xl': 'var(--space-4xl)',
        '5xl': 'var(--space-5xl)',
        '6xl': 'var(--space-6xl)',
        '7xl': 'var(--space-7xl)',
        '8xl': 'var(--space-8xl)',
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          'Apple Color Emoji"',
          'Segoe UI Emoji"',
          'Segoe UI Symbol"',
          'Noto Color Emoji"',
        ],
        avenir: ['Avenir', 'sans-serif'],
        roca: ['Roca', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        blink: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.3',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        blink: 'blink 1.5s ease-in-out',
      },
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.textlg': {
          fontSize: '18px',
          fontWeight: '500',
          '@screen sm': {
            fontSize: '15px',
          },
        },
        '.text2xl': {
          fontSize: '30px',
          fontWeight: '500',
          // '@screen md': {
          //   fontSize: '28px',
          // },
          // '@screen sm': {
          //   fontSize: '25px',
          // },
        },
        '.headingxs': {
          fontSize: '25px',
          fontWeight: '800',
          '@screen md': {
            fontSize: '23px',
          },
          '@screen sm': {
            fontSize: '21px',
          },
        },
        '.headings': {
          fontSize: '30px',
          fontWeight: '700',
          '@screen md': {
            fontSize: '28px',
          },
          '@screen sm': {
            fontSize: '25px',
          },
        },
        '.headingmd': {
          fontSize: '40px',
          fontWeight: '700',
          // '@screen md': {
          //   fontSize: '38px',
          // },
          // '@screen sm': {
          //   fontSize: '34px',
          // },
        },
      });
    },
  ],
};
