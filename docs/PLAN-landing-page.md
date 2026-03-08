# Project Plan: KuBaFiT Landing Page

## Context
**Goal**: Build a high-impact landing page tailored to getting people back to fitness, combating non-communicable diseases (NCDs) through sports, organizational advocacy, and highlighting the core AI-powered workout capabilities.
**Mode**: PLANNING ONLY

## Phase 1: Design System & Styling
- Generate a UI/UX design system using the `ui-ux-pro-max` guidelines.
- Establish the theme outlined in the mockups: High-energy dark mode (`#0F172A` / `#020617`) with vibrant neon green/emerald accents (`#22C55E` / `#10B981`).
- Setup typography suitable for a modern fitness/tech SaaS platform.

## Phase 2: Component Architecture
Create `components/LandingPage.tsx` encompassing the following structure:
1. **Header & Navigation**: Logo on left, navigation links (Features, Advocacy, Success Stories), and a "Get Started" CTA on the right.
2. **Hero Section**: 
   - Headline: "AI-Powered Workout Plans to Combat NCDs"
   - Subheadline on advocacy and AI agent.
   - Dual CTAs: "Start Your Journey" and "Watch Demo".
3. **Advocacy Section ("Empowering Your Health Journey")**: 
   - Three-column grid displaying: Community Advocacy, Sports Integration, and Health Education. Glassmorphism cards with glowing borders.
4. **Features Highlights ("Smart Features for Real Results")**: 
   - Feature cards highlighting: Personalized AI Workouts, Community Support, and Progress Tracking (simulating UI elements like charts or chat bubbles).
5. **Social Proof ("Impact & Success Stories")**: 
   - Three testimonial cards with 5-star ratings and generated success stories regarding health turnarounds.
6. **Bottom CTA**: 
   - Deep dark blue/purple gradient box.
   - "Ready to take control of your health?" -> "Start Your Free Trial".
7. **Footer**: Basic links (Product, Company, Support) and legal text.

## Phase 3: Integration & Routing
- Configure the main `App.tsx` to conditionally render `LandingPage` for unauthenticated visitors at the root `/` path.
- Route all "Get Started", "Start Your Journey", and "Start Free Trial" buttons to the existing `Register` component.
- The `Dashboard` and `Sidebar` are shielded behind the authentication layer, while the landing page remains fully public.

## Verification Checklist
- [ ] No emojis used as UI icons (strictly SVG).
- [ ] Responsive grid structure verified at 375px, 768px, and 1024px breakpoints.
- [ ] Contrast ratios ensure text is readable against the dark background.
- [ ] Routing seamlessly flows from landing page to the application onboarding.
