# Level 1 Data Flow Diagram - Detailed Description
## Efficient Urban Commute Hub via Hybrid Bus and Taxi Booking

### System Overview
This Level 1 DFD decomposes the mobile application system into detailed processes, showing how data flows between the user, application components, external services, and data stores.

---

## Components

### External Entity
**User (Commuter)**
- Represents the end-user who interacts with the mobile application
- Provides login credentials and travel requests
- Receives travel recommendations and options

### Processes

#### 1.0 Mobile Application Interface
- **Function**: Frontend interface that collects user input and displays results
- **Inputs**: 
  - Login credentials from User
  - Travel request (source, destination) from User
- **Outputs**: 
  - User credentials and travel request to Backend Server
  - Travel options and recommendations to User

#### 2.0 Backend Server
- **Function**: Central coordinator that handles all API requests and orchestrates data flow
- **Inputs**: 
  - User credentials and travel request from Mobile Application
  - Authentication result from Authentication Module
  - Route data from Maps & Routing Service
  - Bus data from Bus Transport Service
  - Taxi data from Taxi Service
  - Optimized route from Hybrid Route Optimization Module
  - Stored trip data from Trip History Database
- **Outputs**: 
  - User credentials to Authentication Module
  - Source and destination to Maps & Routing Service
  - Route queries to Bus and Taxi Services
  - All route data to Hybrid Route Optimization Module
  - Trip details to Trip History Database
  - Recommended options to Mobile Application

#### 3.0 Authentication Module
- **Function**: Verifies user credentials against the user database
- **Inputs**: 
  - User credentials from Backend Server
  - User data from User Database
- **Outputs**: 
  - Query to User Database
  - Authentication result to Backend Server

#### 4.0 Maps & Routing Service
- **Function**: Calculates routes, distance, and estimated travel time between locations
- **Inputs**: 
  - Source and destination from Backend Server
- **Outputs**: 
  - Route data, distance, and estimated time to Backend Server

#### 5.0 Bus Transport Service
- **Function**: Provides bus-related information including routes, availability, and pricing
- **Inputs**: 
  - Route query from Backend Server
- **Outputs**: 
  - Bus route details, live location, seat availability, fare, and ETA to Backend Server

#### 6.0 Taxi Service
- **Function**: Provides taxi-related information including availability and pricing
- **Inputs**: 
  - Route query from Backend Server
- **Outputs**: 
  - Taxi availability, fare estimation, and ETA to Backend Server

#### 7.0 Hybrid Route Optimization Module
- **Function**: Compares bus-only, taxi-only, and hybrid (bus + taxi) routes to find the most efficient option
- **Inputs**: 
  - All route data (bus, taxi, maps) from Backend Server
- **Outputs**: 
  - Optimized route, cost comparison, and time comparison to Backend Server

### Data Stores

#### D1: User Database
- **Content**: User account information, credentials, profile data
- **Access**: 
  - Read by Authentication Module (queries user data)
  - Written by Authentication/Registration processes (not shown in Level 1)

#### D2: Trip History Database
- **Content**: Completed and pending trip records, booking history
- **Access**: 
  - Written by Backend Server (stores trip details)
  - Read by Backend Server (retrieves stored trip data)

---

## Data Flow Summary

### Request Flow (User → System)
1. User sends **Login Credentials** and **Travel Request** to Mobile Application Interface
2. Mobile Application forwards credentials and request to Backend Server
3. Backend Server sends credentials to Authentication Module
4. Authentication Module queries User Database
5. Backend Server requests route data from Maps & Routing Service
6. Backend Server requests availability from Bus Transport Service
7. Backend Server requests availability from Taxi Service
8. Backend Server sends all collected data to Hybrid Route Optimization Module

### Processing Flow
9. Hybrid Route Optimization Module processes and compares all route options
10. Backend Server stores trip details in Trip History Database

### Response Flow (System → User)
11. Backend Server receives optimized recommendations
12. Backend Server sends recommended options, fare breakdown, and ETA to Mobile Application
13. Mobile Application displays travel options to User

---

## Diagram Notation

- **Rectangles**: External entities (User)
- **Circles/Bubbles**: Processes (numbered 1.0 through 7.0)
- **Open-ended Rectangles**: Data stores (D1, D2)
- **Arrows**: Data flows (labeled with data names)
- **Numbering**: Processes use decimal notation (1.0, 2.0, etc.) indicating they are decompositions from Level 0

---

## Use Cases

This DFD supports the following use cases:
1. **User Login**: Authentication flow through Process 3.0
2. **Route Planning**: Multi-service route calculation through Processes 4.0, 5.0, 6.0
3. **Route Optimization**: Cost and time comparison through Process 7.0
4. **Trip Booking**: Storage of trip details through Data Store D2
5. **Recommendation Display**: Presentation of optimized options to user

---

## Notes for Implementation

- All processes communicate through the Backend Server (Process 2.0) as the central coordinator
- Authentication must complete before route queries are processed
- Hybrid Route Optimization Module requires data from all three services (Maps, Bus, Taxi) before generating recommendations
- Trip History Database stores both completed and pending trips for user reference
- The system supports real-time data (live bus locations, current taxi availability)

