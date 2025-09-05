# Application Runtime Simulation & Testing Framework

## @run-complete-simulation

Execute comprehensive application simulation testing all scenarios, components, and user flows with detailed logging and audit reports.

---

## 1. Pre-Flight Checks

### @run-preflight-validation

Validate environment before simulation starts.

```bash
# Check Prerequisites
□ Node.js version >= 20
□ PostgreSQL running
□ Redis running
□ Docker installed
□ Ports available (3001, 3002, 5432, 5433, 6379)
□ Environment variables configured
□ Dependencies installed (backend/frontend)
□ Database migrations up to date
□ Test data seeded
```

**Output**: `/docs/audit/run_preflight_[timestamp].md`

---

## 2. Infrastructure Simulation

### @run-infrastructure-test

Test all infrastructure components.

```typescript
// Test Sequence
const infrastructureTests = {
  database: {
    connection: 'Test PostgreSQL connection',
    pooling: 'Verify connection pool (min: 5, max: 30)',
    performance: 'Execute benchmark queries',
    failover: 'Simulate connection loss and recovery',
    transactions: 'Test transaction rollback scenarios'
  },
  
  redis: {
    connection: 'Test Redis connection',
    caching: 'Set/Get/Delete operations',
    expiration: 'TTL verification',
    pubsub: 'Test pub/sub channels',
    persistence: 'AOF/RDB backup test'
  },
  
  ollama: {
    connection: 'Test Ollama API availability',
    models: 'Verify model loading (llama3.1, mistral)',
    inference: 'Test inference with sample text',
    timeout: 'Test timeout handling (30s)',
    fallback: 'Test fallback mechanisms'
  },
  
  storage: {
    filesystem: 'Read/write permissions',
    uploads: 'File upload simulation',
    cleanup: 'Temporary file cleanup'
  }
};
```

**Logging**:

```typescript
interface InfrastructureLog {
  component: string;
  test: string;
  status: 'pass' | 'fail' | 'warning';
  latency: number;
  details: any;
  timestamp: Date;
}
```

**Output**: `/docs/audit/run_infrastructure_[timestamp].md`

---

## 3. Backend API Simulation

### @run-backend-endpoints

Test all API endpoints systematically.

```typescript
// API Test Matrix
const apiTestScenarios = {
  authentication: [
    {
      name: 'User Registration Flow',
      steps: [
        'POST /auth/register - Valid data',
        'POST /auth/register - Duplicate email',
        'POST /auth/register - Invalid email format',
        'POST /auth/register - Weak password',
        'POST /auth/verify-email - Valid token',
        'POST /auth/verify-email - Invalid token',
        'POST /auth/verify-email - Expired token'
      ]
    },
    {
      name: 'Login Flow',
      steps: [
        'POST /auth/login - Valid credentials',
        'POST /auth/login - Invalid password',
        'POST /auth/login - Non-existent user',
        'POST /auth/login - Unverified email',
        'POST /auth/login - Rate limiting (6th attempt)',
        'POST /auth/refresh - Valid refresh token',
        'POST /auth/refresh - Expired refresh token',
        'POST /auth/logout - Valid session'
      ]
    },
    {
      name: '2FA Flow',
      steps: [
        'POST /user/enable-2fa - Generate secret',
        'POST /user/verify-2fa - Valid TOTP',
        'POST /user/verify-2fa - Invalid TOTP',
        'POST /auth/login - With 2FA enabled'
      ]
    }
  ],
  
  news: [
    {
      name: 'News Feed Operations',
      steps: [
        'GET /news - Default pagination',
        'GET /news?page=2&limit=20 - Custom pagination',
        'GET /news?market=stocks - Market filter',
        'GET /news?confidence_min=70 - Confidence filter',
        'GET /news?since=2024-01-01 - Date filter',
        'GET /news - Empty results handling',
        'GET /news/:id - Valid news ID',
        'GET /news/:id - Invalid news ID',
        'GET /news/trending - Trending news',
        'GET /news/instruments/AAPL - By symbol'
      ]
    },
    {
      name: 'News Interactions',
      steps: [
        'POST /news/:id/bookmark - Add bookmark',
        'POST /news/:id/bookmark - Remove bookmark',
        'POST /news/:id/bookmark - Toggle idempotency',
        'GET /user/bookmarks - List bookmarks'
      ]
    }
  ],
  
  analysis: [
    {
      name: 'AI Analysis Retrieval',
      steps: [
        'GET /analysis - All analyses',
        'GET /analysis?recommendation=BUY - Filter by recommendation',
        'GET /analysis?confidence_min=80 - High confidence only',
        'GET /analysis?market=crypto - Market specific',
        'GET /analysis/instruments - Analyzed instruments',
        'GET /analysis/summary?period=7d - Weekly summary'
      ]
    }
  ],
  
  search: [
    {
      name: 'Search Functionality',
      steps: [
        'GET /search?q=apple - Simple search',
        'GET /search?q=apple&type=news - Type filter',
        'GET /search?q=apple&market=stocks - Market filter',
        'GET /search/suggestions?q=app - Autocomplete',
        'GET /search?q= - Empty query handling',
        'GET /search?q=' + 'x'.repeat(1000) + ' - Long query'
      ]
    }
  ],
  
  admin: [
    {
      name: 'Admin Operations',
      steps: [
        'GET /admin/users - List users (admin token)',
        'GET /admin/users - Forbidden (user token)',
        'PUT /admin/users/:id - Update user role',
        'GET /admin/ai/models - List AI models',
        'POST /admin/ai/models/:id/test - Test model',
        'GET /admin/scraping/configs - Get configs',
        'POST /admin/scraping/run - Trigger scraping',
        'GET /admin/system/health - System status'
      ]
    }
  ]
};

// Execute with different user contexts
const userContexts = [
  { role: 'anonymous', token: null },
  { role: 'user', token: 'user_jwt_token' },
  { role: 'power', token: 'power_jwt_token' },
  { role: 'admin', token: 'admin_jwt_token' }
];
```

