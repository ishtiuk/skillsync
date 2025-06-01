import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ['class'],
  content: [
    'app/**/*.{ts,tsx}',
    'src/styles/**/*.css',
    'components/**/*.{ts,tsx}',
    '../../packages/ui/src/components/**/*.{ts,tsx}'
  ],
  theme: {
    boxShadow: {
      customShadow: 'var(--level)',
      customShadowCoach: '2px 4px 16px 0px rgba(31, 29, 28, 0.12)',
      customShadowFilter: '1px 3px 16px 0px rgba(31, 29, 28, 0.08)',
      customShadowBar: '1px 3px 16px 0px rgba(31, 29, 28, 0.08)'
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        background: 'hsl(var(--neutral-n-100))',
        foreground: 'hsl(var(--neutral-n-800))',
        primary: {
          'g-100': 'hsl(var(--primary-g-100))',
          'g-200': 'hsl(var(--primary-g-200))',
          'g-300': 'hsl(var(--primary-g-300))',
          'g-400': 'hsl(var(--primary-g-400))',
          'g-500': 'hsl(var(--primary-g-500))',
          'g-600': 'hsl(var(--primary-g-600))',
          'g-700': 'hsl(var(--primary-g-700))',
          'g-800': 'hsl(var(--primary-g-800))'
        },
        neutral: {
          'n-100': 'hsl(var(--neutral-n-100))',
          'n-200': 'hsl(var(--neutral-n-200))',
          'n-300': 'hsl(var(--neutral-n-300))',
          'n-400': 'hsl(var(--neutral-n-400))',
          'n-500': 'hsl(var(--neutral-n-500))',
          'n-50': 'hsl(var(--neutral-n-50))',
          'n-600': 'hsl(var(--neutral-n-600))',
          'n-700': 'hsl(var(--neutral-n-700))',
          'n-800': 'hsl(var(--neutral-n-800))'
        },
        blue: {
          'b-100': 'hsl(var(--blue-b-100))',
          'b-200': 'hsl(var(--blue-b-200))',
          'b-300': 'hsl(var(--blue-b-300))',
          'b-400': 'hsl(var(--blue-b-400))',
          'b-500': 'hsl(var(--blue-b-500))',
          'b-600': 'hsl(var(--blue-b-600))',
          'b-700': 'hsl(var(--blue-b-700))',
          'b-800': 'hsl(var(--blue-b-800))'
        },
        purple: {
          'p-100': 'hsl(var(--purple-p-100))',
          'p-200': 'hsl(var(--purple-p-200))',
          'p-300': 'hsl(var(--purple-p-300))',
          'p-400': 'hsl(var(--purple-p-400))',
          'p-500': 'hsl(var(--purple-p-500))',
          'p-600': 'hsl(var(--purple-p-600))',
          'p-700': 'hsl(var(--purple-p-700))',
          'p-800': 'hsl(var(--purple-p-800))'
        },
        red: {
          'r-100': 'hsl(var(--red-r-100))',
          'r-200': 'hsl(var(--red-r-200))',
          'r-300': 'hsl(var(--red-r-300))',
          'r-400': 'hsl(var(--red-r-400))',
          'r-500': 'hsl(var(--red-r-500))',
          'r-600': 'hsl(var(--red-r-600))',
          'r-700': 'hsl(var(--red-r-700))',
          'r-800': 'hsl(var(--red-r-800))'
        },
        orange: {
          'o-100': 'hsl(var(--orange-o-100))',
          'o-200': 'hsl(var(--orange-o-200))',
          'o-300': 'hsl(var(--orange-o-300))',
          'o-400': 'hsl(var(--orange-o-400))',
          'o-500': 'hsl(var(--orange-o-500))',
          'o-600': 'hsl(var(--orange-o-600))',
          'o-700': 'hsl(var(--orange-o-700))',
          'o-800': 'hsl(var(--orange-o-800))'
        },
        yellow: {
          'y-100': 'hsl(var(--yellow-y-100))',
          'y-200': 'hsl(var(--yellow-y-200))',
          'y-300': 'hsl(var(--yellow-y-300))',
          'y-400': 'hsl(var(--yellow-y-400))',
          'y-500': 'hsl(var(--yellow-y-500))',
          'y-600': 'hsl(var(--yellow-y-600))',
          'y-700': 'hsl(var(--yellow-y-700))',
          'y-800': 'hsl(var(--yellow-y-800))'
        },
        gray: {
          'g-400': 'hsl(var(--gray-g-400))',
          'g-500': 'hsl(var(--gray-g-500))'
        },
        transparent: {
          't-50': 'var(--transparency-50)'
        },
        navigation: {
          DEFAULT: 'hsl(var(--neutral-n-200))',
          foreground: 'hsl(var(--neutral-n-600))'
        },
        'navigation-btn': {
          foreground: 'hsl(var(--neutral-n-600))',
          'foreground-active': 'hsl(var(--primary-g-700))',
          hover: 'hsl(var(--neutral-n-300))'
        },
        fontFamily: {
          'dm-sans': 'DM Sans'
        },
        textColors: {
          DEFAULT: 'hsl(var(--neutral-n-800))',
          primary: 'hsl(var(--neutral-n-800))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        /* sm: 'calc(var(--radius) - 4px)' */
        sm: 'var(--radius-sm)',
        xs: 'var(--radius)'
      },
      boxShadow: {
        lg: '0px 8px 16px 0px rgba(21, 22, 22, 0.16)'
      },
      fontSize: {
        sm: [
          '0.75rem',
          {
            lineHeight: '1.25rem',
            letterSpacing: '-0.0175rem'
          }
        ],
        md: [
          '1rem',
          {
            lineHeight: '1.5rem',
            letterSpacing: '-0.0225rem'
          }
        ],
        lg: [
          '1.5rem',
          {
            lineHeight: '2rem',
            letterSpacing: '-0.03rem'
          }
        ],
        xl: [
          '2.25rem',
          {
            lineHeight: '2.5rem',
            letterSpacing: '-0.045rem'
          }
        ],
        '2xl': [
          '3rem',
          {
            lineHeight: '3rem',
            letterSpacing: '-0.06rem'
          }
        ],
        '3xl': [
          '4.5rem',
          {
            lineHeight: '4.5rem',
            letterSpacing: '-0.135rem'
          }
        ]
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0px' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0px' }
        },
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-2px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        slideLeftAndFade: {
          from: { opacity: '0', transform: 'translateX(2px)' },
          to: { opacity: '1', transform: 'translateX(0)' }
        },
        slideUpAndFade: {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        slideRightAndFade: {
          from: { opacity: '0', transform: 'translateX(-2px)' },
          to: { opacity: '1', transform: 'translateX(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade:
          'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade:
          'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade:
          'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)'
      },
      backgroundImage: {
        'gradient-135': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'green-pattern':
          'linear-gradient(135deg, rgba(188, 235, 178, 1) 0%, rgba(142, 224, 126, 1) 30.5%, rgba(94, 204, 112, 1) 67%, rgba(59, 163, 111, 1) 100%)',
        'orange-pattern':
          'linear-gradient(135deg, rgba(255, 218, 194, 1) 0%, rgba(255, 173, 133, 1) 30.5%, rgba(255, 133, 71, 1) 67%, rgba(245, 88, 10, 1) 100%)',
        'yellow-pattern':
          'linear-gradient(135deg, rgba(255, 239, 173, 1) 0%, rgba(255, 218, 117, 1) 30.5%, rgba(255, 206, 71, 1) 67%, rgba(229, 168, 0, 1) 100%)',
        'red-pattern':
          'linear-gradient(135deg, rgba(255, 173, 206, 1) 0%, rgba(255, 133, 153, 1) 33.5%, rgba(255, 92, 92, 1) 67.5%, rgba(233, 0, 0, 1) 100%)',
        'blue-pattern':
          'linear-gradient(135deg, rgba(153, 201, 255, 1) 0%, rgba(64, 140, 255, 1) 33.5%, rgba(51, 105, 255, 1) 70%, rgba(13, 62, 199, 1) 100%)',
        'purple-pattern':
          'linear-gradient(135deg, rgba(226, 194, 255, 1) 0%, rgba(194, 133, 255, 1) 32%, rgba(156, 89, 255, 1) 67.5%, rgba(91, 29, 184, 1) 100%)',
        'gradient-blue-b100':
          'linear-gradient(135deg, rgba(7, 41, 36, 1) 0%, rgba(14, 82, 73, 1) 34%, rgba(64, 140, 255, 1) 74%, rgba(204, 228, 255, 1) 100%)',
        'gradient-purple-P300':
          'linear-gradient(135deg, #FFADCE 0%, #FF5C5C 34%, #9C59FF 74%, #C285FF 100%)',
        'gradient-green-g300':
          'linear-gradient(135deg, #FFD6E9 0%, #FFADCE 33%, #3BA36F 65.5%, #0E5249 100%)',
        'gradient-yellow-y500':
          'linear-gradient(135deg, #FF8547 0%, #F5580A 0.01%, #FFAD85 36%, #FFDA75 67.5%, #FFCE47 100%)',
        'gradient-yellow-y200':
          'linear-gradient(135deg, #408CFF 0%, #99C9FF 31.5%, #FFDA75 67.5%, #FFDA75 100%, #FFEFAD 100%)',
        'gradient-orange-o400':
          'linear-gradient(135deg, #FFD6E9 0%, #FFADCE 35.5%, #FF8547 66.5%, #FF8547 100%, #FFAD85 100%)',
        'gradient-red-r200':
          'linear-gradient(135deg, #CCE4FF 0%, #99C9FF 30.5%, #FF8599 67.5%, #FF5C5C 100%)',
        'gradient-green-g100':
          'linear-gradient(135deg, #E5F1FF 0%, #99C9FF 30.5%, #3BA36F 65.5%, #0E5249 100%)',
        'gradient-rainbow-200':
          'linear-gradient(98deg, #DCFAC8 0%, #CCE4FF 19.79%, #F1E0FF 38.54%, #FFD6E9 57.81%, #FFDAC2 78.65%, #FFF7D6 100%, #FFEFAD 100%)',
        'gradient-rainbow-300':
          'linear-gradient(98deg, #BCEBB2 0%, #99C9FF 19.79%, #E2C2FF 38.54%, #FFADCE 57.81%, #FFAD85 78.65%, #FFF7D6 100%, #FFDA75 100%)'
      }
    }
  },
  plugins: [tailwindcssAnimate]
} satisfies Config;

export default config;
