# API Specification - aInvestFeed

## REST API Complete Documentation

### Base URL

- **Development**: `http://localhost:3001/api/v1`
- **Staging**: `https://api-staging.ainvestfeed.com/api/v1`
- **Production**: `https://api.ainvestfeed.com/api/v1`

### Authentication

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## Authentication Endpoints

### POST /auth/register

Register a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "role": "user",
      "emailVerified": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### POST /auth/login

User authentication.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "role": "user",
      "firstName": "John",
      "lastName": "Doe"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "def50200a1b2c3d4e5f6...",
      "expiresIn": 3600
    }
  }
}
```

### POST /auth/refresh

Refresh the access token.

**Request Body:**

```json
{
  "refreshToken": "def50200a1b2c3d4e5f6..."
}
```

### POST /auth/logout

Logout user (invalidate tokens).

**Headers:** `Authorization: Bearer <token>`

### POST /auth/forgot-password

Request password reset.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

### POST /auth/reset-password

Reset password with received token.

**Request Body:**

```json
{
  "token": "reset_token_here",
  "newPassword": "NewSecurePassword123!"
}
```

### POST /auth/verify-email

Verify email address.

**Request Body:**

```json
{
  "token": "verification_token_here"
}
```

---

## News Endpoints

### GET /news

Get news feed list.

**Query Parameters:**

- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Number of articles per page
- `market` (string) - Filter by market: `stocks`, `forex`, `crypto`, `commodities`, `indices`
- `category` (string) - Financial instrument category
- `since` (ISO date) - News after this date
- `confidence_min` (integer, 0-100) - Minimum confidence score

**Example:** `GET /news?page=1&limit=20&market=stocks&confidence_min=70`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "news": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Apple Reports Strong Q4 Earnings",
        "excerpt": "Apple Inc. reported better-than-expected quarterly earnings...",
        "publishedAt": "2024-01-15T08:30:00Z",
        "createdAt": "2024-01-15T08:35:00Z",
        "sourceUrl": "https://example.com/apple-earnings",
        "sourceName": "Financial Times",
        "market": "stocks",
        "imageUrl": "https://cdn.example.com/apple-earnings.jpg",
        "summary": {
          "text": "Apple exceeded Q4 expectations with strong iPhone sales...",
          "keyPoints": [
            "Revenue up 8% year-over-year",
            "iPhone sales exceeded forecasts",
            "Services revenue grew 15%"
          ],
          "sentiment": 0.75
        },
        "analysis": {
          "instrumentSymbol": "AAPL",
          "instrumentName": "Apple Inc.",
          "market": "stocks",
          "recommendation": "BUY",
          "confidenceScore": 85,
          "priceTarget": 195.50,
          "reasoning": "Strong earnings beat and positive guidance suggest continued growth momentum.",
          "riskFactors": [
            "Potential regulatory challenges",
            "Supply chain disruptions"
          ],
          "timeHorizon": "3M"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1250,
      "totalPages": 63,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /news/:id

Get complete news details.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Apple Reports Strong Q4 Earnings",
    "content": "Full article content here...",
    "excerpt": "Apple Inc. reported better-than-expected quarterly earnings...",
    "publishedAt": "2024-01-15T08:30:00Z",
    "sourceUrl": "https://example.com/apple-earnings",
    "sourceName": "Financial Times",
    "author": "John Smith",
    "market": "stocks",
    "tags": ["earnings", "technology", "apple"],
    "imageUrls": ["https://cdn.example.com/apple-earnings.jpg"],
    "summary": {
      "id": "summary_id",
      "text": "Apple exceeded Q4 expectations...",
      "keyPoints": ["Point 1", "Point 2"],
      "sentiment": 0.75,
      "modelUsed": "llama3.1:8b",
      "tokensUsed": 245,
      "latencyMs": 1250
    },
    "analysis": {
      "id": "analysis_id",
      "instrumentSymbol": "AAPL",
      "instrumentName": "Apple Inc.",
      "instrumentCategory": "equity",
      "market": "stocks",
      "recommendation": "BUY",
      "confidenceScore": 85,
      "priceTarget": 195.50,
      "reasoning": "Strong earnings beat and positive guidance...",
      "riskFactors": [
        "Potential regulatory challenges",
        "Supply chain disruptions"
      ],
      "timeHorizon": "3M",
      "analysisJson": {
        "technicalIndicators": {},
        "fundamentalMetrics": {},
        "marketContext": {}
      },
      "modelUsed": "mistral:7b-instruct",
      "tokensUsed": 680,
      "latencyMs": 2100
    }
  }
}
```

