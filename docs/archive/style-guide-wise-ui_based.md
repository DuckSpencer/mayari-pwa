# Mayari Children's Storytelling App Style Guide

## Color Palette

### Primary Colors
* **Primary Meadow Green** - #7FD135 (Softer, warmer version of Wise's lime - perfect for children's content, used for primary CTAs and key interactive elements)
* **Primary Cream White** - #FEF9F3 (Warm, comforting white for backgrounds and reading surfaces)
* **Primary Forest Deep** - #2A4A1B (Success states, completion screens, and immersive reading mode backgrounds)

### Secondary Colors
* **Secondary Spring Green** - #A8E063 (Hover states and secondary emphasis)
* **Secondary Mint Pale** - #E8F7E1 (Gentle backgrounds and reading highlights)

### Accent Colors - Storybook Palette
* **Accent Sky Blue** - #87CEEB (Watercolor backgrounds, representing imagination and dreams)
* **Accent Lavender** - #C49AE0 (Magical elements and fantasy story modes)
* **Accent Sunset Pink** - #FFB6C1 (Warm, nurturing elements and character illustrations)
* **Accent Golden Yellow** - #F4E76E (Story elements, coins, magical items)

### Functional Colors
* **Success Sage** - #8FBC8F (Story completion and positive feedback)
* **Warning Amber** - #FFB347 (Gentle alerts and attention states)
* **Error Coral** - #FA8072 (Soft error states - never harsh for children)
* **Neutral Cloud** - #F0F0F0 (Input backgrounds and subtle elements)
* **Neutral Charcoal** - #4A4A4A (Primary text - softer than harsh black)

### Story Mode Colors
* **Realistic Mode** - Earth tones (browns, gentle greens, natural blues)
* **Fantasy Mode** - Magical palette (purples, golds, mystical blues, pink accents)

## Typography

