# GreenChain - Blockchain-based Green Energy Certificate System

A fully interactive React.js application simulating a comprehensive Blockchain-based Green Energy Certificate (GEC) system with real-time data integration, token management, and certificate issuance.

## Features

### 1. Green Energy Tokenization
- **Token Generation**: Automatic generation of green energy tokens with metadata (generator ID, source type, timestamp, location, units)
- **Token Assignment Engine**: Simulated FIFO and pro-rata allocation methods with audit logs
- **Token Wallets**: Comprehensive wallet views for both consumers and generators
- **Status Tracking**: Real-time token status (generated, allocated, consumed)

### 2. Real-Time Data Integration
- **Energy Streams**: Simulated real-time energy generation and consumption data
- **Multi-Source Support**: Solar, wind, hydro, biomass, and geothermal energy sources
- **Reconciliation Dashboard**: Visual representation of green token allocation to consumers
- **24/7 Monitoring**: Continuous tracking of energy flow

### 3. Green Energy Certificates (GECs)
- **Automatic Issuance**: Certificates generated when tokens match consumption
- **Unique Identification**: Each certificate includes unique ID, blockchain hash, and metadata
- **Certificate Repository**: Searchable database with filtering and verification options
- **Download & Verify**: Export certificates as JSON with blockchain verification
- **CO₂ Tracking**: Automatic calculation of carbon offset for each certificate

### 4. Consumer Portal
- **Energy Dashboard**: Real-time view of green vs. non-green energy mix
- **Certificate Viewer**: Search, filter, and verify earned certificates
- **Sustainability Metrics**: Track CO₂ savings, trees equivalent, and environmental impact
- **Token Wallet**: View allocated tokens and energy consumption history
- **Analytics**: Detailed charts and graphs showing energy usage trends

### 5. Generator Portal
- **Generator Dashboard**: Monitor real-time generation, tokens created, and certificates issued
- **Token Management**: View all generated tokens and their allocation status
- **Performance Analytics**: Track efficiency, uptime, and generation trends
- **Capacity Monitoring**: Real-time capacity utilization and contracted power tracking

### 6. Admin Portal
- **System Overview**: Monitor entire ecosystem health and statistics
- **Generator Management**: View and manage all registered generators
- **Blockchain Ledger**: Explore complete transaction history with immutable records
- **Reports & Analytics**: Export comprehensive reports in JSON/CSV format
- **Real-Time Metrics**: Track tokens, certificates, and allocations across the system

### 7. Blockchain Ledger (Simulated)
- **Immutable Transactions**: Complete audit trail of all token and certificate events
- **Cryptographic Hashes**: SHA-256 style hashes for verification
- **Transaction Types**: Token generation, allocation, and GEC issuance
- **Chain Verification**: Each transaction linked to previous hash
- **Searchable History**: Filter by transaction type and search by ID or hash

### 8. Reporting & Analytics
- **Interactive Dashboards**: Charts showing energy mix, GEC lifecycle, and performance
- **Export Functionality**: Download reports in JSON and CSV formats
- **Monthly Trends**: Track generation, allocation, and issuance over time
- **Source Distribution**: Pie charts showing renewable energy mix
- **Generator Comparison**: Performance metrics across all generators

## Technology Stack

- **React 18.3**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing with role-based access control
- **TailwindCSS**: Utility-first styling with custom design system
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Interactive data visualizations
- **Lucide React**: Modern icon library

## Quick Start

### Demo Accounts

The system includes three demo accounts for testing:

1. **Consumer Portal**
   - Email: `john@example.com`
   - Role: Consumer
   - Access: Dashboard, Certificates, Wallet, Analytics

2. **Generator Portal**
   - Email: `solar@example.com`
   - Role: Generator
   - Access: Dashboard, Tokens, Performance

3. **Admin Portal**
   - Email: `admin@example.com`
   - Role: Admin
   - Access: Dashboard, Generators, Ledger, Reports

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## Architecture

### Data Flow

```
Energy Generation → Token Creation → Blockchain Record → Token Allocation → GEC Issuance → Consumer Certificate
```

### Key Components

- **AuthContext**: Manages user authentication and role-based access
- **DataContext**: Centralizes mock data and state management
- **Layout**: Responsive navigation with role-specific menu items
- **Card Components**: Reusable card system with hover effects
- **Modal System**: Accessible modals for detailed views
- **Token Wallet**: Comprehensive token management interface
- **Certificate Repository**: Searchable and filterable certificate database

### Mock Data System

The application uses sophisticated mock data generation:
- 100+ tokens with realistic timestamps and allocation
- 5 active generators across different renewable sources
- Automatic certificate generation based on token allocation
- Complete blockchain transaction history
- Real-time energy data for 7 days

## Features by Portal

### Consumer Features
- View real-time energy consumption and green energy percentage
- Browse and download earned certificates
- Track environmental impact (CO₂ saved, trees equivalent)
- View token wallet with allocation history
- Detailed analytics with monthly trends

### Generator Features
- Monitor real-time energy generation
- View all created tokens and their status
- Track allocation rate and certificate issuance
- Performance analytics with efficiency metrics
- Compare against capacity and targets

### Admin Features
- System-wide monitoring dashboard
- Manage all generators and their metadata
- Explore complete blockchain ledger
- Generate comprehensive reports
- View allocation logs and audit trails

## Design System

### Color Palette
- **Emerald**: Primary actions, green energy indicators
- **Cyan**: Secondary actions, certificates
- **Blue**: Information, analytics
- **Amber**: Warnings, capacity indicators
- **Slate**: Backgrounds and neutral elements

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Readable with proper line height
- **Monospace**: Hashes, IDs, technical data

### Spacing
- Consistent 8px spacing system
- Generous padding for readability
- Clear visual hierarchy

## Future Enhancements

This simulation is designed for easy backend integration:

1. **Backend Integration**
   - Replace mock data with REST API calls
   - Connect to real database
   - Implement WebSocket for real-time updates

2. **Blockchain Integration**
   - Connect to actual blockchain (Ethereum, Hyperledger)
   - Implement smart contracts
   - Real cryptographic verification

3. **Authentication**
   - Integrate with Supabase Auth
   - OAuth providers
   - Multi-factor authentication

4. **Real-Time Features**
   - Live energy meter readings
   - Push notifications
   - Real-time allocation engine

5. **Advanced Analytics**
   - ML-based prediction models
   - Advanced reporting
   - Custom dashboard builders

## License

This is a demonstration project showcasing a simulated blockchain-based green energy certificate system.
