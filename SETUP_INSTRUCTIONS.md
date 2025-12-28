# Setup Instructions - Bus & Taxi Booking Application

Complete setup guide for running the full-stack application locally.

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Expo CLI** (will be installed automatically)
- **TypeScript** (will be installed automatically)

## Project Structure

```
mini project/
├── backend/              # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   ├── services/
│   │   └── data/
│   └── package.json
├── src/                  # React Native frontend
│   ├── screens/
│   ├── styles/
│   └── services/
├── App.js
└── package.json
```

---

## Step 1: Install Backend Dependencies

**Open Terminal/PowerShell in the project root directory**

```bash
cd backend
npm install
```

**What this installs:**
- Express (web framework)
- TypeScript (type-safe JavaScript)
- CORS (cross-origin resource sharing)
- dotenv (environment variables)
- ts-node-dev (development server with auto-reload)
- All type definitions

**Expected output:** You should see packages being installed. Wait for it to complete (may take 2-5 minutes).

**If you see errors:**
- Make sure Node.js is installed: `node --version` (should show v14 or higher)
- Make sure npm is installed: `npm --version`

---

## Step 2: Configure Backend (Optional)

**Create .env file (optional - server works without it):**

```bash
cd backend
# Copy the example file (if .env.example exists)
# Or create .env manually with:
# PORT=3000
# NODE_ENV=development
```

**Note:** The server will use port 3000 by default even without .env file.

## Step 3: Build and Start Backend Server

**Keep the terminal in the `backend` folder**

### Option A: Development Mode (Recommended - with auto-reload)

```bash
npm run dev
```

**What you should see:**
```
🚀 Server running on http://localhost:3000
📱 API endpoints available at http://localhost:3000/api
```

**Keep this terminal window open!** The server must keep running.

### Option B: Production Mode (Alternative)

```bash
npm run build
npm start
```

**Verify backend is running:**
1. Open your web browser
2. Go to: `http://localhost:3000/health`
3. You should see: `{"status":"OK","message":"Server is running"}`

**If you see an error:**
- Port 3000 might be in use - change PORT in .env file to 3001
- Make sure all dependencies were installed correctly
- Check terminal for error messages

---

## Step 4: Install Frontend Dependencies

**IMPORTANT:** Open a **NEW terminal window** (keep the backend terminal running!)

**In the new terminal:**

```bash
# Navigate to project root (if not already there)
cd "C:\Users\ASUS\OneDrive\Desktop\haran\mini project"

# Install frontend dependencies
npm install
```

**What this installs:**
- React Native (mobile framework)
- Expo (development platform)
- React Navigation (screen navigation)
- Expo Linear Gradient
- Ionicons
- All other frontend dependencies

**Expected time:** 3-10 minutes depending on internet speed

**If you see errors:**
- Make sure you're in the project root (not in backend folder)
- Try: `npm install --legacy-peer-deps` if there are dependency conflicts

---

## Step 5: Start Frontend Application

**Make sure backend is still running in the other terminal!**

**In the frontend terminal (project root):**

```bash
npm start
```

```bash
npm start
```

**What you'll see:**
- A QR code in the terminal
- Options menu with letters:
  - Press `w` - Open in web browser
  - Press `a` - Open in Android emulator (if installed)
  - Press `i` - Open in iOS simulator (Mac only)
  - Or scan QR code with Expo Go app

### Option A: Test in Web Browser (Easiest)

**In the Expo terminal, press `w`**

OR run directly:
```bash
npm run web
```

**What happens:**
- Browser will open automatically
- App will load at `http://localhost:19006` (or similar)
- You'll see the login screen

### Option B: Test on Mobile Device

1. **Install Expo Go app:**
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Connect to same Wi-Fi:**
   - Make sure your phone and computer are on the same Wi-Fi network

3. **Scan QR code:**
   - Android: Open Expo Go app → Scan QR code
   - iOS: Open Camera app → Scan QR code → Tap notification

4. **If QR code doesn't work:**
   - In Expo terminal, press `s` to switch to tunnel mode
   - Scan the new QR code

**IMPORTANT for Mobile:** You need to update API URL in `src/services/api.js`:
```javascript
// Change from localhost to your computer's IP
const API_BASE_URL = 'http://192.168.1.XXX:3000/api';
// Find your IP: Run 'ipconfig' in Windows terminal
```

---

## Step 6: Test the Application

### Test Credentials (from mock database):
- **Email**: `demo@example.com`
- **Password**: `demo123`

### Complete Test Flow:

**1. Login Screen:**
   - Enter email: `demo@example.com`
   - Enter password: `demo123`
   - Click "Sign In" button
   - You should see a loading indicator
   - On success, you'll navigate to Route Input screen

