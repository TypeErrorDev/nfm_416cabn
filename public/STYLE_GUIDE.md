# Norwegian Foot March — Oceanside · Style Guide

A field-poster aesthetic: dark olive/khaki ground, deep navy, muted flag-red, brass accents. One deliberate dark "world" — not a light/dark toggle.

---

## Colors

<table>
<tr><th>Swatch</th><th>Name</th><th>Hex</th><th>Usage</th></tr>
<tr><td><div style="width:90px;height:36px;background:#EDE8D8;border:1px solid #444;border-radius:4px;"></div></td><td><code>ink</code></td><td><code>#EDE8D8</code></td><td>Primary text on dark ground</td></tr>
<tr><td><div style="width:90px;height:36px;background:#B9B3A0;border:1px solid #444;border-radius:4px;"></div></td><td><code>ink-dim</code></td><td><code>#B9B3A0</code></td><td>Body copy, secondary text</td></tr>
<tr><td><div style="width:90px;height:36px;background:#1B1F16;border:1px solid #444;border-radius:4px;"></div></td><td><code>ground</code></td><td><code>#1B1F16</code></td><td>Page background</td></tr>
<tr><td><div style="width:90px;height:36px;background:#242A1C;border:1px solid #444;border-radius:4px;"></div></td><td><code>ground-2</code></td><td><code>#242A1C</code></td><td>Card / raised surface</td></tr>
<tr><td><div style="width:90px;height:36px;background:#2E3524;border:1px solid #444;border-radius:4px;"></div></td><td><code>ground-3</code></td><td><code>#2E3524</code></td><td>Alternate section background (register)</td></tr>
<tr><td><div style="width:90px;height:36px;background:#4A5230;border:1px solid #444;border-radius:4px;"></div></td><td><code>olive</code></td><td><code>#4A5230</code></td><td>Accent fills, topo linework</td></tr>
<tr><td><div style="width:90px;height:36px;background:#16232F;border:1px solid #444;border-radius:4px;"></div></td><td><code>navy</code></td><td><code>#16232F</code></td><td>Footer background</td></tr>
<tr><td><div style="width:90px;height:36px;background:#B4402E;border:1px solid #444;border-radius:4px;"></div></td><td><code>red</code></td><td><code>#B4402E</code></td><td>Primary CTA, accent band</td></tr>
<tr><td><div style="width:90px;height:36px;background:#8C3125;border:1px solid #444;border-radius:4px;"></div></td><td><code>red-dim</code></td><td><code>#8C3125</code></td><td>Red hover / pressed state</td></tr>
<tr><td><div style="width:90px;height:36px;background:#B7995F;border:1px solid #444;border-radius:4px;"></div></td><td><code>brass</code></td><td><code>#B7995F</code></td><td>Eyebrows, labels, dividers, numerals</td></tr>
<tr><td><div style="width:90px;height:36px;background:#8C7645;border:1px solid #444;border-radius:4px;"></div></td><td><code>brass-dim</code></td><td><code>#8C7645</code></td><td>Muted brass (rules, hover borders)</td></tr>
<tr><td><div style="width:90px;height:36px;background:rgba(237,232,216,0.14);border:1px solid #444;border-radius:4px;"></div></td><td><code>rule</code></td><td><code>rgba(237,232,216,.14)</code></td><td>Hairline borders</td></tr>
</table>

---

## Typography

| Role | Stack (artifact / system-safe) | Recommended webfont (Next.js) |
|---|---|---|
| Display / headings | `"Arial Narrow", "Roboto Condensed", "Segoe UI", Arial, sans-serif` | `Oswald` (or `Barlow Condensed`, `Bebas Neue`) |
| Body copy | `Georgia, "Iowan Old Style", "Times New Roman", serif` | `Source Serif 4` (or `PT Serif`, `Lora`) |
| Mono / data | `Consolas, "SF Mono", ui-monospace, monospace` | `IBM Plex Mono` |

**Type scale**

| Token | Size | Notes |
|---|---|---|
| Hero H1 | `clamp(2.6rem, 7vw, 5.2rem)` | line-height `0.96`, uppercase |
| Section H2 | `clamp(1.7rem, 3.4vw, 2.3rem)` | line-height `1.15`, uppercase |
| Eyebrow label | `0.72rem` | uppercase, `letter-spacing: 0.22em` |
| Pill / meta label | `0.68rem` | uppercase, `letter-spacing: 0.14em` |
| Body | `1.02rem` | line-height `1.75`, `ink-dim` |

Headings: uppercase, `font-weight: 700`, `text-wrap: balance`.

---

## Spacing & structure

| Token | Value | Usage |
|---|---|---|
| `gutter` | `clamp(20px, 5vw, 56px)` | Horizontal page padding |
| `section` | `clamp(56px, 9vw, 96px)` | Vertical padding per section |
| radius (buttons/inputs) | `2px` | Sharp, field-manual edges — not rounded |
| radius (cards/badges) | `6px` | Slightly softer for boxed content |

---

## Components

- **Button — primary**: `background: red`, `color: #F6EEE6`, hover → `#C44A36`
- **Button — ghost**: transparent, `border: 1px solid rule`, hover → `border/text: brass`
- **Card**: `background: ground-2`, `border: 1px solid rule`, `padding: 24–28px`
- **Pill**: transparent fill, `border: 1px solid rule`, full radius, brass dot marker
- **Eyebrow**: brass, uppercase, wide tracking, 22px leading rule

---

## Tailwind config (Next.js)

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#EDE8D8", dim: "#B9B3A0" },
        ground: { DEFAULT: "#1B1F16", 2: "#242A1C", 3: "#2E3524" },
        olive: { DEFAULT: "#4A5230", line: "#5C6740" },
        navy: "#16232F",
        red: { DEFAULT: "#B4402E", dim: "#8C3125" },
        brass: { DEFAULT: "#B7995F", dim: "#8C7645" },
        rule: "rgba(237,232,216,0.14)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "sans-serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        hero: ["clamp(2.6rem, 7vw, 5.2rem)", { lineHeight: "0.96" }],
        h2: ["clamp(1.7rem, 3.4vw, 2.3rem)", { lineHeight: "1.15" }],
      },
      letterSpacing: {
        label: "0.14em",
        eyebrow: "0.22em",
      },
      spacing: {
        gutter: "clamp(20px, 5vw, 56px)",
        section: "clamp(56px, 9vw, 96px)",
      },
      borderRadius: {
        sm2: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
```

## next/font setup

```ts
// app/fonts.ts
import { Oswald, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";

export const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const body = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});
```

## Component classes (globals.css)

```css
@layer components {
  .btn {
    @apply inline-flex items-center gap-2.5 font-display uppercase tracking-label
           text-sm font-bold px-6 py-3.5 rounded-sm2 transition-colors;
  }
  .btn-primary {
    @apply bg-red text-[#F6EEE6] border border-red hover:bg-[#C44A36];
  }
  .btn-ghost {
    @apply bg-transparent text-ink border border-rule hover:border-brass hover:text-brass;
  }

  .card {
    @apply bg-ground-2 border border-rule p-6;
  }

  .eyebrow {
    @apply font-display uppercase tracking-eyebrow text-xs text-brass
           flex items-center gap-2.5 before:content-[''] before:w-[22px]
           before:h-px before:bg-brass-dim;
  }

  .pill {
    @apply font-display text-[0.68rem] uppercase tracking-label text-ink
           border border-rule rounded-full px-3.5 py-1.5 inline-flex items-center gap-2;
  }

  .stat-num {
    @apply font-display font-bold text-brass [font-variant-numeric:tabular-nums];
  }
}
```