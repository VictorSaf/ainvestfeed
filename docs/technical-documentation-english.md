# Detailed Technical Documentation - aInvestFeed

## Executive Summary

aInvestFeed is a next-generation financial intelligence platform that combines automatic news aggregation with multi-agent AI analysis to provide precise and actionable trading recommendations. The application serves traders, investors, and financial analysts by providing a clean, noise-free feed updated in real-time.

### Main Objectives

- **Speed**: Reduce time between news appearance and informed trading decision
- **Precision**: Multi-agent AI analysis for BUY/SELL/HOLD recommendations with confidence scores
- **Accessibility**: Mobile-first design and intuitive interface
- **Scalability**: Cloud-native architecture prepared for exponential growth

## System Architecture

### Technology Overview

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Mobile     │    │     Web      │    │    Admin     │
│    Apps      │    │   Frontend   │    │   Portal     │
│(React Native)│    │   (React)    │    │   (React)    │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                    │
       └───────────────────┼────────────────────┘
                          │
              ┌───────────┴───────────┐
              │    API Gateway        │
              │  (Express.js + JWT)   │
              └───────────┬───────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────┴──────┐ ┌────────┴──────┐ ┌───────┴──────┐
│   News       │ │      AI       │ │    User      │
│  Service     │ │   Analysis    │ │   Service    │
│(Aggregation) │ │    Service    │ │(Auth/Profile)│
└───────┬──────┘ └────────┬──────┘ └───────┬──────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
    ┌──────┬──────┬───────┼───────┬──────┬──────┐
    │      │      │       │       │      │      │
┌───┴──┐┌──┴──┐┌──┴──┐┌───┴──┐┌──┴──┐┌──┴──┐
│ Post-││Redis││Ollama││Queue││Files││Elastic│
│ gres ││Cache││AI    ││     ││Store││Search│
└──────┘└─────┘└──────┘└─────┘└─────┘└──────┘
```

### Detailed Technology Stack

#### Backend

- **Framework**: Node.js 18+ with Express.js and TypeScript
- **Database**: PostgreSQL 15+ with TypeORM as ORM
- **Caching**: Redis 7+ for session store and application cache
- **AI Engine**: Ollama with LLaMA, Mistral models for local analysis
- **Authentication**: JWT with refresh tokens, bcrypt for passwords
- **Job Processing**: Node-cron for recurring tasks
- **Logging**: Winston with structured logging
- **Monitoring**: Prometheus metrics, Sentry for error tracking

#### Frontend Web

- **Framework**: React 18 with TypeScript and Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state, React Query for server state
- **Routing**: React Router v6 with lazy loading
- **Icons**: Lucide React for visual consistency
- **Testing**: Jest + React Testing Library

#### Mobile Apps

- **Framework**: React Native with Expo SDK 51+
- **Navigation**: React Navigation v6 with tab and stack navigators
- **State**: Zustand cross-platform
- **Notifications**: Expo Notifications with FCM/APNS
- **Storage**: Expo Secure Store for sensitive tokens
- **Updates**: Expo OTA for rapid deployment

#### Infrastructure

- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose for development
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Monitoring**: Grafana dashboards, Uptime monitoring
- **Security**: Let's Encrypt SSL, security headers, rate limiting

## Data Model

### Core Entities

#### Users & Authentication

```sql
-- User management with role-based access
CREATE TYPE user_role AS ENUM ('admin', 'power', 'user');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  email_verified_at TIMESTAMPTZ,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  device_info JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
```

#### News & Content

```sql
CREATE TYPE market_type AS ENUM ('Stocks', 'Forex', 'Crypto', 'Commodities', 'Indices');
CREATE TYPE publish_state AS ENUM ('draft', 'analyzing', 'ready', 'published', 'archived');

CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  canonical_url TEXT, -- For deduplication
  title TEXT NOT NULL,
  excerpt TEXT,
  content_raw TEXT,
  content_clean TEXT,
  content_hash TEXT NOT NULL, -- For deduplication
  language TEXT DEFAULT 'en',
  market market_type,
  source_name TEXT,
  author TEXT,
  published_at_source TIMESTAMPTZ,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  state publish_state NOT NULL DEFAULT 'draft',
  metadata JSONB,
  image_urls TEXT[],
  tags TEXT[]
);

-- Optimized indexes for frequent queries
CREATE UNIQUE INDEX idx_news_content_hash ON news(content_hash);
CREATE INDEX idx_news_published ON news(published_at_source DESC);
CREATE INDEX idx_news_market ON news(market);
CREATE INDEX idx_news_state ON news(state);
CREATE INDEX idx_news_scraped ON news(scraped_at DESC);
```

#### AI Analysis

```sql
CREATE TYPE recommendation AS ENUM ('BUY', 'SELL', 'HOLD');
CREATE TYPE instrument_category AS ENUM ('equity', 'forex', 'crypto', 'commodity', 'index', 'etf', 'bond');

