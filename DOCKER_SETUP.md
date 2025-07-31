# Mayari PWA - Docker Setup Guide

## 🐳 Docker Setup für AI-Integration

### 📋 Voraussetzungen

- Docker Desktop installiert
- Docker Compose verfügbar
- Node.js 18+ (für lokale Entwicklung)
- OpenRouter API Key
- OpenAI API Key

### 🚀 Schnellstart

#### 1. Environment Setup
```bash
# Kopiere die Environment-Variablen
cp env.example .env.local

# Bearbeite .env.local und füge deine API Keys hinzu
nano .env.local
```

#### 2. Docker Services starten
```bash
# Alle Services starten
docker-compose up -d

# Nur API Service starten
docker-compose up -d mayari-api

# Mit Logs starten
docker-compose up
```

#### 3. Health Check
```bash
# API Health Check
curl http://localhost:3001/api/health

# Redis Health Check
docker-compose exec redis redis-cli ping

# PostgreSQL Health Check
docker-compose exec postgres pg_isready -U mayari_user
```

### 🔧 Service Ports

| Service | Port | URL | Beschreibung |
|---------|------|-----|--------------|
| Mayari API | 3001 | http://localhost:3001 | AI Integration API |
| Redis | 6379 | redis://localhost:6379 | Caching & Sessions |
| PostgreSQL | 5432 | postgresql://localhost:5432 | Lokale DB (optional) |

### 📁 Projektstruktur

```
mayari-pwa/
├── docker-compose.yml          # Docker Services
├── Dockerfile.api             # API Container
├── .dockerignore              # Docker Excludes
├── env.example               # Environment Template
├── src/
│   └── app/
│       └── api/
│           └── health/
│               └── route.ts   # Health Check
└── .env.local                # Deine Environment (nicht in Git)
```

### 🛠️ Docker Commands

#### Development
```bash
# Services starten
docker-compose up -d

# Services stoppen
docker-compose down

# Services neu starten
docker-compose restart

# Logs anzeigen
docker-compose logs -f mayari-api

# In Container einsteigen
docker-compose exec mayari-api sh
```

#### Troubleshooting
```bash
# Container Status
docker-compose ps

# Container Logs
docker-compose logs mayari-api

# Container neu bauen
docker-compose build --no-cache mayari-api

# Volumes löschen
docker-compose down -v
```

### 🔍 Monitoring

#### Health Checks
- **API**: `GET http://localhost:3001/api/health`
- **Redis**: `docker-compose exec redis redis-cli ping`
- **PostgreSQL**: `docker-compose exec postgres pg_isready`

#### Logs
```bash
# Alle Logs
docker-compose logs

# API Logs
docker-compose logs mayari-api

# Redis Logs
docker-compose logs redis

# PostgreSQL Logs
docker-compose logs postgres
```

### 🚨 Troubleshooting

#### Port bereits belegt
```bash
# Ports prüfen
lsof -i :3001
lsof -i :6379
lsof -i :5432

# Alternative Ports in docker-compose.yml ändern
```

#### Container startet nicht
```bash
# Container Logs prüfen
docker-compose logs mayari-api

# Container neu bauen
docker-compose build --no-cache

# Environment prüfen
docker-compose config
```

#### API nicht erreichbar
```bash
# Container Status prüfen
docker-compose ps

# Health Check
curl http://localhost:3001/api/health

# Container Logs
docker-compose logs mayari-api
```

### 🎯 Nächste Schritte

1. ✅ Docker Setup (fertig)
2. 🔄 OpenRouter Integration
3. 🔄 Story Generation API
4. 🔄 Frontend Integration
5. 🔄 Image Generation API

### 📊 Success Metrics

- [ ] Docker Container startet erfolgreich
- [ ] Health Check Endpoint antwortet
- [ ] Environment Variables geladen
- [ ] Redis Connection funktioniert
- [ ] PostgreSQL Connection funktioniert (optional)

### 🔐 Security Notes

- `.env.local` ist in `.gitignore` (nicht in Git committen)
- API Keys nur in Environment Variables
- Container laufen als non-root User
- Health Checks für Monitoring
- Volumes für persistente Daten 