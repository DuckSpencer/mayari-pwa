# Mayari PWA - AI Integration Plan

## 🎯 Phase 1: AI Integration Foundation

### 📋 Todo-Liste

#### 1. Docker Setup & Environment (Priority: HIGH)
- [ ] Docker Compose für Development
- [ ] Environment Variables Setup (.env.local)
- [ ] OpenRouter API Integration
- [ ] OpenAI API Integration (FLUX.1)
- [ ] Health Check Endpoints

#### 2. API Architecture (Priority: HIGH)
- [ ] Next.js API Routes erweitern
- [ ] Story Generation Service
- [ ] Image Generation Service
- [ ] Prompt Templates System
- [ ] Error Handling & Rate Limiting

#### 3. Database Schema (Priority: MEDIUM)
- [ ] Stories Table erweitern (AI metadata)
- [ ] Prompts Table
- [ ] Generated Images Table
- [ ] User Preferences Table

#### 4. Frontend Integration (Priority: MEDIUM)
- [ ] Story Generation UI
- [ ] Image Generation UI
- [ ] Loading States
- [ ] Error Handling
- [ ] Progress Indicators

#### 5. Testing & Quality (Priority: MEDIUM)
- [ ] Unit Tests für AI Services
- [ ] Integration Tests
- [ ] E2E Tests
- [ ] Performance Monitoring

## 🏗️ Best Practice Architecture

### Docker Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  mayari-api:
    build: ./api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./api:/app
      - /app/node_modules
```

### API Structure
```
src/
├── app/
│   └── api/
│       ├── stories/
│       │   ├── generate/
│       │   │   └── route.ts
│       │   └── route.ts
│       ├── images/
│       │   ├── generate/
│       │   │   └── route.ts
│       │   └── route.ts
│       └── prompts/
│           └── route.ts
├── lib/
│   ├── ai/
│   │   ├── openrouter.ts
│   │   ├── openai.ts
│   │   └── prompts.ts
│   └── supabase.ts
└── types/
    └── ai.ts
```

## 🚀 Implementation Steps

### Step 1: Docker Environment Setup
1. Docker Compose konfigurieren
2. Environment Variables definieren
3. API Service Container erstellen
4. Health Checks implementieren

### Step 2: AI Service Integration
1. OpenRouter Client implementieren
2. OpenAI Client implementieren
3. Prompt Templates System
4. Error Handling & Retry Logic

### Step 3: Database Schema Updates
1. Stories Table erweitern
2. AI Metadata speichern
3. Generated Content verwalten

### Step 4: Frontend Integration
1. Story Generation UI
2. Image Generation UI
3. Loading States
4. Error Handling

## 🔧 Technical Decisions

### Docker + PWA Compatibility
- ✅ Docker für Backend Services
- ✅ Next.js PWA bleibt unverändert
- ✅ API Communication über HTTP
- ✅ Environment Variables für Secrets

### API Design
- RESTful Endpoints
- JSON Response Format
- Proper Error Codes
- Rate Limiting
- Request/Response Logging

### Security
- API Keys in Environment Variables
- Request Validation
- CORS Configuration
- Rate Limiting per User

## 📊 Success Metrics
- [ ] Story Generation < 30s
- [ ] Image Generation < 60s
- [ ] 99% API Uptime
- [ ] < 100ms API Response Time
- [ ] Zero Security Vulnerabilities

## 🎯 Next Immediate Actions
1. Docker Compose Setup
2. OpenRouter Integration
3. Basic Story Generation API
4. Frontend Integration Test 