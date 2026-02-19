Write-Host "Starting Bus & Taxi Booking App..." -ForegroundColor Cyan

# Start Database
Write-Host "1. Starting Database..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node start_database.js"

# Wait a moment for DB to initialize
Start-Sleep -Seconds 5

# Start Backend
Write-Host "2. Starting Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait a moment for Backend to initialize
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "3. Starting Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host "All services started! Check the new windows." -ForegroundColor Cyan
Write-Host "Backend Health Check: http://localhost:3000/health" -ForegroundColor Yellow
Write-Host "Frontend (Expo): http://localhost:8081" -ForegroundColor Yellow