**Performance Metrics**:

```typescript
interface APIMetrics {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  payloadSize: number;
  memoryUsage: number;
  errors: string[];
  timestamp: Date;
}
```

**Output**: `/docs/audit/run_api_simulation_[timestamp].md`

---

## 4. Frontend UI Simulation

### @run-frontend-flows

Simulate user interactions in the frontend.

```typescript
// UI Test Scenarios
const uiTestFlows = {
  publicUser: [
    'Load homepage',
    'View public news feed',
    'Click news for detail (should redirect to login)',
    'Use search functionality',
    'Switch theme (light/dark)',
    'Check responsive layouts (mobile/tablet/desktop)',
    'Test lazy loading on scroll',
    'Verify SEO meta tags'
  ],
  
  authenticatedUser: [
    'Complete login flow',
    'Navigate to dashboard',
    'Scroll news feed (infinite scroll)',
    'Apply filters (market, confidence)',
    'View news detail modal',
    'Add/remove bookmarks',
    'View AI analysis',
    'Update profile settings',
    'Change password',
    'Enable 2FA',
    'Test session timeout',
    'Logout flow'
  ],
  
  powerUser: [
    'Access analytics dashboard',
    'Export data (CSV/JSON)',
    'Create custom watchlists',
    'Set up alerts',
    'View advanced metrics',
    'Access API documentation'
  ],
  
  adminUser: [
    'Access admin panel',
    'Manage users (CRUD)',
    'Configure AI models',
    'View system metrics',
    'Trigger manual scraping',
    'Review error logs',
    'Update application settings'
  ]
};

// Component Rendering Tests
const componentTests = {
  base: [
    'Button - All variants',
    'Card - All types',
    'Input - All states',
    'Badge - All colors',
    'Modal - Open/close',
    'Toast - All positions'
  ],
  
  financial: [
    'NewsCard - With/without analysis',
    'AnalysisPanel - Expanded/collapsed',
    'RecommendationBadge - BUY/SELL/HOLD',
    'MarketOverview - Real-time updates',
    'InstrumentCard - Price changes',
    'WatchlistWidget - Add/remove items'
  ],
  
  charts: [
    'LineChart - Data updates',
    'CandlestickChart - Zoom/pan',
    'PieChart - Interactive legend',
    'SparklineChart - Mini trends'
  ]
};
```

**Output**: `/docs/audit/run_ui_simulation_[timestamp].md`

---

## 5. Data Flow Simulation

### @run-data-pipeline

Test complete data pipeline from ingestion to display.

```typescript
// Pipeline Simulation
const pipelineSteps = {
  ingestion: {
    steps: [
      'Fetch RSS feed',
      'Parse XML content',
      'Extract article data',
      'Clean HTML content',
      'Calculate content hash',
      'Check for duplicates',
      'Store in database',
      'Queue for analysis'
    ],
    metrics: ['items_processed', 'duplicates_found', 'errors', 'duration']
  },
  
  aiAnalysis: {
    steps: [
      'Fetch from queue',
      'Prepare for Ollama',
      'Generate summary (Agent 1)',
      'Generate analysis (Agent 2)',
      'Calculate confidence',
      'Determine recommendation',
      'Store results',
      'Update news status'
    ],
    metrics: ['tokens_used', 'latency', 'confidence_score', 'model_errors']
  },
  
  publishing: {
    steps: [
      'Check publish criteria',
      'Apply confidence threshold',
      'Update content_items',
      'Invalidate cache',
      'Trigger notifications',
      'Update feed',
      'Emit WebSocket event'
    ],
    metrics: ['published_count', 'rejected_count', 'notification_sent']
  }
};

// Simulate with different data loads
const dataLoadScenarios = [
  { name: 'Light', items: 10 },
  { name: 'Normal', items: 100 },
  { name: 'Heavy', items: 1000 },
  { name: 'Stress', items: 10000 }
];
```