**2. Route Input Screen:**
   - **Source:** Type "Downtown" (or click quick select button)
   - **Destination:** Type "Airport" (or click quick select button)
   - Click "Find Best Route" button
   - You should see loading indicator
   - On success, you'll navigate to Results screen

**3. Results Screen:**
   - You'll see three options:
     - **Bus Only** - Shows fare and ETA
     - **Taxi Only** - Shows fare and ETA
     - **Hybrid (Bus + Taxi)** - Shows combined option
   - One option will be highlighted as "RECOMMENDED"
   - You can click "Book Now" (shows alert) or "Search Again"

### Sample Location Combinations:
- **Source:** Downtown → **Destination:** Airport
- **Source:** City Center → **Destination:** Mall
- **Source:** Airport → **Destination:** Downtown

**Expected Results:**
- Backend calculates best option
- Shows fare breakdown
- Highlights recommended option with star badge

---

## Troubleshooting

### Backend Issues

**Port 3000 already in use:**
```bash
# Change port in backend/.env
PORT=3001
```

**TypeScript compilation errors:**
```bash
cd backend
npm run build
# Check for errors
```

### Frontend Issues

**Cannot connect to backend:**
- ✅ **Check 1:** Make sure backend terminal shows "Server running on http://localhost:3000"
- ✅ **Check 2:** Open browser and go to `http://localhost:3000/health` - should show JSON response
- ✅ **Check 3:** For mobile device, you MUST change API URL:
  
  **Find your computer's IP address:**
  ```bash
  # Windows (PowerShell/CMD):
  ipconfig
  # Look for "IPv4 Address" under your Wi-Fi adapter (e.g., 192.168.1.100)
  
  # Mac/Linux:
  ifconfig
  # Look for inet address
  ```
  
  **Update `src/services/api.js`:**
  ```javascript
  const API_BASE_URL = __DEV__ 
    ? 'http://192.168.1.100:3000/api'  // Replace with YOUR IP
    : 'http://your-production-url.com/api';
  ```
  
  **Restart Expo:** Press `r` in Expo terminal to reload

**Navigation errors:**
```bash
npm install @react-navigation/native @react-navigation/native-stack react-native-screens
```

**Web dependencies missing:**
```bash
npm install react-dom react-native-web --legacy-peer-deps
```

**Note:** Expo 54 uses Metro bundler for web (not webpack), so `@expo/webpack-config` is not needed.

---

## API Endpoints

All endpoints are prefixed with `/api`:

### Authentication
- `POST /api/login`
  ```json
  {
    "email": "demo@example.com",
    "password": "demo123"
  }
  ```

### Routes
- `POST /api/getRoutes`
  ```json
  {
    "source": "Downtown",
    "destination": "Airport"
  }
  ```

### Transport Options
- `POST /api/getBusOptions`
- `POST /api/getTaxiOptions`

### Optimization
- `POST /api/getHybridRecommendation`
  ```json
  {
    "source": "Downtown",
    "destination": "Airport"
  }
  ```

---

## Development Workflow

### Starting Both Servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Keep this running - it auto-reloads on file changes

**Terminal 2 - Frontend:**
```bash
# In project root
npm start
```
✅ Keep this running - Expo hot reloads on file changes

### Making Changes:

**Backend Changes:**
- Edit any `.ts` file in `backend/src/`
- Save the file
- Server automatically restarts (watch terminal for "Server running" message)

**Frontend Changes:**
- Edit any `.js` file in `src/`
- Save the file
- App automatically reloads in browser/device

### Testing Changes:
- Backend: Test API endpoints using browser or Postman
- Frontend: Changes appear immediately in Expo

---

## Project Features Implemented

✅ User authentication with mock database  
✅ Source/destination input screen  
✅ Bus route options with mock data  
✅ Taxi options with mock data  
✅ Hybrid route optimization algorithm  
✅ Results screen with all options  
✅ Recommended option highlighting  
✅ Navigation between screens  
✅ Error handling and validation  
✅ Loading states  
✅ Responsive UI design  

---

## Next Steps (Phase 2)

- [ ] Connect to real MongoDB database
- [ ] Integrate real Maps API (Google Maps/OpenStreetMap)
- [ ] Real-time bus location tracking
- [ ] Payment integration
- [ ] User registration
- [ ] Trip history
- [ ] Push notifications

---

## Support

For issues or questions:
1. Check console logs in terminal
2. Check browser/device console for errors
3. Verify backend is running on port 3000
4. Ensure all dependencies are installed

---

**Happy Coding! 🚀**

