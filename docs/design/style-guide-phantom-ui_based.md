# Mayari Style Guide

> Canonical Note: This is the canonical style guide for Mayari. Previous explorations are preserved as historical references:
> - Historical: `docs/archive/style-guide-duolingo-ui_based.md`
> - Historical: `docs/archive/style-guide-wise-ui_based.md`
>
> All design tokens and UI work should reference this document as the single source of truth.
*A Digital Storybook Experience for Families*

## Color Palette

**Primary Colors**
* Primary Warm - #FFF8F0 (Main light background, warm paper-like feeling)
* Primary Soft Blue - #7B9AE0 (Primary brand color for interactive elements, like twilight sky)
* Primary Deep Navy - #2C3E50 (For primary text and headers, readable but gentle)

**Secondary Colors**
* Secondary Peach - #FFB4A1 (For warm accents and hover states)
* Secondary Lavender - #D4C5F0 (For gentle backgrounds and secondary elements)
* Secondary Cream - #F7F1E8 (For card backgrounds and content areas)

**Accent Colors**
* Accent Gold - #F4D03F (For magical elements, stars, and highlights)
* Accent Rose - #F1948A (For loving, warm interactive elements)
* Accent Mint - #A8E6CF (For success states and positive actions)
* Accent Coral - #FF8A65 (For playful elements and CTAs)

**Functional Colors**
* Success Green - #81C784 (For completed stories, successful saves)
* Warning Amber - #FFB74D (For gentle alerts and notifications)
* Error Rose - #F48FB1 (For soft error states, non-alarming)
* Neutral Gray - #95A5A6 (For secondary text and disabled states)

**Story Mode Colors**
* Realistic Mode - #5DADE2 (Calming blue for educational content)
* Fantasy Mode - #BB8FCE (Magical purple for imaginative stories)

## Typography

**Font Family**
* Primary Font: Poppins (Rounded, friendly, highly readable)
* Secondary Font: Comic Neue (For playful elements and child-focused text)
* Reading Font: Georgia (For story text - familiar, comfortable reading)

**Font Weights**
* Light: 300 (For subtle text)
* Regular: 400 (Body text)
* Medium: 500 (Emphasis)
* Semibold: 600 (Headings)
* Bold: 700 (Strong emphasis)

**Text Styles**

**Headings**
* H1: 36px/42px, Semibold, Letter spacing -0.2px, Primary Deep Navy
  * Used for main app title and major section headers
* H2: 28px/34px, Semibold, Letter spacing -0.1px, Primary Deep Navy
  * Used for story titles and section headers
* H3: 22px/28px, Medium, Letter spacing 0px, Primary Deep Navy
  * Used for subsection headers and card titles

**Body Text**
* Body Large: 18px/26px, Regular, Letter spacing 0px, Primary Deep Navy
  * Primary interface text and descriptions
* Body: 16px/24px, Regular, Letter spacing 0px, Primary Deep Navy
  * Standard UI text and form labels
* Body Small: 14px/20px, Regular, Letter spacing 0.1px, Neutral Gray
  * Supporting text and metadata

**Story Text**
* Story Reading: 24px/32px, Regular, Georgia, Letter spacing 0px
  * Text embedded in story images - large and clear for young children
* Story Caption: 20px/28px, Regular, Georgia, Letter spacing 0px
  * Alternative story text size for longer content

**Special Text**
* Button Text: 16px/24px, Medium, Letter spacing 0.1px
  * All interactive button labels
* Magic Text: 18px/24px, Medium, Comic Neue, Primary Soft Blue
  * For magical, playful interface elements
* Metadata: 12px/18px, Regular, Letter spacing 0.2px, Neutral Gray
  * Timestamps, story details, technical info

## Component Styling