**Output**: `/docs/audit/run_pipeline_[timestamp].md`

---

## 6. Security Simulation

### @run-security-tests

Test security measures and vulnerabilities.

```typescript
const securityTests = {
  authentication: [
    'Brute force protection (rate limiting)',
    'SQL injection attempts',
    'XSS payload injection',
    'CSRF token validation',
    'JWT token manipulation',
    'Session fixation',
    'Password reset token reuse',
    'Privilege escalation attempts'
  ],
  
  authorization: [
    'Access control (user → admin endpoints)',
    'Direct object reference',
    'Path traversal',
    'Resource exhaustion',
    'File upload validation',
    'API key exposure'
  ],
  
  dataProtection: [
    'Sensitive data exposure',
    'Encryption at rest',
    'Encryption in transit',
    'PII handling',
    'GDPR compliance',
    'Audit trail integrity'
  ]
};
```

**Output**: `/docs/audit/run_security_[timestamp].md`

---

## 7. Performance & Load Simulation

### @run-performance-tests

Simulate various load conditions.

```typescript
const performanceScenarios = {
  baseline: {
    users: 1,
    duration: '1m',
    rampUp: '0s'
  },
  
  normal: {
    users: 100,
    duration: '5m',
    rampUp: '30s'
  },
  
  peak: {
    users: 500,
    duration: '10m',
    rampUp: '2m'
  },
  
  stress: {
    users: 1000,
    duration: '15m',
    rampUp: '5m'
  },
  
  spike: {
    users: 2000,
    duration: '2m',
    rampUp: '10s'
  }
};

// Metrics to collect
const performanceMetrics = {
  response: {
    p50: 'Median response time',
    p95: '95th percentile',
    p99: '99th percentile',
    max: 'Maximum response time'
  },
  
  throughput: {
    rps: 'Requests per second',
    tps: 'Transactions per second',
    concurrent: 'Concurrent users'
  },
  
  resources: {
    cpu: 'CPU usage %',
    memory: 'Memory usage MB',
    disk: 'Disk I/O',
    network: 'Network bandwidth'
  },
  
  errors: {
    rate: 'Error rate %',
    types: 'Error categories',
    recovery: 'Recovery time'
  }
};
```

**Output**: `/docs/audit/run_performance_[timestamp].md`

---

## 8. Error & Recovery Simulation

### @run-failure-scenarios

Test error handling and recovery mechanisms.

```typescript
const failureScenarios = {
  database: [
    'Connection loss',
    'Connection pool exhaustion',
    'Long running query timeout',
    'Deadlock situation',
    'Disk full'
  ],
  
  redis: [
    'Connection loss',
    'Memory limit reached',
    'Key expiration during operation',
    'Cluster node failure'
  ],
  
  ai: [
    'Ollama service down',
    'Model loading failure',
    'Inference timeout',
    'Out of memory',
    'Invalid response format'
  ],
  
  network: [
    'API timeout',
    'DNS resolution failure',
    'SSL certificate issues',
    'Rate limit exceeded',
    'CDN failure'
  ],
  
  application: [
    'Memory leak simulation',
    'Infinite loop detection',
    'Unhandled promise rejection',
    'Process crash and restart',
    'Deployment rollback'
  ]
};
```

**Output**: `/docs/audit/run_failures_[timestamp].md`

---

## 9. Mobile Simulation

### @run-mobile-tests

Test mobile-specific scenarios.

```typescript
const mobileScenarios = {
  connectivity: [
    'Offline mode',
    'Slow 3G',
    'Network switching',
    'Airplane mode toggle',
    'Background sync'
  ],
  
  gestures: [
    'Pull to refresh',
    'Swipe navigation',
    'Pinch to zoom',
    'Long press actions',
    'Shake to report'
  ],
  
  notifications: [
    'Push notification delivery',
    'In-app notification',
    'Badge count update',
    'Deep linking',
    'Background notifications'
  ],
  
  performance: [
    'Battery usage',
    'Memory usage',
    'Storage usage',
    'App size',
    'Startup time'
  ]
};
```

**Output**: `/docs/audit/run_mobile_[timestamp].md`

---

## 10. Integration Tests

### @run-integration-suite

Test third-party integrations.

