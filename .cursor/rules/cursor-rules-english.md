# Cursor Rules for aInvestFeed

## General Principles

- **Clean Code**: Use SOLID principles and clean architecture
- **TypeScript First**: All .js files should be .ts with strict typing
- **Error Handling**: Implement complete error handling with try-catch and logging
- **Security First**: All endpoints protected with authentication and authorization
- **Performance**: Optimize all database queries and use caching

## Naming Conventions

### Backend (Node.js/Express)

```typescript
// Files and directories
controllers/   // PascalCase for classes
services/      // camelCase for functions
models/        // PascalCase for classes
middlewares/   // camelCase for functions
utils/         // camelCase for functions

// Variables and functions
const getUserById = (id: string): Promise<User> => {}
class UserController {}
interface ApiResponse<T> {}
type UserRole = 'admin' | 'power' | 'user'
```

### Frontend (React/TypeScript)

```typescript
// React Components - PascalCase
const NewsFeedCard: React.FC<Props> = () => {}

// Custom hooks - camelCase with use prefix
const useAuthContext = () => {}

// Utilities and functions - camelCase
const formatDate = (date: Date): string => {}

// Constants - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
```

## Directory Structure

### Backend

```text
src/
├── config/           # Configurations (DB, auth, etc.)
├── controllers/      # Route handlers
├── services/         # Business logic
├── models/          # TypeORM entities
├── middlewares/     # Express middlewares
├── utils/           # Helper functions
├── types/           # TypeScript interfaces/types
├── scripts/         # Database seeds, migrations
└── tests/           # Unit and integration tests
```

### Frontend

```text
src/
├── components/      # Reusable components
├── pages/          # Page components
├── hooks/          # Custom hooks
├── services/       # API calls
├── utils/          # Helper functions
├── types/          # TypeScript types
├── contexts/       # React contexts
└── assets/         # Images, fonts, etc.
```

## Code Standards

### Error Handling

```typescript
// ✓ Correct
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error, context: 'operation' });
  throw new AppError('Operation failed', 500);
}

// ✗ Wrong
const result = await riskyOperation(); // No error handling
```

### API Responses

```typescript
// ✓ Standard response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
```

### Database Queries

```typescript
// ✓ Use connection pooling and prepared statements
const user = await dataSource
  .getRepository(User)
  .findOne({ 
    where: { id }, 
    relations: ['roles'],
    cache: 60000 // 1 minute cache
  });

// ✗ Raw queries without prepared statements
const user = await query(`SELECT * FROM users WHERE id = ${id}`);
```

## Security

### JWT Authentication

```typescript
// ✓ Authentication middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(403).json({ success: false, error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

### Data Validation

```typescript
// ✓ Use joi or zod for validation
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'power', 'user'])
});

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    createUserSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid input data' });
  }
};
```

## Performance

### Redis Caching

```typescript
// ✓ Implement caching for frequently accessed data
export class NewsService {
  private redis = new Redis(process.env.REDIS_URL!);
  
  async getNews(page: number = 1): Promise<News[]> {
    const cacheKey = `news:page:${page}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    const news = await this.newsRepository.find({
      skip: (page - 1) * 20,
      take: 20,
      order: { publishedAt: 'DESC' }
    });
    
    await this.redis.setex(cacheKey, 300, JSON.stringify(news)); // 5 min cache
    return news;
  }
}
```

### Database Optimization

```typescript
// ✓ Use indexes and query optimization
@Entity()
@Index(['publishedAt', 'state']) // Compound index for frequent filters
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'text' })
  @Index() // Index for text searches
  title: string;
  
  @Column({ type: 'timestamptz' })
  @Index() // Index for chronological sorting
  publishedAt: Date;
}
```

## Testing

### Unit Tests with Jest

```typescript
// ✓ Test business logic
describe('NewsService', () => {
  let service: NewsService;
  let mockRepository: jest.Mocked<Repository<News>>;
  
  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new NewsService(mockRepository);
  });
  
  it('should return cached news when available', async () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
// ✓ Test complete endpoints
describe('GET /api/news', () => {
  it('should return paginated news with auth', async () => {
    const token = await getValidToken();
    const response = await request(app)
      .get('/api/news?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
      
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(10);
  });
});
```

## Logging and Monitoring

### Structured Logging

```typescript
// ✓ Use structured logging
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('User created', { userId, email, action: 'user_creation' });
logger.error('Database connection failed', { error: error.message, stack: error.stack });
```

## React/Frontend Specific

### Component Structure

```typescript
// ✓ Component with typed props and error handling
interface NewsCardProps {
  news: News;
  onAnalysisClick: (newsId: string) => void;
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({ 
  news, 
  onAnalysisClick, 
  className = '' 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await onAnalysisClick(news.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [news.id, onAnalysisClick]);
  
  if (error) {
    return <ErrorMessage message={error} onRetry={handleClick} />;
  }
  
  return (
    <div className={`news-card ${className}`}>
      {/* Component JSX */}
    </div>
  );
};
```

### Custom Hooks

```typescript
// ✓ Custom hook for API calls
export const useNews = (page: number = 1) => {
  const [data, setData] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsAPI.getNews(page);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, [page]);
  
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);
  
  return { data, loading, error, refetch: fetchNews };
};
```

## AI/Ollama Integration

### Service Structure

```typescript
// ✓ AI Service with error handling and timeouts
export class AIAnalysisService {
  private ollama: Ollama;
  private redis: Redis;
  
  constructor() {
    this.ollama = new Ollama({ 
      host: process.env.OLLAMA_HOST,
      timeout: 30000 // 30s timeout
    });
    this.redis = new Redis(process.env.REDIS_URL!);
  }
  
  async analyzeNews(newsContent: string): Promise<AnalysisResult> {
    const cacheKey = `analysis:${hashContent(newsContent)}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    try {
      const summary = await this.generateSummary(newsContent);
      const analysis = await this.generateAnalysis(newsContent);
      
      const result: AnalysisResult = { summary, analysis };
      await this.redis.setex(cacheKey, 3600, JSON.stringify(result)); // 1h cache
      
      return result;
    } catch (error) {
      logger.error('AI analysis failed', { error, contentLength: newsContent.length });
      throw new AppError('Analysis service unavailable', 503);
    }
  }
}
```

## Deployment and Docker

### Dockerfile Standards

```dockerfile
# ✓ Multi-stage build for production
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS runtime
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .
USER nodejs
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

### Secure Configuration

```typescript
// ✓ Validate all environment variables at startup
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  OLLAMA_HOST: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

On each implementation or change of frontend, @interface manages the graphical interface

These rules must be followed strictly to ensure consistency, security, and maintainability of the code in aInvestFeed.
