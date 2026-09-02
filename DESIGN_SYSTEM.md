# BatchNGo Design System

This document captures the current BatchNGo visual language and design tokens for future screens. It is based on the live landing page `/`, the active forms `/post-project` and `/for-manufacturers/apply`, as well as the `reference` HTML files and existing component styles.

## Core palette

- `--background`, `--page-bg`, `--warm-stone`: `#F6F3EE`
- `--primary-charcoal`: `#1F2937`
- `--soft-black`, `--foreground`: `#111111`
- `--muted`, `--text-muted`: `#7C7A74`
- `--border`, `--border-color`, `--line`: `#E5E0D8`
- `--primary-olive`: `#7C8A6A`
- `--olive-hover`: `#667255`
- `--soft-olive-bg`: `#EEF1E8`
- `--clay-accent`: `#C9826B`
- `--clay-hover`: `#B56F59`
- `--soft-clay-bg`: `#F5E6E0`
- `--verified-green`: `#3F684F`
- `--soft-verified-bg`: `#EAF2EC`

### Semantic mappings

- `--color-background`: page background / warm stone
- `--color-foreground`: primary text
- `--color-muted`: secondary text / caption
- `--color-border`: surface borders
- `--color-surface`: card surface / white
- `--color-surface-alt`: soft surface / `#F1EEE8`
- `--color-primary`: olive action / `#7C8A6A`
- `--color-primary-hover`: `#667255`
- `--color-accent`: clay accent / `#C9826B`
- `--color-success`: verified green

## Typography

### Font families

- Sans: `Plus Jakarta Sans` (configured in live reference)
- Serif accent: `Instrument Serif` for editorial emphasis

### Hierarchy

- Headings: bold / extra-bold, large size, tight tracking.
- Body: medium / regular, warm charcoal, relaxed line-height.
- Labels and metadata: uppercase, small, spaced tracking.

### Current scales

- base body: `1rem`
- large body / input text: `1.125rem`
- section heading: `1.75rem` to `2rem`
- hero heading: `3rem` to `5.5rem`

## Spacing and layout

The current layout uses a calm, open structure with:

- outer page padding: `32px` to `48px`
- section gutters: `32px` to `40px`
- card padding: `24px` to `40px`
- form field spacing: `24px` to `32px`

## Shape and elevation

- Rounded corners: `24px`, `32px`, `40px` for cards and sections
- Pill corners: fully rounded buttons and tags
- Elevation: soft shadows and subtle borders rather than high contrast
- Cards: white surface with `#E5E0D8` border and light shadow
- Dark hero/feature sections: charcoal background with smoky border and light text

## Form elements

- Inputs: rounded `2xl`, border `#E5E0D8`, background `#F6F3EE / 60%`
- Textareas: same shape and border with taller vertical padding
- Buttons:
  - Primary: `bg-[#7C8A6A]`, `text-white`, `hover:bg-[#667255]`
  - Secondary: white with `border-[#E5E0D8]`, text `#1F2937`, hover surface `#EEF1E8`
  - Ghost / link: text `#1F2937`, subtle hover underlay
- Pills and tags: uppercase text, small size, muted / olive backgrounds

## Components

### Header

- Sticky top bar with blurred white/stone surface
- Charcoal logo and link text
- Primary CTA button: olive rounded-full
- Mobile menu: rounded border button

### Hero

- Large editorial heading with italic olive emphasis
- Two-column hero section with image card and floating badge elements
- Buttons are full-width on small screens, inline on desktop

### Category / card grid

- Rounded `32px` cards with `bg-white` and `border-[#E5E0D8]`
- Image section uses object-cover and soft overflow-hidden radius
- Icon labels use olive text on soft olive pill backgrounds

### Trust and feature bars

- Horizontal trust strip on white surface
- Feature cards use `#F6F3EE` background and olive icon containers

### Secondary CTA panels

- `bg-[#EEF1E8]` for maker CTA sections
- `bg-white` for final CTA cards
- Secondary dark panel: `#111827` for high-contrast protection callouts

## Images

- Use rich product imagery with large rounded corner containers
- Maintain consistent card radius and object-cover cropping
- Keep images grounded in warm, premium lifestyle styling

## Tokens added to `app/globals.css`

The following non-visual tokens are now available for future screens:

- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-pill`
- `--shadow-soft`, `--shadow-card`, `--shadow-floating`
- `--font-heading`, `--font-body`
- `--text-size-base`, `--text-size-lg`, `--text-size-xl`

These tokens preserve the existing look while providing a structured foundation for new UI.

## Design principles

- Keep the overall palette warm and grounded.
- Use charcoal for strong text, olive for primary action, muted stone for backgrounds.
- Prefer soft borders and generous spacing over heavy visual chrome.
- Retain premium, calm marketplace tone with subtle refinement.
- Keep new screens consistent with the current page structure and component rhythm.

## Practical guidance for new screens

- Use white or warm stone cards on a stone page background.
- Use olive for primary CTAs and dark charcoal for body copy.
- Use subtle border lines and soft shadows to separate surfaces.
- Keep rounded corners large and smooth.
- Preserve the calm spacing and light typographic hierarchy from existing pages.
