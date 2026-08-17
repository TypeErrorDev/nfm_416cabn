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

## Theme setup (Tailwind v4 — CSS-first, no config file)

Tailwind v4 reads design tokens straight out of your CSS via `@theme`, and auto-detects content — no `tailwind.config.ts` and no `content: [...]` array needed.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-ink: #EDE8D8;
  --color-ink-dim: #B9B3A0;

  --color-ground: #1B1F16;
  --color-ground-2: #242A1C;
  --color-ground-3: #2E3524;

  --color-olive: #4A5230;
  --color-olive-line: #5C6740;
  --color-navy: #16232F;

  --color-red: #B4402E;
  --color-red-dim: #8C3125;

  --color-brass: #B7995F;
  --color-brass-dim: #8C7645;

  --color-rule: rgba(237, 232, 216, 0.14);

  --font-display: var(--font-oswald), "Arial Narrow", "Roboto Condensed", sans-serif;
  --font-body: var(--font-source-serif), Georgia, "Times New Roman", serif;
  --font-mono: var(--font-plex-mono), "SF Mono", ui-monospace, monospace;

  --text-hero: clamp(2.6rem, 7vw, 5.2rem);
  --text-hero--line-height: 0.96;
  --text-h2: clamp(1.7rem, 3.4vw, 2.3rem);
  --text-h2--line-height: 1.15;

  --tracking-label: 0.14em;
  --tracking-eyebrow: 0.22em;

  --spacing-gutter: clamp(20px, 5vw, 56px);
  --spacing-section: clamp(56px, 9vw, 96px);

  --radius-sm2: 2px;
}
```

This alone generates `bg-ink`, `text-brass`, `border-rule`, `font-display`, `text-hero`, `tracking-eyebrow`, `p-gutter`, `py-section`, `rounded-sm2`, etc. — no plugin config, no `theme.extend`.

## next/font setup

next/font still generates a CSS variable per font; point `@theme` at those variables (note the `inline` keyword — it's required whenever a theme variable references another CSS variable rather than a literal value):

```ts
// app/fonts.ts
import { Oswald, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";

export const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
});

export const body = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-source-serif",
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});
```

```css
/* app/globals.css — pair with the @theme block above */
@theme inline {
  --font-display: var(--font-oswald), "Arial Narrow", sans-serif;
  --font-body: var(--font-source-serif), Georgia, serif;
  --font-mono: var(--font-plex-mono), ui-monospace, monospace;
}
```

```tsx
// app/layout.tsx
import { display, body, mono } from "./fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-ground text-ink font-body antialiased">{children}</body>
    </html>
  );
}
```

## Component classes (globals.css)

`@layer components` and `@apply` are unchanged in v4:

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