# Mayari - AI-Powered Children's Storybook Generator

Mayari is a Progressive Web App (PWA) that creates personalized children's stories using artificial intelligence. Parents can generate educational explanations or fantasy stories tailored for children aged 2-5 years.

## 🌟 Features

- **Story Creation**: Generate personalized stories using AI (Claude Sonnet 4)
- **Visual Styles**: Choose from 4 different illustration styles
- **Story Types**: Educational explanations or fantasy stories
- **Immersive Reading**: Swipe-based navigation with embedded text
- **PWA**: Works offline with app-like experience
- **User Accounts**: Save and share stories
- **PDF Export**: Export stories for printing

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components based on Phantom UI design system
- **PWA**: next-pwa
- **Backend**: Supabase (Auth, Database, Storage)
- **AI Services**: 
  - Text: OpenRouter (Claude Sonnet 4)
  - Images: GPT-4 Vision / FLUX.1
- **Deployment**: Vercel + Hetzner Docker

## 📁 Project Structure

```
mayari-pwa/
├── docs/                   # Project documentation
│   ├── technical/         # Technical specifications (PRD, SDD)
│   ├── design/           # Design system and UI components
│   ├── UI-Screens/       # Screenshot collection
│   └── assets/           # Design assets
├── src/                  # Source code
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   ├── lib/            # Utility functions
│   └── types/          # TypeScript definitions
└── public/             # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Supabase account
- OpenRouter account

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mayari-pwa

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenRouter (Claude Sonnet 4)
OPENROUTER_API_KEY=your_openrouter_key

# Image Generation
OPENAI_API_KEY=your_openai_key
```

## 📖 Development

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Individual features
- `hotfix/*` - Production fixes

### Code Standards

- ESLint + Prettier for code formatting
- TypeScript for type safety
- Conventional commits for git messages
- Component-driven development

## 🎨 Design System

Based on Phantom UI with warm, magical theming:

- **Primary Colors**: Soft Blue (#7B9AE0), Deep Navy (#2C3E50), Warm Paper (#FFF8F0)
- **Typography**: Poppins (UI), Georgia (Story text)
- **Components**: Rounded, friendly design optimized for children

## 📱 User Stories

### Epic 1: Core Functionality
- Story creation flow (2-page horizontal navigation)
- AI text and image generation
- Immersive reading experience
- Local story storage

### Epic 2: User Management
- Authentication (login/registration)
- Cloud story storage
- Sharing and PDF export

### Epic 3: PWA Features
- Offline functionality
- Performance optimization
- App-like installation

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Development
```bash
npm run build
npm start
```

### Production (Vercel)
- Automatic deployment on push to `main`
- Environment variables configured in Vercel dashboard

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

*Mayari - Transforming screen time into magical storytelling time.*