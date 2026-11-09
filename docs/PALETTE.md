# Palette and accessibility

Rust is an unusual primary color: it is warm, low-chroma in shadow and high-chroma in direct use, and it can turn muddy or alarm-like if paired with pure grays or another saturated warm hue. Rustle uses a restrained warm-neutral system, one cool complementary accent, and semantically distinct status colors.

## Base brand

**Rust `#B7410E`** is the primary brand anchor. It suggests oxidized metal and earth, feels specific rather than generic-SaaS blue, and reads well as a solid fill with white text. In light mode it is used for:

- primary buttons and the selected guild fill;
- focus/selection accents and the logo mark;
- an accessible text/action color on light surfaces.

In dark mode, `#B7410E` remains a brand/fill token, but text and controls use the lighter `#F08A5B` variant. A dark rust on a near-black espresso surface would fail WCAG AA for normal text; accessibility wins over exact hex consistency. The brand still appears through the logo, selected rail tile and solid accents.

## Complementary accent

**Teal / petrol `#0F6B6B`** light, **`#6AD8C9`** dark.

Rust sits around hue 20°; teal sits on the opposite cool side of the wheel. The pairing is complementary in temperature and hue without becoming a literal high-saturation orange/blue complement. Teal is reserved for links, focus rings, secondary emphasis and a small number of success-adjacent highlights. It does not compete with the rust primary on the main call-to-action surfaces.

## Warm neutral scale

Light mode uses bone and sand rather than pure white/gray:

- `#FAF7F2` page background
- `#FFFFFF` content surface
- `#F2ECE4` channel/sidebar surface
- `#E9E0D5` selected/hover surface
- `#D8CCBD` border
- `#211A15` text and navigation rail

Dark mode uses layered espresso browns:

- `#14110F` background
- `#1E1915` content surface
- `#251F1A` sidebar
- `#302821` hover/elevated
- `#40362F` border
- `#F7EFE7` text
- `#0D0A08` navigation rail

Warm neutrals prevent the rust from looking like an error state and give the UI a material, paper/ink feeling. The deep rail anchors the workspace and provides strong contrast for guild icons.

## Status colors

| Semantic | Light | Dark | Rationale |
| --- | --- | --- | --- |
| Online / success | `#176B39` | `#77DDA2` | Forest green, distinct from teal accent, AA on surfaces. |
| Idle / warning | `#7A4E00` | `#F2C46D` | Ochre, not yellow, so it remains legible and calmer. |
| DND / danger | `#A62B22` | `#FF9C92` | Brick red that relates to rust but is clearly semantic, not brand. |
| Offline | `#6D6258` | `#A99B8D` | Warm gray; neutral rather than disabled-looking. |

Status is never communicated by color alone: labels appear in presence menus, member groups and the current connection state.

## Contrast

All semantic text/background pairs used by the UI are checked by `web/src/styles/themes.test.ts` against WCAG AA **4.5:1** for normal text. Selected measured ratios:

| Pair | Light | Dark |
| --- | ---: | ---: |
| Body text / background | 16.06:1 | 16.52:1 |
| Muted text / background | 6.35:1 | 9.39:1 |
| On-primary / primary | 5.56:1 | 7.36:1 |
| Accent / surface | 6.30:1 | 10.19:1 |
| Success / surface | 6.57:1 | 10.50:1 |
| Warning / surface | 7.20:1 | 10.70:1 |
| Danger / surface | 7.02:1 | 8.65:1 |
| Rail text / rail | 15.09:1 | 17.34:1 |
| Rail muted / rail | 9.76:1 | 9.86:1 |
| Offline / surface | 5.94:1 | 6.44:1 |

The test also checks text on all surface tiers, the soft status backgrounds, primary hover, and `on-accent`.

## Typography and Ethiopic script

- **Inter Variable** for Latin text, UI labels and numerals.
- **Noto Sans Ethiopic** 400/600/700 for Amharic. Both font families are bundled through Fontsource, so the app does not need a third-party font CDN.
- When the document language is `am`, `html[lang="am"]` raises line-height to 1.7 to account for Ethiopic ascenders/descenders and uses Noto first in the stack.
- Font sizes stay in the 11–16px range for dense workspace UI, with 1.6–1.7 line height for message content and Amharic labels.

## Light/dark behavior

- `system` is the default and is resolved with `matchMedia('(prefers-color-scheme: dark)')`.
- A tiny external `/theme-init.js` runs before the React bundle to set `data-theme` without a flash of the wrong theme.
- Users can choose Light, Dark, or Follow system from the login screen and the user menu; the choice persists in `localStorage`.
- The CSS variables are defined in `web/src/styles/themes.css`. Components use semantic names (`--surface`, `--text-muted`, `--danger`) rather than raw hex values, so adding a theme means adding one token block.

## Directionality

Amharic is written left-to-right, so it is LTR like English. However, the shell uses logical CSS properties throughout:

- `ms-*` / `me-*` / `ps-*` / `pe-*` instead of physical margins/padding;
- `start-*` / `end-*` for rail indicators and action placement;
- `border-s` / `border-e`;
- `text-start` for button content;
- a central locale → direction map (`html.dir`) and `dir="auto"` for user-generated message content.

This makes the layout ready for a future RTL locale without a second component tree. Dialog centering uses symmetric transforms and remains valid in either direction.