```typescript
const integrationTests = {
  external: [
    'RSS feed sources availability',
    'OAuth providers',
    'Payment gateway (if applicable)',
    'Email service',
    'SMS service',
    'Push notification service'
  ],
  
  monitoring: [
    'Prometheus metrics export',
    'Sentry error reporting',
    'Log aggregation',
    'Health check endpoints'
  ]
};
```

**Output**: `/docs/audit/run_integrations_[timestamp].md`

---

## 11. Report Generation

### @generate-simulation-report

Create comprehensive simulation report.

```typescript
interface SimulationReport {
  summary: {
    startTime: Date;
    endTime: Date;
    duration: number;
    totalTests: number;
    passed: number;
    failed: number;
    warnings: number;
    coverage: number;
  };
  
  sections: {
    infrastructure: TestResults;
    api: TestResults;
    frontend: TestResults;
    pipeline: TestResults;
    security: TestResults;
    performance: TestResults;
    failures: TestResults;
    mobile: TestResults;
    integrations: TestResults;
  };
  
  criticalIssues: Issue[];
  recommendations: Recommendation[];
  performanceBaseline: PerformanceMetrics;
  nextSteps: string[];
}

// Generate reports
const reports = {
  detailed: '/docs/audit/run_complete_[timestamp].md',
  summary: '/docs/audit/run_summary_[timestamp].md',
  failures: '/docs/audit/run_failures_only_[timestamp].md',
  performance: '/docs/audit/run_performance_analysis_[timestamp].md',
  security: '/docs/audit/run_security_audit_[timestamp].md',
  optimization: '/docs/audit/run_optimization_suggestions_[timestamp].md'
};
```

---

## 12. Continuous Monitoring

### @setup-continuous-monitoring

Configure ongoing monitoring after simulation.

```typescript
const monitoringConfig = {
  realtime: {
    metrics: ['response_time', 'error_rate', 'active_users'],
    interval: '10s',
    alerts: {
      responseTime: { threshold: 2000, action: 'notify' },
      errorRate: { threshold: 0.05, action: 'page' },
      activeUsers: { threshold: 10000, action: 'scale' }
    }
  },
  
  scheduled: {
    daily: [
      'Database backup verification',
      'Log rotation check',
      'SSL certificate expiry',
      'Dependency updates'
    ],
    
    weekly: [
      'Performance regression test',
      'Security scan',
      'Unused resource cleanup',
      'Cost analysis'
    ],
    
    monthly: [
      'Full system audit',
      'Disaster recovery test',
      'Capacity planning review'
    ]
  }
};
```

**Output**: `/docs/audit/run_monitoring_config_[timestamp].md`

---

## Execution Script

### Complete Simulation Runner

```bash
#!/bin/bash
# run_complete_simulation.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
AUDIT_DIR="./docs/audit"
mkdir -p $AUDIT_DIR

echo "Starting Complete Application Simulation - $TIMESTAMP"

# Run each simulation phase
npm run simulate:preflight    > $AUDIT_DIR/run_preflight_$TIMESTAMP.log 2>&1
npm run simulate:infrastructure > $AUDIT_DIR/run_infrastructure_$TIMESTAMP.log 2>&1
npm run simulate:api          > $AUDIT_DIR/run_api_$TIMESTAMP.log 2>&1
npm run simulate:frontend     > $AUDIT_DIR/run_frontend_$TIMESTAMP.log 2>&1
npm run simulate:pipeline     > $AUDIT_DIR/run_pipeline_$TIMESTAMP.log 2>&1
npm run simulate:security     > $AUDIT_DIR/run_security_$TIMESTAMP.log 2>&1
npm run simulate:performance  > $AUDIT_DIR/run_performance_$TIMESTAMP.log 2>&1
npm run simulate:failures     > $AUDIT_DIR/run_failures_$TIMESTAMP.log 2>&1
npm run simulate:mobile       > $AUDIT_DIR/run_mobile_$TIMESTAMP.log 2>&1
npm run simulate:integrations > $AUDIT_DIR/run_integrations_$TIMESTAMP.log 2>&1

# Generate final report
npm run simulate:report -- --timestamp=$TIMESTAMP

echo "Simulation Complete - Reports available in $AUDIT_DIR"
```

---

## Usage Instructions

1. **Run complete simulation**:

   ```bash
   @run-complete-simulation
   ```

2. **Run specific test category**:

   ```bash
   @run-backend-endpoints
   @run-frontend-flows
   @run-security-tests
   ```

3. **Generate optimization report**:

   ```bash
   @generate-simulation-report --focus=optimization
   ```

4. **View results**:
   - Check `/docs/audit/` folder for all `run_*` files
   - Latest run: `run_complete_[newest_timestamp].md`
   - Performance trends: Compare multiple `run_performance_*.md` files
   - Security issues: `run_security_*.md`

This comprehensive simulation framework ensures every aspect of the aInvestFeed application is tested, logged, and optimized systematically.