### GET /news/trending

Get high-impact trending news.

**Query Parameters:**

- `period` (string) - `1h`, `4h`, `1d`, `1w` (default: `1d`)
- `limit` (integer, default: 10, max: 50)

### GET /news/instruments/:symbol

Get news for a specific financial instrument.

**Path Parameters:**

- `symbol` (string) - Instrument symbol (e.g., `AAPL`, `EURUSD`, `BTC`)

### POST /news/:id/bookmark

Add/remove news from bookmarks.

**Headers:** `Authorization: Bearer <token>`

---

## Analysis Endpoints

### GET /analysis

Get AI analyses with filtering and sorting.

**Query Parameters:**

- `recommendation` (string) - `BUY`, `SELL`, `HOLD`
- `market` (string) - Financial market
- `confidence_min` (integer) - Minimum confidence score
- `instrument` (string) - Instrument symbol
- `time_horizon` (string) - `1D`, `1W`, `1M`, `3M`, `1Y`
- `sort` (string) - `confidence`, `created_at`, `price_target`
- `order` (string) - `asc`, `desc` (default: `desc`)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "id": "analysis_id",
        "newsId": "news_id",
        "newsTitle": "Apple Reports Strong Q4 Earnings",
        "instrumentSymbol": "AAPL",
        "instrumentName": "Apple Inc.",
        "market": "stocks",
        "recommendation": "BUY",
        "confidenceScore": 85,
        "priceTarget": 195.50,
        "currentPrice": 182.30,
        "potentialReturn": 7.24,
        "timeHorizon": "3M",
        "createdAt": "2024-01-15T08:35:00Z"
      }
    ],
    "summary": {
      "totalCount": 150,
      "byRecommendation": {
        "BUY": 85,
        "SELL": 25,
        "HOLD": 40
      },
      "averageConfidence": 72.5
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### GET /analysis/instruments

Get list of analyzed financial instruments.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "instruments": [
      {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "category": "equity",
        "market": "stocks",
        "analysisCount": 45,
        "lastAnalysis": "2024-01-15T10:30:00Z",
        "currentRecommendation": "BUY",
        "avgConfidence": 78.5
      }
    ]
  }
}
```

### GET /analysis/summary

Get general analysis statistics.

**Query Parameters:**

- `period` (string) - `1d`, `7d`, `30d` (default: `7d`)

---

## User Endpoints

### GET /user/profile

Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "emailVerified": true,
      "twoFactorEnabled": false,
      "preferences": {
        "markets": ["stocks", "crypto"],
        "notifications": {
          "email": true,
          "push": true,
          "sms": false
        },
        "language": "en",
        "timezone": "UTC"
      },
      "subscription": {
        "plan": "free",
        "expiresAt": null,
        "features": ["basic_feed", "bookmarks"]
      },
      "stats": {
        "bookmarksCount": 15,
        "analysisViewed": 125,
        "lastActivity": "2024-01-15T10:30:00Z"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### PUT /user/profile

Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe Updated",
  "preferences": {
    "markets": ["stocks", "crypto", "forex"],
    "notifications": {
      "email": true,
      "push": false,
      "sms": true
    },
    "language": "en",
    "timezone": "Europe/London"
  }
}
```

### GET /user/bookmarks

Get user bookmarks.

**Headers:** `Authorization: Bearer <token>`

### GET /user/activity

Get user activity history.

**Query Parameters:**

- `type` (string) - `login`, `news_view`, `analysis_view`, `bookmark`
- `limit` (integer, default: 50)
- `page` (integer, default: 1)

### POST /user/change-password

Change user password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

