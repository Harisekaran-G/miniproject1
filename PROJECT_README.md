# Efficient Urban Commute Hub via Hybrid Bus and Taxi Booking

**Phase 1 MVP - Working Prototype**

A full-stack mobile application that provides intelligent route recommendations by comparing bus-only, taxi-only, and hybrid (bus + taxi) transportation options.

---

## 🎯 Project Overview

This application helps users find the most cost-efficient and time-efficient transportation options by:
- Comparing bus and taxi services
- Calculating hybrid routes (bus + taxi combination)
- Recommending the best option based on cost and time

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React Native (Expo)
- React Navigation
- Expo Linear Gradient
- Ionicons

**Backend:**
- Node.js
- Express.js
- TypeScript
- CORS enabled

**Data:**
- Mock data (in-memory storage)
- JSON API responses

---

## 📁 Project Structure

```
mini project/
├── backend/                    # Backend API Server
│   ├── src/
│   │   ├── server.ts          # Main server file
│   │   ├── routes/            # API route handlers
│   │   │   ├── authRoutes.ts
│   │   │   ├── routeRoutes.ts
│   │   │   ├── busRoutes.ts
│   │   │   ├── taxiRoutes.ts
│   │   │   └── hybridRoutes.ts
│   │   ├── services/          # Business logic
│   │   │   └── hybridOptimization.ts  # Core algorithm
│   │   └── data/              # Mock data
│   │       └── mockData.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── src/                       # Frontend React Native App
│   ├── screens/
│   │   ├── LoginScreen.js     # User authentication
│   │   ├── RouteInputScreen.js # Source/destination input
│   │   └── ResultsScreen.js   # Display recommendations
│   ├── styles/                # Component styles
│   │   ├── loginStyles.js
│   │   ├── routeInputStyles.js
│   │   └── resultsStyles.js
│   └── services/
│       └── api.js             # API service layer
│
├── docs/                      # Documentation
│   ├── DFD_Level1.md
│   ├── DFD_Level1_Mermaid.md
│   ├── DFD_Level1_DrawIO.xml
│   └── DFD_Level1_Description.md
│
├── App.js                     # Main app entry with navigation
├── package.json
├── SETUP_INSTRUCTIONS.md      # Detailed setup guide
└── PROJECT_README.md          # This file
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on: `http://localhost:3000`

### 2. Frontend Setup

```bash
# In project root
npm install
npm start
```

Then press:
- `w` for web browser
- Scan QR code for mobile device (Expo Go app)

**See `SETUP_INSTRUCTIONS.md` for detailed steps.**

---

## 🔑 Features Implemented

### ✅ Authentication Module
- Email/password login
- Form validation
- Backend API integration
- Error handling

### ✅ Travel Request Module
- Source location input
- Destination location input
- Quick location selection
- Input validation

### ✅ Transport Data (Mock)
- Bus routes with:
  - Route number
  - ETA (estimated time)
  - Fare
  - Seat availability
  - Coverage percentage
- Taxi options with:
  - ETA
  - Fare per kilometer
  - Total fare

### ✅ Hybrid Route Optimization
- **Algorithm Logic:**
  - Compares Bus-only, Taxi-only, and Hybrid options
  - Hybrid option only if bus coverage ≥ 60%
  - Scoring system: `(fare × 0.6) + (eta × 0.4)`
  - Selects option with lowest score
- **Returns:**
  - Recommended option (Bus/Taxi/Hybrid)
  - Total fare
  - Total ETA
  - Breakdown of all options

### ✅ User Interface
- **Login Screen:**
  - Modern gradient design
  - Email/password inputs
  - Password visibility toggle
  - Demo account display
- **Route Input Screen:**
  - Source/destination inputs
  - Quick location buttons
  - Swap locations feature
  - Loading states
- **Results Screen:**
  - All three options displayed
  - Recommended option highlighted
  - Fare and time breakdown
  - Book now button

---

## 📡 API Endpoints

