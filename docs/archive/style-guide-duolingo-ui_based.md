# Mayari Design System Style Guide

## Color Palette

### Primary Colors
* **Primary Deep Purple** - #6B46C1  
  (Core brand identity, primary buttons, and creative actions)
* **Primary Warm White** - #FEFCFB  
  (Clean backgrounds with subtle warmth for bedtime comfort)
* **Primary Text Charcoal** - #2D3748  
  (Primary text content with softer contrast than pure black)

### Secondary Colors
* **Secondary Lavender** - #A78BFA  
  (Hover states and secondary interactive elements)
* **Secondary Moonlight** - #F3F0FF  
  (Background highlights and gentle emphasis areas)
* **Background Twilight** - #F7F5FF  
  (App background with magical undertone)

### Accent Colors
* **Accent Gold** - #F59E0B  
  (Story completion, special moments, and achievement highlights)
* **Accent Rose** - #EC4899  
  (Fantasy story mode and whimsical elements)
* **Accent Teal** - #06B6D4  
  (Educational/realistic story mode and informational elements)
* **Accent Sage** - #10B981  
  (Story saved confirmations and positive actions)

### Functional Colors
* **Success Soft Green** - #34D399  
  (Story generation complete and positive feedback)
* **Error Gentle Red** - #F87171  
  (Soft error states that don't frighten children)
* **Loading Shimmer** - #DDD6FE  
  (Loading states with magical shimmer effect)
* **Border Whisper** - #E5E7EB  
  (Subtle borders and dividers)

### Story Mode Colors
* **Reality Mode Blue** - #3B82F6  
  (Realistic explanation stories)
* **Fantasy Mode Pink** - #EC4899  
  (Fantasy and magical stories)

## Typography

### Font Family
* **Primary Font**: Poppins (Google Fonts)
* **Story Text Font**: Comfortaa (for embedded story text)
* **Alternative Font**: Inter (fallback)

### Font Weights
* **Regular**: 400
* **Medium**: 500
* **SemiBold**: 600
* **Bold**: 700

### Text Styles

#### Headers
* **H1**: 32px/40px, Bold, Letter spacing -0.4px  
  Used for main screen titles and primary headers
* **H2**: 24px/32px, SemiBold, Letter spacing -0.2px  
  Used for section headers and creation flow steps
* **H3**: 20px/28px, SemiBold, Letter spacing -0.1px  
  Used for card titles and options

#### Body Text
* **Body Large**: 18px/28px, Regular, Letter spacing 0px  
  Primary reading text and descriptions
* **Body**: 16px/24px, Regular, Letter spacing 0px  
  Standard UI text and form labels
* **Body Small**: 14px/20px, Regular, Letter spacing 0.1px  
  Secondary information and captions

#### Story Text (Embedded in Images)
* **Story Title**: 28px/36px, Bold, Letter spacing -0.3px  
  Large titles embedded in story images
* **Story Body**: 24px/32px, Medium, Letter spacing 0px  
  Main story text burned into images - optimized for 2-5 year olds
* **Story Caption**: 18px/24px, Regular, Letter spacing 0.1px  
  Smaller descriptive text in images

#### Special Text
* **Button Text**: 16px/24px, SemiBold, Letter spacing 0.2px  
  Primary and secondary button labels
* **Navigation**: 14px/20px, Medium, Letter spacing 0.3px  
  Navigation elements and progress indicators

## Component Styling

### Buttons

#### Primary Button (Create Story)
* **Background**: Primary Deep Purple (#6B46C1)
* **Text**: White (#FFFFFF)
* **Height**: 56dp
* **Corner Radius**: 16dp
* **Padding**: 20dp horizontal
* **Shadow**: Y-offset 4dp, Blur 12dp, Color #6B46C1, Opacity 20%
* **Animation**: Gentle scale on press (0.98), 200ms

#### Secondary Button
* **Border**: 2dp Primary Deep Purple (#6B46C1)
* **Text**: Primary Deep Purple (#6B46C1)
* **Background**: Transparent
* **Height**: 56dp
* **Corner Radius**: 16dp
* **Hover Background**: Secondary Moonlight (#F3F0FF)

#### Story Mode Toggle Buttons
* **Fantasy Mode**: Background gradient #EC4899 to #F472B6
* **Reality Mode**: Background gradient #3B82F6 to #60A5FA
* **Height**: 48dp
* **Corner Radius**: 24dp (pill shape)
* **Selected Shadow**: Inner glow effect

### Cards & Selection Elements

#### Story Option Cards
* **Background**: White (#FEFCFB)
* **Border**: 2dp solid #E5E7EB
* **Selected Border**: 3dp solid #6B46C1
* **Selected Background**: #F3F0FF
* **Corner Radius**: 20dp
* **Padding**: 20dp
* **Shadow**: Y-offset 2dp, Blur 8dp, Color #000000, Opacity 4%
* **Hover Animation**: Lift effect (Y-offset 4dp), 250ms

#### Art Style Preview Cards
* **Aspect Ratio**: 4:3
* **Corner Radius**: 16dp
* **Border**: 3dp solid transparent
* **Selected Border**: 3dp solid #6B46C1
* **Overlay on Selection**: Semi-transparent purple with checkmark

### Progress & Navigation

#### Story Creation Progress
* **Height**: 6dp
* **Background**: #E5E7EB
* **Fill**: Linear gradient #6B46C1 to #A78BFA
* **Corner Radius**: 3dp
* **Animation**: Smooth fill, 400ms ease-out

#### Page Dots (Reading Mode)
* **Size**: 8dp diameter
* **Spacing**: 12dp apart
* **Inactive**: #E5E7EB
* **Active**: #6B46C1
* **Position**: Bottom center, 24dp from edge

#### Swipe Indicators
* **Subtle arrow hints**: 50% opacity
* **Fade in/out**: Based on user interaction patterns
* **Color**: #9CA3AF

### Story Reading Interface

#### Fullscreen Story Pages
* **Background**: Pure black (#000000) for maximum image focus
* **Text Overlay**: None (text embedded in images)
* **Navigation**: Invisible touch zones (left/right 25% of screen)
* **Exit**: Subtle 'X' in top-right corner, appears on tap

#### Loading States
* **Background**: Gradient from #6B46C1 to #A78BFA
* **Animation**: Floating magical sparkles
* **Text**: "Creating your magical story..." with pulsing dots
* **Character**: Luna moth or story sprite animation

### Input Fields

#### Text Input (Story Prompt)
* **Height**: 120dp (multi-line)
* **Corner Radius**: 16dp
* **Border**: 2dp solid #E5E7EB
* **Focus Border**: 2dp solid #6B46C1
* **Background**: White (#FEFCFB)
* **Placeholder**: "What would you like a story about?"
* **Text Color**: #2D3748

### Icons & Illustrations

#### Icon Sizes
* **Small Icons**: 20dp x 20dp
* **Standard Icons**: 24dp x 24dp
* **Large Icons**: 32dp x 32dp
* **Feature Icons**: 48dp x 48dp

#### Icon Style
* **Line Weight**: 2dp
* **Corner Radius**: 2dp (rounded line caps)
* **Primary Color**: #6B46C1
* **Secondary Color**: #9CA3AF

## Spacing System

* **2dp** - Micro spacing (icon internal padding)
* **4dp** - Tight spacing (related text elements)
* **8dp** - Small spacing (form element internal padding)
* **16dp** - Standard spacing (default margins and padding)
* **24dp** - Medium spacing (section separation)
* **32dp** - Large spacing (major content blocks)
* **48dp** - Extra large spacing (screen edges and major sections)
* **64dp** - Hero spacing (title to content separation)

## Motion & Animation

### Transition Philosophy
* **Magical Flow**: All transitions should feel like pages turning or magic happening
* **Gentle Movement**: Nothing harsh or startling (child-friendly)
* **Meaningful Motion**: Every animation should serve the story experience

### Standard Transitions
* **Page Swipes**: 350ms, Custom ease-out with slight bounce
* **Button Interactions**: 150ms, Ease-out
* **Card Selections**: 250ms, Ease-in-out with slight scale
* **Story Generation**: 600ms pulsing animations with floating elements

### Special Animations
* **Story Complete**: Magical sparkle shower, 1200ms
* **Page Turn**: Book page curl effect, 400ms
* **Loading States**: Continuous floating motion, 2000ms loop
* **Success Feedback**: Gentle bounce and glow, 500ms

### Accessibility Motion
* **Reduced Motion Support**: All animations respect `prefers-reduced-motion`
* **Alternative Feedback**: Color and text changes when motion is disabled

## Voice & Personality

### Brand Personality
* **Magical**: Sense of wonder and endless possibility
* **Nurturing**: Supportive of parent-child bonding
* **Sophisticated Simplicity**: Complex underneath, simple on surface
* **Trustworthy**: Safe space for family content

### UI Copy Tone
* **Warm**: "Let's create something magical together"
* **Encouraging**: "Your story is being woven with care"
* **Gentle**: Soft language that won't overwhelm tired parents
* **Inclusive**: Stories for every family and every imagination

## Dark Mode Considerations

### Dark Mode Palette
* **Dark Background**: #1A1B23 (warm dark)
* **Dark Surface**: #2D2E36 (slightly lighter for cards)
* **Dark Primary**: #A78BFA (lighter purple for contrast)
* **Dark Text**: #F7FAFC (soft white)
* **Dark Border**: #4A5568 (subtle borders)

### Reading Mode
* **Always Dark**: Story reading uses black background regardless of system preference
* **Focus**: Maximum immersion and eye comfort for bedtime stories


<pontificating>
Merging the warm, encouraging design philosophy of Duolingo with Mayari's magical storytelling concept creates a fascinating opportunity to craft something entirely new - a digital storytelling experience that feels both nurturing and enchanting. 

Where Duolingo uses that vibrant green to signal progress and achievement, Mayari needs colors that evoke wonder, creativity, and the cozy intimacy of bedtime stories. Think deep purples and midnight blues for that magical twilight feeling, warm golds for the spark of imagination, and soft pastels that feel like watercolor illustrations coming to life.

The horizontal flow paradigm is brilliant - it transforms the entire app into one continuous storybook experience. Unlike Duolingo's achievement-focused journey, Mayari's journey is about immersion and discovery. Every swipe should feel like turning a page, with subtle paper texture feedback and gentle transition animations that maintain that precious book-reading ritual.

The character-driven approach of Duolingo translates beautifully here, but instead of Duo the owl, we need ethereal, mystical guidance - perhaps Luna moths or floating story sprites that guide parents through the creation process. The personality shifts from "encouraging teacher" to "magical storyteller companion."

Most critically, this app serves two distinct user types simultaneously: the parent (who creates) and the child (who experiences). The interface must be sophisticated enough for adults but produce something that captivates toddlers. The creation flow needs Duolingo-level clarity and confidence-building, while the reading experience should dissolve into pure magic with zero UI friction.

The typography becomes even more crucial here - we need fonts that feel both modern for parents and storybook-magical for children. The text that burns into the generated images must be large, friendly, and feel hand-lettered rather than digital.

Where Duolingo gamifies learning, Mayari should gamify creativity and family bonding. Instead of streaks, we have "stories shared" or "bedtime adventures." Instead of XP, we have "imagination points" or simply the joy of creating something unique for your child.
</pontificating>