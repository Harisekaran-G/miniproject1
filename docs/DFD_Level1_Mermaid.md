# Level 1 DFD - Mermaid Format
## Efficient Urban Commute Hub via Hybrid Bus and Taxi Booking

This Mermaid diagram can be rendered in:
- GitHub/GitLab markdown
- VS Code with Mermaid extension
- Online Mermaid editor: https://mermaid.live

```mermaid
flowchart TD
    User[User<br/>Commuter]
    
    P1[1.0<br/>Mobile Application<br/>Interface]
    P2[2.0<br/>Backend Server]
    P3[3.0<br/>Authentication<br/>Module]
    P4[4.0<br/>Maps & Routing<br/>Service]
    P5[5.0<br/>Bus Transport<br/>Service]
    P6[6.0<br/>Taxi Service]
    P7[7.0<br/>Hybrid Route<br/>Optimization Module]
    
    D1[(D1: User<br/>Database)]
    D2[(D2: Trip History<br/>Database)]
    
    User -->|Login Credentials<br/>Travel Request| P1
    P1 -->|User Credentials<br/>Travel Request| P2
    P2 -->|User Credentials| P3
    P3 -->|Query| D1
    D1 -->|User Data| P3
    P3 -->|Auth Result| P2
    P2 -->|Source, Destination| P4
    P4 -->|Route Data, Distance,<br/>Estimated Time| P2
    P2 -->|Route Query| P5
    P5 -->|Bus Route Details,<br/>Live Location,<br/>Seat Availability,<br/>Fare, ETA| P2
    P2 -->|Route Query| P6
    P6 -->|Taxi Availability,<br/>Fare Estimation, ETA| P2
    P2 -->|All Route Data<br/>Bus, Taxi, Maps| P7
    P7 -->|Optimized Route,<br/>Cost Comparison,<br/>Time Comparison| P2
    P2 -->|Trip Details| D2
    D2 -->|Stored Trip Data| P2
    P2 -->|Recommended Option,<br/>Fare Breakdown, ETA| P1
    P1 -->|Travel Options,<br/>Recommendations| User
    
    style User fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style P1 fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style P2 fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style P3 fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style P4 fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style P5 fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style P6 fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style P7 fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style D1 fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style D2 fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
```

## Legend
- **Rectangles (Blue)**: External Entities
- **Rounded Rectangles (Orange)**: Processes
- **Cylinders (Purple)**: Data Stores
- **Arrows**: Data Flows (labeled)

