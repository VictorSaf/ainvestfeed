# aInvestFeed Commands for Cursor

## Commands for AI Agents

### Setup and Configuration

@setup-backend

Create complete backend structure with Node.js and TypeScript:

- Configure package.json with all necessary dependencies
- Create directory structure (controllers, services, models, middlewares)
- Configure TypeORM wth PostgreSQL
- Implement logging system with Winston
- Configure environment variables with validation
- Add security middlewares (helmet, cors, rate limiting)

@setup-frontend

Create React application with TypeScript and Tailwind:

- Configure Create React App with TypeScript
- Install and configure Tailwind CSS
- Create component directory structure
- Configure React Router for navigation
- Add Context API for state management
- Configure axios for API calls

@setup-mobile

Create React Native application with Expo:

- Initialize Expo project with TypeScript
- Configure navigation with React Navigation
- Add libraries for push notifications
- Configure store management (Zustand/Redux)
- Add cross-platform UI components

@setup-docker

Create Docker configuration for entire application:

- Dockerfiles for backend, frontend and auxiliary services
- docker-compose.yml with PostgreSQL, Redis, Ollama
- Development and production configurations
- Build and deployment scripts
- Health checks and monitoring

### Database and Models

@create-database-models

Implement all TypeORM entities based on documentation schema:

- User, UserSession, UserEvents
- News, AnalysisSummary, AnalysisDetail
- ContentItems, ScrapingConfigs, ScrapingRuns
- AIModels, AIPresets
- Implement relationships between entities
- Add validations and constraints

@create-migrations

Generate database migrations:

- Migrations for table creation
- Indexes for optimization
- Seed data for roles and initial configurations
- Backup and restore scripts

@optimize-database

Optimize database performance:

- Add indexes for frequent queries
- Configure connection pooling with pg-pool
- Implement partitioning for large tables
- Optimize queries with EXPLAIN ANALYZE

### Authentication and Security

@implement-auth

Implement complete authentication system:

- JWT token generation and validation
- Middleware for route protection
- Role-based access control (admin, power, user)
- Password hashing with bcrypt
- Session management
- Logout and token invalidation

@add-security-middleware

Add all security middlewares:

- Rate limiting with Redis
- Input validation with Joi/Zod
- SQL injection protection
- XSS protection with helmet
- CORS configuration
- Request sanitization

@implement-2fa

Add two-factor authentication:

- TOTP with Google Authenticator
- SMS verification (optional)
- Backup codes for recovery
- QR code generation for setup

### News Processing

@implement-scraping

Create news scraping system:

- PyGoogleNews integration
- RSS feed processing
- Content deduplication with hashing
- Automatic scheduling with node-cron
- Error handling and retry logic
- Monitoring logging

@create-news-pipeline

Implement complete news processing pipeline:

- News collection and cleaning
- Queue management for processing
- Content validation and filtering
- Automatic categorization
- Publishing workflow

### AI Analysis Engine

@setup-ollama-integration

Implement Ollama integration for AI analysis:

- Connection management and health checks
- Model selection and configuration
- Request/response handling
- Error handling and fallbacks
- Performance monitoring
- Cache management with Redis

@create-ai-agents

Implement AI agents for news analysis:

- Agent 1: Summarizer with prompt optimization
- Agent 2: Analyzer for financial recommendations
- Multi-agent orchestration
- Result aggregation and validation
- Token usage tracking
- Response time optimization

@implement-ai-config

Create Admin interface for AI configuration:

- Model selection and parameters
- Prompt management and testing
- Performance metrics and monitoring
- A/B testing for prompt optimization
- Cost tracking and limits

### API Layer

@create-rest-api

Implement all REST endpoints:

