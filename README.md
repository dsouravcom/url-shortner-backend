# 🔗 URL Shortener API

A production-ready URL shortening service built with Node.js, Express, TypeScript, and MongoDB.

## ✨ Features

-   🎯 Generate short URLs with unique 8-character IDs
-   ⚡ Fast redirects with visit tracking
-   📊 Analytics and visit history
-   🛡️ URL validation and domain blacklisting
-   🌐 CORS protection with whitelist
-   💪 Production-ready database with auto-reconnection
-   📝 Winston logging with Logtail integration

## 🛠️ Tech Stack

**Backend:** Node.js • TypeScript • Express.js  
**Database:** MongoDB • Mongoose  
**Validation:** Zod  
**Other:** Winston • Logtail • nanoid • CORS

## 📁 Project Structure

```
src/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middlewares/     # Validation & CORS
├── models/          # Mongoose schemas
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Logger utilities
└── index.ts         # Entry point
```

## 🚀 Quick Start

### 📦 Installation

```bash
npm install
cp .env.sample .env
# Edit .env with your config
```

### 🔧 Environment Variables

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
WHITELISTED_DOMAINS=http://localhost:3000
PORT=6000
NODE_ENV=development
```

### ▶️ Run

```bash
npm run dev      # Development
npm run build    # Build
npm start        # Production
```

## 📡 API Endpoints

### 🏥 Health Check

```http
GET /health
```

### ✂️ Create Short URL

```http
POST /short
{
  "url": "https://example.com/long/url"
}
```

**Response:** `{ "short_url": "abc12345", "original_url": "..." }`

### 🔄 Redirect

```http
GET /:id
```

Redirects to original URL and tracks visit.

### 📈 Analytics

```http
GET /analytics/:id
```

**Response:** `{ "totalView": 42, "analytics": [...] }`

## 🏗️ Architecture Flow

```
Client → CORS → Routes → Validator → Controller → Service → Database
```

**Layers:**

-   🌐 **Routes**: Define endpoints
-   🛡️ **Middleware**: Validate & filter requests
-   🎮 **Controllers**: Handle HTTP logic
-   💼 **Services**: Business logic
-   🗄️ **Models**: Database schemas

## 🗄️ Database Schema

```typescript
{
  original_url: String (required),
  short_url: String (required, unique, indexed),
  visit_history: [{ timeStamp: Number }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security & Production Features

✅ **Database**

-   Connection pooling (5-10 connections)
-   Auto-reconnection with exponential backoff
-   Graceful shutdown handling

✅ **Performance**

-   Lean queries (30-50% faster)
-   Indexed lookups on `short_url`
-   Field selection for minimal data transfer

✅ **Security**

-   CORS whitelist protection
-   Zod schema validation
-   Domain blacklisting
-   Input sanitization

✅ **Monitoring**

-   Structured JSON logging
-   Remote logging with Logtail
-   Health check endpoint

## 🐛 Error Codes

| Code  | Description                       |
| ----- | --------------------------------- |
| `400` | Invalid URL or blacklisted domain |
| `404` | Short URL not found               |
| `500` | Server or database error          |

## 📝 License

ISC License

