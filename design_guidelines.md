# Design Guidelines: Male Psychotherapist Website

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern healthcare websites like Headspace Health and BetterHelp, emphasizing trust, professionalism, and calming aesthetics for therapeutic services.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Primary: 165 40% 36% (calming teal #2C5F5D)
- Secondary: 180 20% 97% (soft white #F7F9F9)
- Background: 0 0% 100% (pure white #FFFFFF)

**Supporting Colors:**
- Accent: 220 30% 64% (muted blue #8B9DC3)
- Text: 195 25% 23% (charcoal #2F3E46)
- Subtle: 210 15% 92% (light grey #E9ECEF)

**Implementation**: Centralize all colors as CSS custom properties for easy theme switching.

### B. Typography
- **Primary Font**: Merriweather (serif) for headings and important text
- **Secondary Font**: Source Sans Pro (sans-serif) for body text and UI elements
- **Hierarchy**: Clear distinction between headings (h1-h3), body text, and captions
- **Professional tone**: Readable, trustworthy, and accessible

### C. Layout System
- **Spacing**: Use Tailwind units of 4, 8, 16, and 32 (equivalent to 16px, 32px, 64px, 128px)
- **Structure**: Centered single-column layout with generous white space
- **Vertical Rhythm**: Consistent 32px vertical spacing between sections
- **Responsive**: Mobile-first approach with clean breakpoints

### D. Component Library

**Navigation:**
- Clean header with minimal navigation links
- Subtle hover states with primary color

**Cards & Sections:**
- Subtle shadows (shadow-sm, shadow-md)
- Rounded corners for modern feel
- Generous padding using 8 and 16 spacing units

**Forms:**
- Professional contact forms with clear labels
- Primary color focus states
- Generous spacing between form elements

**Buttons:**
- Primary buttons using the calming teal
- Secondary buttons with outline styles
- Appointment booking CTAs prominently placed

**Content Areas:**
- Service descriptions in digestible sections
- Professional credentials clearly displayed
- Therapeutic approach overview with clear hierarchy

### E. Visual Treatment
**Professional & Calming:**
- Minimal design with intentional white space
- Soft, trustworthy color applications
- Clean lines and subtle visual elements
- Focus on readability and accessibility

**Trust-Building Elements:**
- Professional typography hierarchy
- Consistent spacing and alignment
- Subtle shadows for depth without distraction
- Clean contact forms that inspire confidence

## Images
**Two Required Images:**
1. **Therapist Profile Picture**: Professional headshot placed in the About section, circular crop, warm and approachable
2. **Office Space Photo**: Clean, calming therapy office environment, placed in Services or About section to build trust and familiarity

**No Hero Image**: The site focuses on professional presentation without large hero imagery, maintaining the minimalistic approach.

## Key Design Principles
- **Trust First**: Every element should reinforce professional credibility
- **Calming Presence**: Color and spacing choices promote a sense of calm
- **Accessibility**: High contrast ratios and clear navigation
- **Mobile Responsive**: Seamless experience across all devices
- **Conversion Focused**: Clear paths to contact and booking actions