# Bus & Taxi Booking - Mobile Login Page

A modern, clean mobile login screen for a smart transportation booking application built with React Native and Expo.

## Features

- ✨ Modern, minimal UI design
- 🎨 Light theme with soft blue gradient
- 📱 Responsive layout for Android and iOS
- 🔐 Email and password authentication
- 👁️ Password visibility toggle
- ✅ Form validation with error messages
- 🎯 Touch-friendly button sizes
- ⌨️ Keyboard-aware layout
- 🎭 Smooth animations and transitions

## Design Elements

### Color Palette
- **Primary**: Navy/Dark Blue (#1E3A5F)
- **Secondary**: Light Blue (#4A90E2)
- **Background**: White with gradient
- **Text**: Dark Gray (#333, #666)

### Typography
- **Headings**: Bold Sans-serif
- **Body**: Regular Sans-serif
- **Buttons**: Medium weight

## Project Structure

```
bus-taxi-booking/
├── App.js                 # Main app entry point
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── src/
│   ├── screens/
│   │   └── LoginScreen.js    # Login screen component
│   └── styles/
│       └── loginStyles.js    # Styling definitions
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (will be installed globally)

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   
   **Option A: Using Expo Go App (Recommended for Testing)**
   
   - Install **Expo Go** on your phone:
     - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
     - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Run `npm start` in your terminal
   - Scan the QR code with:
     - **Android**: Camera app or Expo Go app
     - **iOS**: Camera app
   - Make sure your phone and computer are on the **same Wi-Fi network**
   - If on different networks, press `s` in terminal to switch to tunnel mode
   
   **Option B: Android Emulator**
   - Install Android Studio and set up an Android Virtual Device (AVD)
   - Start the emulator
   - Run: `npm run android` or `npx expo start --android`
   
   **Option C: iOS Simulator (Mac only)**
   - Install Xcode from App Store
   - Run: `npm run ios` or `npx expo start --ios`
   
   **Option D: Web Browser**
   - Run: `npm run web` or `npx expo start --web`

## Usage

### Login Screen Features

1. **Email Input**: Enter your email address
2. **Password Input**: Enter your password (with visibility toggle)
3. **Sign In Button**: Submit login credentials
4. **Forgot Password**: Link to password recovery
5. **Sign Up**: Link to registration page
6. **Demo Accounts**: Sample credentials for testing

### Demo Credentials
- **Email**: demo@example.com
- **Password**: demo123

## Form Validation

The login form includes validation for:
- Email format validation
- Required field checks
- Password minimum length (6 characters)
- Real-time error messages

## Customization

### Changing Colors
Edit `src/styles/loginStyles.js`:
- Primary color: `#1E3A5F`
- Secondary color: `#4A90E2`
- Background colors in gradient

### Modifying Text
Edit `src/screens/LoginScreen.js`:
- App name, headings, and button labels
- Placeholder text
- Demo account information

## Next Steps

To extend this project, you can:
- Add navigation (React Navigation)
- Implement authentication logic
- Create Sign Up screen
- Add Home/Dashboard screen
- Implement Booking screens
- Add API integration

## Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development platform
- **Expo Linear Gradient**: Gradient backgrounds
- **Expo Vector Icons**: Icon library (Ionicons)
- **React Native Safe Area Context**: Safe area handling

## License

This project is created for academic/mini-project purposes.

## Author

Created for Bus & Taxi Booking mobile application mini project.