CREATE TABLE analysis_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  model_used TEXT NOT NULL,
  summary_text TEXT NOT NULL,
  key_points TEXT[],
  sentiment NUMERIC(3,2), -- -1.00 to 1.00
  tokens_used INTEGER,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE analysis_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  model_used TEXT NOT NULL,
  instrument_symbol TEXT,
  instrument_name TEXT,
  instrument_category instrument_category,
  market market_type,
  recommendation recommendation,
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  price_target NUMERIC(12,4),
  reasoning TEXT,
  risk_factors TEXT[],
  time_horizon TEXT,
  analysis_json JSONB,
  tokens_used INTEGER,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for analytics and querying
CREATE INDEX idx_analysis_summary_news ON analysis_summary(news_id);
CREATE INDEX idx_analysis_detail_news ON analysis_detail(news_id);
CREATE INDEX idx_analysis_detail_symbol ON analysis_detail(instrument_symbol);
CREATE INDEX idx_analysis_detail_recommendation ON analysis_detail(recommendation);
CREATE INDEX idx_analysis_detail_confidence ON analysis_detail(confidence_score DESC);
```

### Performance Optimizations

#### Partitioning for Scale

```sql
-- Date-based partitioning for news table
CREATE TABLE news_y2024m01 PARTITION OF news
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- User-based partitioning for user_events
CREATE TABLE user_events_0 PARTITION OF user_events
  FOR VALUES WITH (MODULUS 10, REMAINDER 0);
```

#### Materialized Views for Analytics

```sql
CREATE MATERIALIZED VIEW daily_analysis_stats AS
SELECT 
  DATE(created_at) as analysis_date,
  COUNT(*) as total_analyses,
  AVG(confidence_score) as avg_confidence,
  COUNT(*) FILTER (WHERE recommendation = 'BUY') as buy_count,
  COUNT(*) FILTER (WHERE recommendation = 'SELL') as sell_count,
  COUNT(*) FILTER (WHERE recommendation = 'HOLD') as hold_count,
  AVG(latency_ms) as avg_latency
FROM analysis_detail 
GROUP BY DATE(created_at);

-- Automatic refresh with pg_cron
SELECT cron.schedule('refresh-daily-stats', '0 1 * * *', 'REFRESH MATERIALIZED VIEW daily_analysis_stats;');
```

## Detailed Data Flow

### 1. News Collection Pipeline

```
RSS Sources → PyGoogleNews → Content Extraction → Deduplication → Storage
     ↓              ↓              ↓               ↓            ↓
- Google News  - HTTP fetch   - Title/Content  - Hash check - PostgreSQL
- Financial    - Parse RSS    - Clean HTML     - URL canon  - Raw content
  sources      - Rate limit   - Extract meta   - Skip dupes - Metadata
- Custom feeds - Retry logic  - Language det   - Log stats  - Queue for AI
```

### 2. AI Analysis Pipeline

```
Raw News → Queue → Agent 1 (Summarizer) → Agent 2 (Analyzer) → Results Storage
    ↓        ↓           ↓                      ↓                    ↓
- Batched  - Redis   - Ollama API          - Ollama API        - PostgreSQL
- Priority - FIFO    - LLaMA/Mistral       - Financial model   - Analysis tables
- Retry    - Rate    - Generate summary    - BUY/SELL/HOLD     - Confidence scores
- Monitor  - limit   - Extract key points  - Risk assessment   - Performance metrics
```

### 3. Content Publishing Pipeline

```
Analysis Results → Content Assembly → Publishing Queue → News Feed → Notifications
        ↓                ↓                  ↓              ↓            ↓
- Summary ready    - Combine data      - Publish rules  - Real-time   - Push FCM/APNS
- Detail ready     - Generate cards    - Schedule time  - WebSocket   - Email digest
- Quality check    - Format response   - User segments  - Pagination  - SMS alerts
- Confidence min   - Cache prep        - Rate control   - Filtering   - In-app badges
```

## Security and Authentication

### JWT Implementation

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  iat: number;
  exp: number;
  jti: string; // JWT ID for invalidation
}

interface RefreshToken {
  userId: string;
  tokenId: string;
  deviceFingerprint: string;
  expiresAt: Date;
  lastUsedAt: Date;
}
```

### Security Layers

1. **Network Security**
   - HTTPS enforcement with HSTS headers
   - Rate limiting with Redis (100 req/min per IP)
   - DDoS protection with Cloudflare
   - Geo-blocking for high-risk regions

