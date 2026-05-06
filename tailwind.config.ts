import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans Variable', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        reward: {
          DEFAULT: "hsl(var(--reward))",
          foreground: "hsl(var(--reward-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        fintech: {
          "quick-action-bg": "hsl(var(--quick-action-bg))",
          "quick-action-icon": "hsl(var(--quick-action-icon))",
          "nav-active": "hsl(var(--nav-active))",
          "nav-inactive": "hsl(var(--nav-inactive))",
          "tx-credit": "hsl(var(--transaction-credit))",
          "tx-debit": "hsl(var(--transaction-debit))",
          "chip-success-bg": "hsl(var(--chip-success-bg))",
          "chip-success-text": "hsl(var(--chip-success-text))",
          "chip-pending-bg": "hsl(var(--chip-pending-bg))",
          "chip-pending-text": "hsl(var(--chip-pending-text))",
          "chip-failed-bg": "hsl(var(--chip-failed-bg))",
          "chip-failed-text": "hsl(var(--chip-failed-text))",
          merchant: "hsl(var(--merchant-primary))",
          "merchant-fg": "hsl(var(--merchant-primary-foreground))",
        },
        surface: {
          primary: "hsl(var(--surface-primary))",
          secondary: "hsl(var(--surface-secondary))",
          tertiary: "hsl(var(--surface-tertiary))",
          elevated: "hsl(var(--surface-elevated))",
          inset: "hsl(var(--surface-inset))",
          overlay: "hsl(var(--surface-overlay))",
          border: "hsl(var(--surface-border))",
          "border-subtle": "hsl(var(--surface-border-subtle))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 14px)",
      },
      boxShadow: {
        /* Tier 0 — no shadow, just surface */
        "none": "none",
        /* Tier 1 — subtle resting card */
        "card": "0 1px 2px 0 hsl(var(--shadow-card) / 0.06)",
        /* Tier 2 — interactive hover lift */
        "card-hover": "0 4px 16px -2px hsl(var(--shadow-card) / 0.1), 0 1px 4px -1px hsl(var(--shadow-card) / 0.06)",
        /* Tier 3 — elevated panels, modals */
        "elevated": "0 8px 32px -6px hsl(var(--shadow-card) / 0.12), 0 2px 8px -2px hsl(var(--shadow-card) / 0.06)",
        /* Tier 4 — hero balance card */
        "balance": "0 20px 50px -16px hsl(164 45% 22% / 0.25), 0 6px 16px -6px hsl(164 45% 22% / 0.1)",
        /* Tier 5 — premium overlay / sheet */
        "premium": "0 24px 64px -16px hsl(var(--shadow-card) / 0.18), 0 8px 20px -8px hsl(var(--shadow-card) / 0.08)",
        /* Brand glow */
        "glow": "0 0 24px -8px hsl(var(--glow-primary) / 0.12)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-up": {
          from: { transform: "translateY(12px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.96)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "skeleton-shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "slide-up-sheet": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "fade-in-scale": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "success-check": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s cubic-bezier(0.32, 0.72, 0, 1)",
        "accordion-up": "accordion-up 0.2s cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-up": "slide-up 0.5s cubic-bezier(0.32, 0.72, 0, 1) both",
        "fade-in": "fade-in 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        "scale-in": "scale-in 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "skeleton": "skeleton-shimmer 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "sheet-up": "slide-up-sheet 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        "modal-in": "fade-in-scale 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        "success": "success-check 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.32, 0.72, 0, 1)",
        "smooth": "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
