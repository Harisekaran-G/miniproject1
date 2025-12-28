# Quick Start Guide - 5 Minute Setup

Fast setup for testing the application quickly.

## Prerequisites Check

```bash
node --version    # Should show v14 or higher
npm --version     # Should show version number
```

If not installed: Download Node.js from https://nodejs.org/

---

## Step-by-Step (Copy-Paste Commands)

### 1. Install Backend (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

**Wait for:** `🚀 Server running on http://localhost:3000`

**Keep this terminal open!**

---

### 2. Install Frontend (Terminal 2 - NEW WINDOW)

```bash
cd "C:\Users\ASUS\OneDrive\Desktop\haran\mini project"
npm install
npm start
```

**Then press:** `w` (for web browser)

---

### 3. Test Login

- Email: `demo@example.com`
- Password: `demo123`
- Click "Sign In"

---

### 4. Test Route Search

- Source: `Dontownw`
- Destination: `Airport`
- Click "Find Best Route"

---

### 5. View Results

- See all three options (Bus, Taxi, Hybrid)
- Recommended option is highlighted

---

## ✅ Success Checklist

- [ ] Backend shows "Server running" message
- [ ] Frontend shows QR code and options
- [ ] Browser opens with login screen
- [ ] Can login with demo credentials
- [ ] Can search for routes
- [ ] Results screen shows recommendations

---

## ❌ Common Issues

**Backend won't start:**
- Check if port 3000 is free
- Run: `npm install` again in backend folder

**Frontend won't start:**
- Make sure you're in project root (not backend folder)
- Run: `npm install` again

**Can't connect to backend:**
- Verify backend is running (check Terminal 1)
- Open `http://localhost:3000/health` in browser
- Should see JSON response

**Mobile device can't connect:**
- Update `src/services/api.js` with your computer's IP
- Find IP: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Replace `localhost` with your IP address

---

**For detailed instructions, see `SETUP_INSTRUCTIONS.md`**