**Buttons**
* Primary Button (Story Creation)
  * Background: Linear gradient (Accent Coral to Accent Rose)
  * Text: White (#FFFFFF)
  * Height: 52dp
  * Corner Radius: 26dp (fully rounded)
  * Padding: 24dp horizontal
  * Shadow: 0px 4px 12px rgba(255, 138, 101, 0.3)

* Secondary Button (Navigation)
  * Background: Secondary Cream (#F7F1E8)
  * Text: Primary Deep Navy (#2C3E50)
  * Border: 2px Primary Soft Blue (#7B9AE0)
  * Height: 48dp
  * Corner Radius: 24dp

* Magic Button (Special Actions)
  * Background: Linear gradient (Primary Soft Blue to Secondary Lavender)
  * Text: White (#FFFFFF)
  * Height: 56dp
  * Corner Radius: 28dp
  * Sparkle animation on hover

**Story Cards**
* Background: Secondary Cream (#F7F1E8)
* Border: 1px rgba(123, 154, 224, 0.2)
* Corner Radius: 20dp
* Padding: 20dp
* Shadow: 0px 6px 20px rgba(44, 62, 80, 0.08)
* Hover: Gentle lift animation with increased shadow

**Input Fields & Selection Cards**
* Height: 56dp
* Corner Radius: 16dp
* Background: Primary Warm (#FFF8F0)
* Border: 2px rgba(123, 154, 224, 0.3)
* Active Border: 2px Primary Soft Blue (#7B9AE0)
* Text: Primary Deep Navy (#2C3E50)
* Placeholder Text: Neutral Gray (#95A5A6)
* Padding: 16dp horizontal

**Story Style Selection Cards**
* Background: Secondary Cream (#F7F1E8)
* Corner Radius: 16dp
* Padding: 16dp
* Border: 2px transparent
* Selected Border: 2px Accent Gold (#F4D03F)
* Selected Background: rgba(244, 208, 63, 0.1)

**Progress Indicators**
* Story Progress Dots: 8dp diameter, Accent Gold (#F4D03F)
* Loading Spinner: Animated gradient using Primary Soft Blue and Secondary Lavender
* Progress Bar: Height 4dp, Corner Radius 2dp, Accent Mint fill

## Icons & Illustrations

**Icon Style**
* Primary Icons: 24dp x 24dp, rounded line style
* Large Icons: 32dp x 32dp for main actions
* Magical Icons: Include subtle sparkle or glow effects
* Colors: Primary Soft Blue for active, Neutral Gray for inactive

**Magical Elements**
* Sparkles: Small animated stars in Accent Gold
* Glows: Soft radial gradients behind important elements
* Floating Elements: Gentle floating animation for decorative icons

**Story Mode Icons**
* Realistic Mode: Lightbulb or book icon in Realistic Mode blue
* Fantasy Mode: Magic wand or star icon in Fantasy Mode purple

## Spacing System
* 2dp - Micro spacing (icon padding, fine adjustments)
* 4dp - Tiny spacing (between closely related elements)
* 8dp - Small spacing (internal padding, related items)
* 12dp - Default spacing (standard gaps)
* 16dp - Medium spacing (card padding, section separation)
* 20dp - Large spacing (major sections)
* 24dp - Extra large spacing (screen margins)
* 32dp - Section breaks (between different content areas)

## Layout & Flow

**Page Structure**
* Screen Margins: 20dp horizontal, 24dp vertical
* Card Spacing: 16dp between cards
* Content Max Width: 400dp for optimal readability
* Swipe Areas: Full-screen horizontal swipe detection

**Reading View**
* Full-screen images with embedded text
* Minimal UI: Only progress dots (bottom center, 16dp from edge)
* Safe Areas: Text positioned away from device notches/corners
* Image Aspect Ratio: 9:16 for mobile, 16:10 for tablet/desktop

## Motion & Animation

**Transitions**
* Page Swipes: 300ms ease-out with subtle parallax
* Button Press: 150ms scale to 0.95 with bounce back
* Card Hover: 200ms gentle lift (4dp elevation increase)
* Loading States: Smooth pulse and gentle rotation

**Magical Effects**
* Sparkle Animations: Random small sparkles appearing/disappearing
* Gradient Shifts: Subtle color transitions on magical elements
* Floating Animation: 3-4 second gentle up/down motion
* Story Creation: Progressive reveal with magical shimmer

**Story Transitions**
* Page Turn: 350ms with slight curve simulation
* Story Start: Fade in with gentle zoom from center
* Story End: Soft fade with magical sparkle burst

## Accessibility

**Visual Accessibility**
* Color Contrast: All text meets WCAG AA standards (4.5:1 minimum)
* Focus Indicators: 3px Primary Soft Blue outline with 2dp offset
* Touch Targets: Minimum 44dp for all interactive elements
* Text Scaling: Supports system text size preferences up to 200%

**Interaction Accessibility**
* Screen Reader: All images have descriptive alt text
* Keyboard Navigation: Full app navigable without touch
* Voice Control: All buttons have clear voice commands
* Motion: Respects reduced motion preferences

## Responsive Design

**Mobile First (320px+)**
* Single column layout
* Full-width cards with 20dp margins
* Thumb-friendly button placement
* Portrait-optimized story reading

**Tablet (768px+)**
* Two-column layout for story selection
* Larger touch targets and generous spacing
* Landscape-optimized reading with side margins

**Desktop (1024px+)**
* Centered content with max-width constraints
* Hover states for all interactive elements
* Keyboard shortcuts for power users
* Optional mouse/trackpad page navigation

## Special Considerations

**Child-Friendly Design**
* All corners rounded (minimum 8dp radius)
* High contrast for developing eyesight
* Large, clear typography for pre-readers
* Intuitive iconography with universal symbols
* Gentle, non-startling animations and sounds

**Parent-Friendly Features**
* Quick access to settings and controls
* Clear progress indicators during story creation
* Simple export and sharing options
* Obvious ways to save and organize stories

**Branding Integration**
* Mayari moon goddess theme with celestial elements
* Warm, nurturing color palette suggesting bedtime
* Typography that feels both modern and timeless
* Illustrations that complement rather than compete with AI-generated story art

<pontificating>
The app needs to feel like stepping into a magical library or cozy reading book. Think soft gradients, gentle animations, rounded everything, and colors that feel like sunset, sunrise, or a child's favorite blanket.

The German PRD emphasizes "magisches Digital-Buch" - this is key. The UI should feel enchanted, with subtle sparkles, soft glows, warm lighting effects, and transitions that feel like page-turning or magical transformations.

For the illustration styles mentioned (Peppa Pig, Pixi-Buch), the UI itself needs to complement these without competing - so more neutral, warm backgrounds that let the colorful story illustrations be the heroes.

The "Mayari" name (likely referencing the Filipino moon goddess) suggests celestial, dreamy themes - perfect for a bedtime story app. Think moonlight, starlight, soft clouds, gentle breezes.
</pontificating>