### Font Family
* **Primary Font**: Quicksand (Friendly, rounded sans-serif perfect for children's content)
* **Reading Font**: Andika (Specifically designed for beginning readers)
* **Alternative Font**: Inter (Web fallback)

### Font Weights
* **Light**: 300 (For delicate UI elements)
* **Regular**: 400 (Standard text)
* **Medium**: 500 (Emphasis)
* **Semibold**: 600 (Important UI elements)
* **Bold**: 700 (Headlines and story titles)

### Text Styles

#### Story Creation Interface
* **H1 Welcome**: 34px/40px, Bold, Letter spacing -0.3px
  * Used for main welcome screens and story completion
* **H2 Section**: 26px/32px, Semibold, Letter spacing -0.2px
  * Used for story creation steps and section headers
* **H3 Options**: 20px/26px, Medium, Letter spacing -0.1px
  * Used for choice options and categories

#### Story Reading (Text burned into images)
* **Story Title**: 28px/34px, Bold, Primary Meadow Green
  * Embedded in first page illustration
* **Story Text Large**: 22px/30px, Medium, Primary Forest Deep
  * For younger children (2-3 years) - maximum 1-2 sentences
* **Story Text Standard**: 18px/26px, Regular, Primary Forest Deep
  * For older children (4-5 years) - maximum 2-3 sentences

#### Interface Text
* **Body Comfortable**: 16px/24px, Regular
  * Standard interface text and descriptions
* **Body Small**: 14px/20px, Regular
  * Secondary information and metadata
* **Caption**: 12px/18px, Medium, Letter spacing 0.2px
  * Labels and progress indicators
* **Button Text**: 18px/24px, Medium, Letter spacing 0.1px
  * Clear, friendly button text

## Component Styling

### Buttons
* **Primary Story Button**
  * Background: Primary Meadow Green (#7FD135)
  * Text: White (#FFFFFF)
  * Height: 56dp
  * Corner Radius: 28dp (fully rounded for friendliness)
  * Padding: 32dp horizontal
  * Font: Medium
  * Shadow: Soft drop shadow for depth

* **Secondary Choice Button**
  * Border: 2dp Primary Meadow Green (#7FD135)
  * Text: Primary Meadow Green (#7FD135)
  * Background: Primary Cream White (#FEF9F3)
  * Height: 56dp
  * Corner Radius: 28dp
  * Gentle hover animation

* **Story Mode Toggle**
  * Pill-shaped toggle with artistic watercolor backgrounds
  * Realistic Mode: Earth-toned background
  * Fantasy Mode: Magical gradient background

### Cards & Story Creation Pages
* **Creation Step Card**
  * Background: Primary Cream White (#FEF9F3)
  * Subtle watercolor border accent
  * Corner Radius: 20dp
  * Padding: 24dp
  * Gentle drop shadow

* **Story Preview Card**
  * Full-bleed artistic backgrounds
  * Overlay gradients for text readability
  * Corner Radius: 16dp
  * Generous padding for story titles

### Input & Selection Elements
* **Topic Input Field**
  * Height: 64dp (larger for easy parent use)
  * Corner Radius: 16dp
  * Background: Neutral Cloud (#F0F0F0)
  * Active Border: 3dp Primary Meadow Green (#7FD135)
  * Placeholder text: Gentle, encouraging prompts

* **Style Selection Grid**
  * Visual preview cards showing art style examples
  * Corner Radius: 12dp
  * Active state: Primary Meadow Green border
  * Hover: Gentle scale transform

### Reading Experience
* **Immersive Reading Mode**
  * Full-screen, no UI elements visible
  * Only story content and minimal progress dots
  * Smooth swipe transitions
  * Gentle page-turn animations

* **Progress Indicators**
  * Tiny dots at bottom edge
  * Active: Primary Meadow Green (#7FD135)
  * Inactive: Neutral Cloud (#F0F0F0)
  * Barely visible, non-distracting

### Story Creation Flow Navigation
* **Horizontal Swipe Cards**
  * Each creation step as full-width card
  * Smooth horizontal transitions
  * Clear visual progression
  * Swiper.js integration for fluid navigation

## Illustrations & Visual Language

### Artistic Style Approach
* **Watercolor Magic**: Soft, flowing watercolor backgrounds representing imagination
* **3D Storybook Elements**: Floating books, magical wands, story characters
* **Gentle Animations**: Subtle, delightful micro-interactions that feel magical
* **Cultural Inclusivity**: Diverse character representations in preview illustrations

### Story Art Styles (User Selectable)
1. **Peppa Pig Style**: Simple, colorful, geometric characters
2. **Pixi Book Style**: Classic European children's book illustration
3. **Modern Flat**: Contemporary, minimalist illustration style
4. **Watercolor Dreams**: Artistic, flowing watercolor technique

### Loading & Generation States
* **Story Brewing Animation**: Magical cauldron or book with floating elements
* **Progress Visualization**: Gentle, non-anxious loading animations
* **Generation Complete**: Celebratory but calm completion animation

## Spacing System
* **4dp** - Fine details
* **8dp** - Close relationships
* **12dp** - Comfortable spacing
* **16dp** - Standard margins
* **24dp** - Section separation
* **32dp** - Major content blocks
* **48dp** - Screen-level spacing
* **64dp** - Generous breathing room

## Motion & Animation Principles

### Reading Experience
* **Page Turns**: Realistic book-page turning animation
* **Story Reveal**: Gentle fade-in of text over illustrations
* **Navigation**: Smooth, anticipatory swipe responses

### Interface Interactions
* **Gentle Bounces**: Soft spring physics for button presses
* **Story Creation**: Smooth horizontal slide transitions
* **Selection States**: Subtle scale and color transitions
* **Loading**: Calming, non-anxious progress animations

## Accessibility & Child-Friendly Design

### Reading Accessibility
* **High Contrast**: Ensure text on illustrations meets WCAG AA standards
* **Large Text**: Minimum 18px for story content
* **Simple Language**: Age-appropriate vocabulary and sentence structure
* **Visual Hierarchy**: Clear separation between UI and story content

### Parent Usability
* **Thumb-Friendly**: All interactive elements minimum 44dp touch targets
* **Quick Creation**: Streamlined 2-page creation flow
* **Error Prevention**: Gentle validation and helpful prompts
* **Offline Ready**: Downloaded stories work without internet

## Brand Principles for Mayari

* **Magical Simplicity**: Make story creation feel effortless and enchanting
* **Nurturing Technology**: Warm, human-centered design that supports family bonding
* **Endless Imagination**: Visual language that celebrates creativity and wonder
* **Bedtime Ready**: Calming aesthetics perfect for wind-down time
* **Parent Empowerment**: Give parents confidence in handling children's curiosity
* **Story Celebration**: Honor the timeless tradition of storytelling in digital form

## PWA & Technical Considerations

### Offline Experience
* **Consistent Branding**: Cached UI maintains visual consistency offline
* **Story Availability**: Downloaded stories retain full visual fidelity
* **Gentle Degradation**: Clear, friendly messaging when features require connectivity

### Performance Optimization
* **Image Optimization**: WebP formats for faster loading while maintaining illustration quality
* **Progressive Enhancement**: Core reading experience works even on slower connections
* **Smooth Interactions**: 60fps animations for page turns and transitions