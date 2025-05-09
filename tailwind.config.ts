
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Primary colors - professional blue tones
				primary: {
					DEFAULT: '#1976D2', // Main primary - trustworthy medium blue
					light: '#64B5F6', // Light accent
					dark: '#0D47A1', // Darker shade for hover states
					foreground: '#FFFFFF'
				},
				
				// Secondary colors - cheerful but professional
				secondary: {
					DEFAULT: '#4CAF50', // Soft green - cheerful but professional
					light: '#A5D6A7', // Lighter green for subtle UI elements
					dark: '#2E7D32', // Darker green for hover states
					foreground: '#FFFFFF'
				},
				
				// Success colors
				success: {
					DEFAULT: '#43A047', // Green for positive confirmations
					light: '#C8E6C9', // Light green backgrounds
					foreground: '#FFFFFF'
				},
				
				// Warning colors
				warning: {
					DEFAULT: '#FF9800', // Orange for alerts
					light: '#FFE0B2', // Light orange backgrounds
					foreground: '#FFFFFF'
				},
				
				// Error/destructive colors
				destructive: {
					DEFAULT: '#F44336', // Red for errors
					light: '#FFCDD2', // Light red background
					foreground: '#FFFFFF'
				},
				
				// Neutral UI colors
				neutral: {
					DEFAULT: '#78909C', // Blue-gray for neutral elements
					light: '#CFD8DC',
					dark: '#455A64',
					foreground: '#FFFFFF'
				},
				
				// Branded accent colors for UI elements
				accent: {
					blue: '#E3F2FD', // Super light blue
					green: '#F1F8E9', // Super light green
					peach: '#FFF3E0', // Warm light peach
					teal: '#E0F7FA', // Light teal
					foreground: '#263238'
				},
				
				// System UI Colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: '#F5F7FA', // Light gray-blue background
				foreground: '#263238', // Near-black text color
				muted: {
					DEFAULT: '#ECEFF1', // Very light gray-blue
					foreground: '#546E7A' // Medium gray-blue text
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#263238'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#263238'
				},
				
				// Sidebar specific colors
				sidebar: {
					DEFAULT: '#FFFFFF',
					foreground: '#455A64',
					primary: '#1976D2',
					'primary-foreground': '#FFFFFF',
					accent: '#E3F2FD',
					'accent-foreground': '#1976D2',
					border: '#E0E0E0',
					ring: '#1976D2'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					"0%": {
						opacity: "0",
						transform: "translateY(10px)"
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)"
					}
				},
				'fade-out': {
					"0%": {
						opacity: "1",
						transform: "translateY(0)"
					},
					"100%": {
						opacity: "0",
						transform: "translateY(10px)"
					}
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