2. **Application Security**
   - Input validation with Joi/Zod schemas
   - SQL injection prevention with parameterized queries
   - XSS protection with Content Security Policy
   - CSRF tokens for state-changing operations

3. **Data Security**
   - Password hashing with bcrypt (salt rounds: 12)
   - Sensitive data encryption with AES-256
   - PII tokenization for compliance
   - Database encryption at rest

### Role-Based Access Control

```typescript
const permissions = {
  admin: [
    'read:all', 'write:all', 'delete:all',
    'manage:users', 'manage:ai', 'manage:scraping'
  ],
  power: [
    'read:all', 'write:own', 'export:reports',
    'create:alerts', 'view:analytics'
  ],
  user: [
    'read:published', 'write:own', 'create:bookmarks'
  ]
};
```

## AI Integration Architecture

### Ollama Service Integration

```typescript
class OllamaService {
  private baseUrl = process.env.OLLAMA_HOST;
  private readonly models = {
    summarizer: 'llama3.1:8b',
    analyzer: 'mistral:7b-instruct'
  };

  async generateSummary(content: string): Promise<SummaryResult> {
    const prompt = this.buildSummaryPrompt(content);
    return this.callModel(this.models.summarizer, prompt, {
      temperature: 0.3,
      max_tokens: 300,
      timeout: 30000
    });
  }

  async generateAnalysis(content: string, summary: string): Promise<AnalysisResult> {
    const prompt = this.buildAnalysisPrompt(content, summary);
    return this.callModel(this.models.analyzer, prompt, {
      temperature: 0.1,
      max_tokens: 800,
      timeout: 45000
    });
  }
}
```

### AI Prompt Engineering

```yaml
# Summarizer Agent Prompt Template
summarizer_prompt: |
  You are a financial news summarizer. Create a concise summary of this financial news article.
  
  Rules:
  - Maximum 3 sentences
  - Focus on key financial impact
  - Include numerical data when available
  - Maintain neutral tone
  
  Article: {content}
  
  Summary:

# Analyzer Agent Prompt Template  
analyzer_prompt: |
  You are a financial analyst. Analyze this news and provide trading recommendations.
  
  News Summary: {summary}
  Full Article: {content}
  
  Provide analysis in this JSON format:
  {
    "instrument_symbol": "AAPL",
    "instrument_name": "Apple Inc.",
    "market": "Stocks",
    "recommendation": "BUY|SELL|HOLD",
    "confidence_score": 0-100,
    "reasoning": "Detailed explanation",
    "risk_factors": ["Risk 1", "Risk 2"],
    "price_target": null|number,
    "time_horizon": "1D|1W|1M|3M|1Y"
  }
```

### Multi-Agent Orchestration

```typescript
class AnalysisOrchestrator {
  async processNews(newsItem: News): Promise<ProcessingResult> {
    const pipeline = [
      this.validateContent,
      this.generateSummary,
      this.generateAnalysis,
      this.validateResults,
      this.enrichMetadata,
      this.storeResults
    ];

    let context = { news: newsItem, results: {} };
    
    for (const step of pipeline) {
      try {
        context = await step(context);
      } catch (error) {
        await this.handleStepError(step.name, error, context);
        throw error;
      }
    }

    return context.results;
  }
}
```

## Mobile App Architecture

### React Native Structure

```
mobile/
├── src/
│   ├── components/           # Reusable components
│   │   ├── cards/           # News cards, analysis cards
│   │   ├── forms/           # Login, registration forms
│   │   └── ui/              # Base UI components
│   ├── screens/             # Screen components
│   │   ├── Auth/            # Login, register, forgot password
│   │   ├── News/            # News feed, news detail
│   │   ├── Profile/         # User profile, settings
│   │   └── Analysis/        # Analysis views, filters
│   ├── navigation/          # Navigation configuration
│   ├── services/            # API services, storage
│   ├── hooks/               # Custom React hooks
│   ├── contexts/            # React contexts
│   ├── utils/               # Helper functions
│   └── types/               # TypeScript definitions
```

### Push Notifications Implementation

```typescript
// Notification service
class NotificationService {
  async registerDevice(userId: string): Promise<string> {
    const token = await Notifications.getExpoPushTokenAsync();
    await this.api.post('/devices', {
      userId,
      platform: Platform.OS,
      token: token.data,
      deviceInfo: {
        model: Device.modelName,
        os: Device.osName,
        version: Device.osVersion
      }
    });
    return token.data;
  }

  async handleNotification(notification: Notification) {
    // Deep linking logic
    const { data } = notification.request.content;
    if (data?.newsId) {
      this.navigation.navigate('NewsDetail', { id: data.newsId });
    }
  }
}
```

## Performance Optimization

### Caching Strategy

