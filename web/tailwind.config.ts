import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--text-muted)",
        faint: "var(--text-faint)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "on-primary": "var(--on-primary)",
        "primary-soft": "var(--primary-soft)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        success: "var(--success)",
        "success-soft": "var(--success-soft)",
        warning: "var(--warning)",
        "warning-soft": "var(--warning-soft)",
        danger: "var(--danger)",
        "danger-soft": "var(--danger-soft)",
        online: "var(--online)",
        idle: "var(--idle)",
        dnd: "var(--dnd)",
        offline: "var(--offline)",
        focus: "var(--focus)",
        skeleton: "var(--skeleton)",
        rail: "var(--rail)",
        "rail-hover": "var(--rail-hover)",
        "rail-active": "var(--rail-active)",
        "rail-text": "var(--rail-text)",
        "rail-muted": "var(--rail-muted)",
        "rail-muted-hover": "var(--rail-muted-hover)"
      },
      fontFamily: {
        sans: [
          "Inter Variable",
          "Noto Sans Ethiopic",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ],
        ethiopic: ["Noto Sans Ethiopic", "Inter Variable", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgb(0 0 0 / 0.25)",
        panel: "0 24px 70px -30px rgb(0 0 0 / 0.45)"
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" }
        },
        pulse_dot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" }
        }
      },
      animation: {
        "fade-in": "fade-in 160ms ease-out",
        "slide-in": "slide-in 180ms ease-out",
        "pulse-dot": "pulse_dot 2s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