### POST /user/enable-2fa

Enable two-factor authentication.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "backupCodes": [
      "12345678",
      "87654321"
    ]
  }
}
```

### POST /user/verify-2fa

Verify and confirm 2FA activation.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "token": "123456"
}
```

---

## Search Endpoints

### GET /search

Global search in news and analyses.

**Query Parameters:**

- `q` (string, required) - Search term
- `type` (string) - `news`, `analysis`, `instruments` (default: `all`)
- `market` (string) - Filter by market
- `limit` (integer, default: 20)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "results": {
      "news": [
        {
          "type": "news",
          "id": "news_id",
          "title": "Search result title",
          "excerpt": "Relevant excerpt...",
          "highlight": "Highlighted search terms",
          "relevance": 0.95,
          "publishedAt": "2024-01-15T08:30:00Z"
        }
      ],
      "instruments": [
        {
          "type": "instrument",
          "symbol": "AAPL",
          "name": "Apple Inc.",
          "market": "stocks",
          "relevance": 0.88
        }
      ]
    },
    "totalResults": 45,
    "query": "apple earnings"
  }
}
```

### GET /search/suggestions

Get autocomplete suggestions.

**Query Parameters:**

- `q` (string, required) - Partial text

---

## Analytics Endpoints

### GET /analytics/overview

Get general statistics (for Admin/Power users).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "period": "7d",
    "metrics": {
      "totalNews": 1250,
      "totalAnalyses": 980,
      "averageConfidence": 72.3,
      "topMarkets": [
        {
          "market": "stocks",
          "count": 520,
          "percentage": 41.6
        }
      ],
      "recommendations": {
        "BUY": 450,
        "SELL": 180,
        "HOLD": 350
      },
      "performanceMetrics": {
        "avgProcessingTime": 15.2,
        "successRate": 98.5,
        "errorRate": 1.5
      }
    }
  }
}
```

---

## Admin Endpoints

### GET /admin/users

List users (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**

- `role` (string) - Filter by role
- `status` (string) - `active`, `inactive`, `banned`
- `search` (string) - Search by email/name

### PUT /admin/users/:id

Update a user (Admin only).

### GET /admin/ai/models

List available AI models.

### POST /admin/ai/models/:id/test

Test an AI model with sample content.

### GET /admin/scraping/configs

Scraping configurations.

### POST /admin/scraping/run

Manually run a scraping job.

### GET /admin/system/health

Detailed system status.

---

## Mobile Specific Endpoints

### POST /mobile/devices

Register a device for push notifications.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "platform": "ios",
  "pushToken": "ExponentPushToken[xxxxxxxx]",
  "deviceInfo": {
    "model": "iPhone 14",
    "osVersion": "17.1",
    "appVersion": "1.0.0"
  }
}
```

### DELETE /mobile/devices/:id

Remove device registration.

### GET /mobile/notifications/history

History of sent notifications.

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - Missing or invalid token
- `INSUFFICIENT_PERMISSIONS` - User doesn't have required role
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `DUPLICATE_RESOURCE` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `AI_SERVICE_UNAVAILABLE` - AI analysis service is down
- `DATABASE_ERROR` - Database connection/query error

---

## Rate Limiting

### Default Limits

- **Anonymous users**: 100 requests/hour
- **Authenticated users**: 1000 requests/hour
- **Power users**: 5000 requests/hour
- **Admin users**: 10000 requests/hour

### Headers Returned

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
Retry-After: 3600
```

---

## Authentication & Security

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "email": "user@example.com",
    "role": "user",
    "permissions": ["read:news", "write:bookmarks"],
    "iat": 1642244400,
    "exp": 1642248000,
    "jti": "token_id"
  }
}
```

### Required Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
User-Agent: aInvestFeed-Mobile/1.0.0 (iOS 17.1)
```

### API Versioning

- Current version: `v1`
- Version header: `Accept: application/vnd.ainvestfeed.v1+json`
- Backward compatibility: Minimum 1 year support for previous versions

This API specification provides a complete foundation for developing the aInvestFeed application, covering all necessary endpoints for the platform's complete functionality.
