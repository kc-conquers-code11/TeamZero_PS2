# TrackBin: UX4G-Compliant Blockchain Waste Management System

TrackBin is a high-integrity, decentralized waste management platform designed to meet the official Government of India (UX4G) design standards. It ensures end-to-end traceability of waste through a QR-based verification system and an immutable blockchain ledger, eliminating manual entry falsification and ensuring accountability across all stakeholders.

## Core Features

### 1. QR-Based Verification Protocol
Every waste submission generates a unique, metadata-rich QR token.
- **Traceability**: Linkage between citizen, collector, and processing facility.
- **Data Integrity**: Eliminates "phantom collections" by requiring physical QR scanning at every node.
- **Offline Ready**: Citizens can download QR "Access Passes" for physical verification during pickup.

### 2. Blockchain Transparency (Immutable Ledger)
All validated transactions are recorded on a public blockchain explorer.
- **Real-time Auditing**: Public access to waste lifecycle from submission to end-processing (Recycling/Landfill).
- **Public Trust**: Decentralized verification prevents unauthorized data modification by any single entity.

### 3. Role-Based Governance Dashboards
- **Citizen**: Submit waste, track lifecycle, and earn "Eco-Warrior" badges.
- **Collector**: Route-optimized collection with integrated QR terminal.
- **Processing Facility**: Verification terminal for batch receipts and processing analytics.
- **Authority**: High-level regional oversight with smart anomaly detection.

### 4. Accessibility & Multi-lingual Support
- **UX4G Standards**: Adheres to official government portal guidelines with a professional high-contrast aesthetic.
- **Language Inclusivity**: Full support for **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)**.
- **Inclusive Controls**: Integrated font-size scaling (A+, A, A-) and "Skip to Content" accessibility features.

## Technical Specifications

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS (UX4G Color Palette: Navy #1a2634, Saffron #ea580c)
- **Animations**: Framer Motion (Optimized for micro-interactions)
- **Infrastructure**: Lucide React Icons, Recharts for data visualization, `qrcode.react` for tokenization.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Verify Compliance**:
   Open the application and use the TopBar accessibility controls to verify UX4G compliance and language switching.

---

**TrackBin** is built for the **Smart India Hackathon** ecosystem, providing a scalable, transparent, and citizen-centric solution for modern urban waste challenges.