```typescript
// Multi-level caching architecture
class CacheService {
  // L1: In-memory cache (Node.js)
  private memoryCache = new Map<string, any>();
  
  // L2: Redis cache
  private redis = new Redis(process.env.REDIS_URL);
  
  // L3: CDN cache (Cloudflare)
  
  async get<T>(key: string): Promise<T | null> {
    // Try memory first
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    
    // Try Redis
    const redisValue = await this.redis.get(key);
    if (redisValue) {
      const parsed = JSON.parse(redisValue);
      this.memoryCache.set(key, parsed);
      return parsed;
    }
    
    return null;
  }
}
```

### Database Optimizations

```sql
-- Optimized query for news feed
EXPLAIN (ANALYZE, BUFFERS) 
SELECT n.id, n.title, n.excerpt, n.published_at_source,
       as_.summary_text, ad.recommendation, ad.confidence_score
FROM news n
LEFT JOIN analysis_summary as_ ON n.id = as_.news_id
LEFT JOIN analysis_detail ad ON n.id = ad.news_id
WHERE n.state = 'published' 
  AND n.published_at_source > NOW() - INTERVAL '7 days'
ORDER BY n.published_at_source DESC
LIMIT 20 OFFSET $1;

-- Connection pooling with pgbouncer
max_client_conn = 1000
default_pool_size = 25
max_db_connections = 100
pool_mode = transaction
```

### Frontend Performance

```typescript
// Code splitting with React.lazy
const NewsDetail = React.lazy(() => import('./screens/NewsDetail'));
const Analysis = React.lazy(() => import('./screens/Analysis'));

// Virtualized scrolling for large lists
import { FixedSizeList } from 'react-window';

const NewsFeed: React.FC = () => {
  const renderItem = useCallback(({ index, style }: ListChildComponentProps) => (
    <div style={style}>
      <NewsCard news={news[index]} />
    </div>
  ), [news]);

  return (
    <FixedSizeList
      height={600}
      itemCount={news.length}
      itemSize={200}
      onItemsRendered={({ startIndex, endIndex }) => {
        // Lazy load more items
        if (endIndex > news.length - 5) {
          loadMoreNews();
        }
      }}
    >
      {renderItem}
    </FixedSizeList>
  );
};
```

## Monitoring and Analytics

### Metrics Collection

```typescript
// Application metrics
const metrics = {
  // Business metrics
  news_processed_total: new prometheus.Counter({
    name: 'news_processed_total',
    help: 'Total news articles processed',
    labelNames: ['source', 'status']
  }),
  
  analysis_duration_histogram: new prometheus.Histogram({
    name: 'ai_analysis_duration_seconds',
    help: 'Time taken for AI analysis',
    labelNames: ['model', 'agent'],
    buckets: [0.1, 0.5, 1, 5, 10, 30, 60]
  }),
  
  api_request_duration: new prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'API request duration',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.1, 0.5, 1, 2, 5]
  })
};

// User behavior analytics
interface AnalyticsEvent {
  userId: string;
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  deviceInfo: DeviceInfo;
}
```

### Health Checks

```typescript
// Comprehensive health check endpoint
app.get('/health', async (req, res) => {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'ok',
    services: {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      ollama: await checkOllamaHealth(),
      external_apis: await checkExternalAPIs()
    },
    metrics: {
      memory_usage: process.memoryUsage(),
      uptime: process.uptime(),
      active_connections: getActiveConnections()
    }
  };
  
  const isHealthy = Object.values(checks.services).every(s => s.status === 'ok');
  res.status(isHealthy ? 200 : 503).json(checks);
});
```

## Development and Deployment

### Docker Configuration

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: 
      context: ./backend
      target: development
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgres://user:pass@postgres:5432/ainvestfeed
      REDIS_URL: redis://redis:6379
      OLLAMA_HOST: http://ollama:11434
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis
      - ollama

  frontend:
    build: 
      context: ./frontend
      target: development
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3001/api
    volumes:
      - ./frontend:/app
      - /app/node_modules

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ainvestfeed
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      OLLAMA_MODELS: llama3.1:8b,mistral:7b-instruct

volumes:
  postgres_data:
  redis_data:
  ollama_data:
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: |
            backend/package-lock.json
            frontend/package-lock.json

      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci

      - name: Run tests
        run: |
          cd backend && npm run test:ci
          cd ../frontend && npm run test:ci

      - name: Run E2E tests
        run: npm run test:e2e

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Build and push Docker images
        # Docker build and push to registry
      
      - name: Deploy to staging
        # Deployment with zero-downtime
```

This technical documentation provides a solid foundation for the complete implementation of the aInvestFeed application, covering all critical technical aspects for development, deployment, and maintenance.
