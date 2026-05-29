# Task 1 — Imperial Design System, Global Styles, and Layout

## Agent: design-system-agent

## Work Completed

### 1. globals.css — Complete Imperial Theme
- Replaced default shadcn light/dark theme with a permanent dark imperial theme
- Added imperial color tokens (empire-gold, empire-bronze, empire-fire, empire-ember, empire-charcoal, empire-dark, empire-metal, empire-silver, empire-muted-gold, empire-midnight)
- Set `--font-sans: 'Playfair Display', serif` and `--font-heading: 'Cinzel', serif` in theme
- Removed the `.dark` class variant (always dark)
- Added custom scrollbar styling (gold-tinted on dark)
- Added keyframe animations: `glow-pulse`, `shimmer`, `fire-glow`, `float`
- Added utility classes: `.text-glow`, `.text-fire-glow`, `.gold-shimmer`, `.glow-border`, `.metallic-card`, `.tactical-panel`, `.empire-bg`
- **Fixed**: Removed CSS `@import url(...)` for Google Fonts (violated CSS spec ordering); fonts are loaded via `next/font/google` in layout.tsx instead

### 2. layout.tsx — Root Layout with Imperial Fonts
- Replaced Geist/Geist_Mono with Cinzel and Playfair_Display via `next/font/google`
- Set CSS variables `--font-heading` (Cinzel) and `--font-sans` (Playfair Display)
- Updated metadata with imperial branding (title, description, keywords)
- Set default body classes: `bg-[#0a0a0a] text-[#e8e0d0]`

### 3. Empire Components Created (9 components)
All in `/home/z/my-project/src/components/empire/`:

| Component | File | Description |
|-----------|------|-------------|
| GlowingBorder | GlowingBorder.tsx | Animated glowing gold/bronze/fire border wrapper using framer-motion |
| MetallicCard | MetallicCard.tsx | Imperial metallic card with gradient, sheen overlay, top highlight, hover effects |
| ImperialButton | ImperialButton.tsx | Premium button with 5 variants (primary/secondary/outline/ghost/danger) and 3 sizes |
| TacticalPanel | TacticalPanel.tsx | Dark panel with left or top accent border in configurable color |
| ImperialRankBadge | ImperialRankBadge.tsx | Animated rank badge with 4 levels (Recruit/Initiate/Warrior/Champion), glowing ring |
| ParticleBackground | ParticleBackground.tsx | Floating gold particles using CSS `float` keyframe |
| SectionDivider | SectionDivider.tsx | Decorative divider with gradient lines and sword emoji |
| ProgressBar | ProgressBar.tsx | Animated imperial progress bar with glow effect |
| Navbar | Navbar.tsx | Fixed imperial navbar with desktop/mobile responsive menu |
| Footer | Footer.tsx | Imperial footer with branding and tagline |

### 4. Barrel Export
- `index.ts` exports all 10 components

### 5. Landing Page (page.tsx)
- Hero section with animated emblem, gold shimmer title, tagline, CTA buttons
- Four Trials section with MetallicCards for Speaking/Listening/Vocabulary/Grammar
- Imperial Ranks section with ImperialRankBadge for all 4 ranks
- Progress tracking section with TacticalPanel and ProgressBar components
- Call to Action section with GlowingBorder + MetallicCard
- Footer at bottom (mt-auto for sticky footer)
- ParticleBackground behind all content

### Key Decisions
- **No CSS @import for fonts**: Used `next/font/google` exclusively (CSS @import violated ordering rules with tailwindcss)
- **ParticleBackground uses useMemo** instead of useState+useEffect (lint rule `react-hooks/set-state-in-effect`)
- **IMPERIAL_RANKS imported from `@/lib/types`** (not `@/lib/constants`) — this is where it's actually exported
- **Always-dark theme**: No `.dark` class toggle; the entire app is permanently dark

### Lint Status
✅ All files pass ESLint with zero errors

### Dev Server Status
✅ Page loads successfully (HTTP 200)