All endpoints: `http://localhost:3000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | User authentication |
| POST | `/getRoutes` | Calculate route between locations |
| POST | `/getBusOptions` | Get available bus routes |
| POST | `/getTaxiOptions` | Get available taxi options |
| POST | `/getHybridRecommendation` | Get optimized recommendation |

---

## 🧮 Hybrid Optimization Algorithm

### Decision Logic

1. **Filter Available Options:**
   - Buses with available seats
   - Available taxis

2. **Calculate Options:**
   - **Bus-only:** Best available bus route
   - **Taxi-only:** Best available taxi
   - **Hybrid:** Only if bus coverage ≥ 60%
     - Hybrid fare = Bus fare + (Uncovered distance × Taxi fare/km)
     - Hybrid ETA = Bus ETA + Taxi ETA for uncovered portion

3. **Score Calculation:**
   ```
   Score = (Fare × 0.6) + (ETA × 0.4)
   ```
   Lower score = Better option

4. **Selection:**
   - Option with lowest score is recommended

### Example Calculation

**Input:**
- Bus: ₹25, 35 min, 70% coverage
- Taxi: ₹180, 20 min
- Distance: 15 km

**Hybrid Calculation:**
- Uncovered: 30% = 4.5 km
- Taxi for uncovered: 4.5 × ₹15/km = ₹67.5
- Hybrid fare: ₹25 + ₹67.5 = ₹92.5 ≈ ₹93
- Hybrid ETA: 35 + (4.5 × 2) = 44 min

**Scores:**
- Bus: (25 × 0.6) + (35 × 0.4) = 29
- Taxi: (180 × 0.6) + (20 × 0.4) = 116
- Hybrid: (93 × 0.6) + (44 × 0.4) = 73.4

**Recommendation:** Bus (lowest score)

---

## 🧪 Test Credentials

### Demo Accounts
- **Email:** `demo@example.com`
- **Password:** `demo123`

### Sample Locations
- **Sources:** Downtown, City Center
- **Destinations:** Airport, Mall

---

## 📊 Data Flow Diagram

Level 1 DFD is available in `docs/` folder:
- Text format: `DFD_Level1.md`
- Mermaid diagram: `DFD_Level1_Mermaid.md`
- Draw.io XML: `DFD_Level1_DrawIO.xml`
- Detailed description: `DFD_Level1_Description.md`

---

## 🎨 UI/UX Features

- ✅ Modern gradient headers
- ✅ Touch-friendly buttons
- ✅ Loading indicators
- ✅ Error messages
- ✅ Form validation
- ✅ Keyboard-aware layout
- ✅ Responsive design
- ✅ Smooth navigation transitions
- ✅ Recommended option highlighting

---

## 🔧 Configuration

### Backend Port
Edit `backend/.env`:
```
PORT=3000
```

### API Base URL
Edit `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
// For mobile device, use your computer's IP:
// const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

---

## 📝 Code Quality

- ✅ TypeScript for backend type safety
- ✅ Clean folder structure
- ✅ Meaningful variable names
- ✅ Comments explaining logic
- ✅ Error handling
- ✅ Input validation
- ✅ Separation of concerns

---

## 🎓 Viva Explanation Points

### 1. **Hybrid Optimization Algorithm**
- Explain the scoring system
- Why 60% coverage threshold?
- How hybrid fare is calculated

### 2. **Architecture**
- Why separate frontend/backend?
- API design decisions
- Mock data strategy

### 3. **User Flow**
- Login → Route Input → Results
- Navigation implementation
- State management

### 4. **Technology Choices**
- React Native for cross-platform
- Express for RESTful API
- TypeScript for type safety

---

## 🚧 Future Enhancements (Phase 2)

- [ ] Real MongoDB database
- [ ] Google Maps/OpenStreetMap integration
- [ ] Real-time bus tracking
- [ ] User registration
- [ ] Payment gateway
- [ ] Trip history
- [ ] Push notifications
- [ ] Advanced optimization algorithms
- [ ] Multi-user support
- [ ] Admin dashboard

---

## 📄 License

Academic/Educational Project

---

## 👨‍💻 Development

**Backend:**
- TypeScript compilation: `npm run build`
- Development mode: `npm run dev`
- Production: `npm start`

**Frontend:**
- Start Expo: `npm start`
- Web: `npm run web`
- Android: `npm run android`
- iOS: `npm run ios`

---

## 📞 Support

For setup issues, refer to `SETUP_INSTRUCTIONS.md`

For API documentation, see `backend/README.md`

---

**Built with ❤️ for Efficient Urban Commute**

