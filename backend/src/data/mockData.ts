/**
 * Mock Data for Bus and Taxi Services
 * Used for Phase 1 MVP demonstration
 */

export interface BusOption {
  routeNo: string;
  eta: number; // in minutes
  fare: number; // in currency units
  seatAvailable: boolean;
  coveragePercent: number; // percentage of route covered by bus
  source: string;
  destination: string;
  distance: number; // in km
}

export interface TaxiOption {
  eta: number; // in minutes
  farePerKm: number; // fare per kilometer
  totalFare: number; // total fare for the route
  source: string;
  destination: string;
  distance: number; // in km
  available: boolean;
}

export interface RouteData {
  source: string;
  destination: string;
  distance: number; // in km
  estimatedTime: number; // in minutes (direct route)
}

// Mock Bus Routes Database
export const mockBusRoutes: BusOption[] = [
  {
    routeNo: "B12",
    eta: 35,
    fare: 25,
    seatAvailable: true,
    coveragePercent: 70,
    source: "Downtown",
    destination: "Airport",
    distance: 15
  },
  {
    routeNo: "B15",
    eta: 28,
    fare: 20,
    seatAvailable: true,
    coveragePercent: 85,
    source: "Downtown",
    destination: "Airport",
    distance: 15
  },
  {
    routeNo: "B08",
    eta: 45,
    fare: 30,
    seatAvailable: false,
    coveragePercent: 60,
    source: "Downtown",
    destination: "Airport",
    distance: 15
  },
  {
    routeNo: "B22",
    eta: 40,
    fare: 22,
    seatAvailable: true,
    coveragePercent: 75,
    source: "City Center",
    destination: "Mall",
    distance: 8
  },
  {
    routeNo: "B05",
    eta: 25,
    fare: 18,
    seatAvailable: true,
    coveragePercent: 90,
    source: "City Center",
    destination: "Mall",
    distance: 8
  }
];

// Mock Taxi Data
export const mockTaxiData: TaxiOption[] = [
  {
    eta: 20,
    farePerKm: 15,
    totalFare: 180,
    source: "Downtown",
    destination: "Airport",
    distance: 12,
    available: true
  },
  {
    eta: 15,
    farePerKm: 18,
    totalFare: 144,
    source: "City Center",
    destination: "Mall",
    distance: 8,
    available: true
  },
  {
    eta: 25,
    farePerKm: 15,
    totalFare: 225,
    source: "Downtown",
    destination: "Airport",
    distance: 15,
    available: true
  }
];

// Mock Users Database (in-memory for MVP)
export interface User {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
  name: string;
}

export const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    password: "demo123",
    name: "Demo User"
  },
  {
    id: "2",
    email: "user@test.com",
    password: "test123",
    name: "Test User"
  },
  {
    id: "3",
    email: "admin@booking.com",
    password: "admin123",
    name: "Admin User"
  }
];

// Mock Route Calculation (simulates Maps & Routing Service)
export function calculateRoute(source: string, destination: string): RouteData {
  // Simulate route calculation
  const routes: { [key: string]: RouteData } = {
    "Downtown-Airport": {
      source: "Downtown",
      destination: "Airport",
      distance: 15,
      estimatedTime: 30
    },
    "City Center-Mall": {
      source: "City Center",
      destination: "Mall",
      distance: 8,
      estimatedTime: 15
    },
    "Airport-Downtown": {
      source: "Airport",
      destination: "Downtown",
      distance: 15,
      estimatedTime: 30
    }
  };

  const routeKey = `${source}-${destination}`;
  const reverseKey = `${destination}-${source}`;
  
  if (routes[routeKey]) {
    return routes[routeKey];
  }
  
  if (routes[reverseKey]) {
    return {
      source: routes[reverseKey].destination,
      destination: routes[reverseKey].source,
      distance: routes[reverseKey].distance,
      estimatedTime: routes[reverseKey].estimatedTime
    };
  }

  // Default route if not found
  return {
    source,
    destination,
    distance: 10,
    estimatedTime: 20
  };
}

