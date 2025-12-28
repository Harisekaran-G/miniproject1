# Backend API - Bus & Taxi Booking

Express + TypeScript backend server for the Efficient Urban Commute Hub application.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Build TypeScript
```bash
npm run build
```

### 3. Run Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/login` - User login

### Routes
- `POST /api/getRoutes` - Calculate route between source and destination

### Transport Options
- `POST /api/getBusOptions` - Get available bus routes
- `POST /api/getTaxiOptions` - Get available taxi options

### Optimization
- `POST /api/getHybridRecommendation` - Get optimized hybrid recommendation

## Example API Calls

### Login
```bash
POST http://localhost:3000/api/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "demo123"
}
```

### Get Hybrid Recommendation
```bash
POST http://localhost:3000/api/getHybridRecommendation
Content-Type: application/json

{
  "source": "Downtown",
  "destination": "Airport"
}
```

## Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main server file
│   ├── routes/                # API route handlers
│   │   ├── authRoutes.ts
│   │   ├── routeRoutes.ts
│   │   ├── busRoutes.ts
│   │   ├── taxiRoutes.ts
│   │   └── hybridRoutes.ts
│   ├── services/              # Business logic
│   │   └── hybridOptimization.ts
│   └── data/                  # Mock data
│       └── mockData.ts
├── dist/                      # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