- Authentication endpoints (/auth/login, /auth/register)
- News endpoints (/news, /news/:id)
- Analysis endpoints (/analysis, /analysis/:id)
- User management (/users, /profile)
- Admin endpoints (/admin/*)
- Proper HTTP status codes and error handling

@add-api-documentation

Generate API documentation with OpenAPI/Swagger:

- Schema definitions for all models
- Endpoint documentation with examples
- Authentication requirements
- Error response formats
- Interactive API explorer
- Postman collection export

@implement-graphql

Add GraphQL as REST alternative (optional):

- Schema definition with TypeGraphQL
- Resolvers for all queries and mutations
- DataLoader for N+1 problem
- Subscriptions for real-time updates
- GraphQL Playground for development

### Frontend Development

@create-news-feed

Implement main news feed component:

- Infinite scrolling with lazy loading
- Real-time updates with WebSocket/SSE
- Filtering and sorting options
- Mobile-first card-based layout
- Pull-to-refresh functionality
- Offline support with service workers

@create-admin-dashboard

Build Admin dashboard:

- AI configuration interface
- Scraping management
- User management
- Analytics and metrics
- System monitoring
- Bulk operations

@implement-responsive-ui

Create responsive interface with Tailwind:

- Mobile-first design principles
- Dark/light theme support
- Accessibility (WCAG 2.1)
- Touch-friendly interactions
- Performance optimized components
- Cross-browser compatibility

### Mobile App Development

@create-mobile-ui

Develop mobile interface with React Native:

- Tab navigation with React Navigation
- Pull-to-refresh and infinite scroll
- Biometric authentication
- Push notifications handling
- Offline synchronization
- Deep linking support

@implement-push-notifications

Add complete push notifications:

- FCM/APNS configuration
- Device token management
- Notification scheduling
- Custom notification actions
- Engagement analytics
- A/B testing for messaging

### Performance and Optimization

@implement-caching

Add complete caching system:

- Redis for application cache
- Browser caching with proper headers
- CDN integration for assets
- Query result caching
- Cache invalidation strategies
- Performance monitoring

@optimize-performance

Optimize application performance:

- Bundle optimization with Webpack
- Code splitting and lazy loading
- Image optimization and compression
- Database query optimization
- Memory leak detection
- Performance profiling

### Monitoring and Analytics

@setup-monitoring

Implement complete monitoring:

- Application metrics with Prometheus
- Error tracking with Sentry
- Performance monitoring with New Relic/DataDog
- Uptime monitoring
- Alert configuration
- Dashboard creation

@implement-analytics

Add analytics system:

- User behavior tracking
- Business metrics collection
- Custom events and conversions
- Privacy-compliant data collection
- Real-time analytics dashboard
- Export capabilities

### Testing and QA

@setup-testing

Configure complete testing framework:

- Unit tests with Jest
- Integration tests with Supertest
- E2E tests with Playwright/Cypress
- Component testing with React Testing Library
- API testing with Postman/Newman
- Performance testing with K6

@create-test-data

Generate test data and mocks:

- Database seeds for development
- API mocks for frontend testing
- Test user accounts with different roles
- Sample news articles for testing
- Performance test scenarios

### CI/CD and Deployment

@setup-cicd

Configure CI/CD pipelines:

- GitHub Actions workflows
- Automated testing on multiple branches
- Docker build and push
- Security scanning with Snyk/CodeQL
- Deployment strategies (blue/green, rolling)
- Environment management

@deploy-production

Prepare production deployment:

- Docker Compose for orchestration
- Load balancer configuration
- SSL certificate setup
- Backup strategies
- Disaster recovery plan
- Monitoring and alerting

### Debugging and Maintenance

@debug-performance

Instrument application for debugging:

- Request tracing with correlation IDs
- Performance profiling
- Memory usage monitoring
- SQL query analysis
- Error reproduction tools
- Load testing scenarios

@setup-maintenance

Create maintenance tools:

- Database cleanup scripts
- Log rotation and archiving
- Health check endpoints
- Maintenance mode functionality
- Data migration tools
- System diagnostics

## Quick Commands for Specific Tasks

@fix-cors

Quickly fix CORS issues for development and production

@add-rate-limiting

Implement rate limiting for API endpoints with different configurations

@setup-ssl

Configure HTTPS with Let's Encrypt for production

@create-backup-script

Generate automated database backup script

@optimize-images

Implement automatic image optimization (compression, WebP)

@add-health-checks

Add endpoints for health checking and readiness probes

@setup-secrets

Configure secure secrets management (dotenv, vault)

@create-api-client

Generate client SDK for API in TypeScript

These commands should be used as prompts for AI agents in Cursor to accelerate aInvestFeed application development.
