# Level 1 Data Flow Diagram (DFD)
## Efficient Urban Commute Hub via Hybrid Bus and Taxi Booking

### Diagram Description
This Level 1 DFD shows the detailed data flow between processes, external entities, and data stores for the mobile booking application.

---

## Text-Based DFD Representation

```
                    ┌─────────────────┐
                    │   USER          │
                    │  (Commuter)     │
                    └────────┬────────┘
                             │
                             │ Login Credentials
                             │ Travel Request
                             │
                    ┌────────▼────────────────────────┐
                    │  1.0                            │
                    │  Mobile Application Interface │
                    └────────┬───────────────────────┘
                             │
                             │ User Credentials
                             │ Travel Request
                             │
                    ┌────────▼────────────────────────┐
                    │  2.0                            │
                    │  Backend Server                 │
                    └────────┬────────────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                │            │            │
        ┌───────▼──────┐     │     ┌──────▼──────────┐
        │  3.0         │     │     │  User           │
        │ Authentication│    │     │  Database       │
        │  Module      │     │     │  (D1)           │
        └───────┬──────┘     │     └──────┬──────────┘
                │            │            │
                │ Auth Result│            │ User Data
                │            │            │
        ┌───────┴────────────┴────────────┴──────┐
        │        2.0 Backend Server               │
        └────────┬────────────────────────────────┘
                 │
        ┌────────┼────────┐
        │        │        │
        │        │        │
┌───────▼────┐   │  ┌─────▼──────────┐
│  4.0       │   │  │  5.0           │
│ Maps &     │   │  │ Bus Transport  │
│ Routing    │   │  │ Service       │
│ Service    │   │  └───────────────┘
└───────┬────┘   │
        │        │
        │ Route  │ Bus Route Data
        │ Data   │ Availability
        │        │ Fare, ETA
        │        │
┌───────▼────────┴────────────┐
│  2.0 Backend Server         │
└────────┬────────────────────┘
         │
         │
┌────────▼──────────┐
│  6.0              │
│ Taxi Service      │
└────────┬──────────┘
         │
         │ Taxi Availability
         │ Fare, ETA
         │
┌────────▼────────────┐
│  2.0 Backend Server │
└────────┬────────────┘
         │
         │ All Route Data
         │
┌────────▼────────────────────┐
│  7.0                         │
│ Hybrid Route Optimization   │
│ Module                       │
└────────┬─────────────────────┘
         │
         │ Optimized Route
         │ Fare Breakdown
         │
┌────────▼────────────┐
│  2.0 Backend Server │
└────────┬────────────┘
         │
         │ Trip Details
         │
┌────────▼──────────────┐
│ Trip History Database  │
│ (D2)                   │
└────────┬───────────────┘
         │
         │ Stored Trip Data
         │
┌────────▼────────────┐
│  2.0 Backend Server │
└────────┬────────────┘
         │
         │ Recommended Option
         │ Fare Breakdown
         │ ETA
         │
┌────────▼────────────────────────┐
│  1.0                             │
│ Mobile Application Interface     │
└────────┬─────────────────────────┘
         │
         │ Travel Options
         │ Recommendations
         │
┌────────▼────────┐
│   USER          │
│  (Commuter)     │
└─────────────────┘
```

---

## Data Flow Details

### External Entity
- **User (Commuter)**: The end-user who interacts with the mobile application

### Processes
1. **1.0 Mobile Application Interface**: Collects user input and displays results
2. **2.0 Backend Server**: Central coordinator for all API requests and data processing
3. **3.0 Authentication Module**: Verifies user credentials
4. **4.0 Maps & Routing Service**: Calculates routes, distance, and travel time
5. **5.0 Bus Transport Service**: Provides bus-related data
6. **6.0 Taxi Service**: Provides taxi-related data
7. **7.0 Hybrid Route Optimization Module**: Compares and optimizes route options

### Data Stores
- **D1: User Database**: Stores user account information
- **D2: Trip History Database**: Stores completed and pending trip records

### Data Flows
1. User → 1.0: Login Credentials, Travel Request
2. 1.0 → 2.0: User Credentials, Travel Request
3. 2.0 → 3.0: User Credentials
4. 3.0 → D1: Query User Data
5. D1 → 3.0: User Data
6. 3.0 → 2.0: Authentication Result
7. 2.0 → 4.0: Source, Destination
8. 4.0 → 2.0: Route Data, Distance, Estimated Time
9. 2.0 → 5.0: Route Query
10. 5.0 → 2.0: Bus Route Details, Live Location, Seat Availability, Fare, ETA
11. 2.0 → 6.0: Route Query
12. 6.0 → 2.0: Taxi Availability, Fare Estimation, ETA
13. 2.0 → 7.0: All Route Data (Bus, Taxi, Maps)
14. 7.0 → 2.0: Optimized Route, Cost Comparison, Time Comparison
15. 2.0 → D2: Trip Details
16. D2 → 2.0: Stored Trip Data
17. 2.0 → 1.0: Recommended Travel Option, Fare Breakdown, ETA
18. 1.0 → User: Travel Options, Recommendations

---

## Notes
- All processes are numbered (1.0, 2.0, etc.) following standard DFD notation
- Data stores are labeled D1, D2
- External entity (User) is shown as a rectangle
- Processes are shown as circles/bubbles
- Data stores are shown as open-ended rectangles
- Arrows indicate direction of data flow with labels

