# Manufacturing ERP System

A comprehensive, production-ready full-stack ERP system for garment manufacturing with integrated Express server, featuring React Router 6 SPA mode, TypeScript, Vitest, Zod, and modern tooling.

## 🚀 Tech Stack

- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrated with Vite dev server
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons
- **Package Manager**: PNPM

## 📦 Modules

### Complete Integrated Modules:

1. **Quality Management** - Complete quality control system
   - Incoming, In-Line, and Final Inspections
   - AQL Standards, Defect Management
   - Supplier Quality Rating
   - Customer Complaints & Returns
   - Quality Training & KPIs

2. **Sales & Export** - Complete sales management
   - Sales Orders, Quotations, Invoices
   - Buyers Management
   - Contracts, Shipments
   - Export Documentation
   - Sales Reports & Analytics

3. **Procurement** - Complete procurement system
   - Purchase Requisitions, RFQ, Purchase Orders
   - Goods Receipt, Supplier Invoices
   - Supplier Evaluation & Contracts
   - Procurement Reports

4. **Accounting** - Complete accounting management
   - General Ledger, Chart of Accounts
   - Accounts Receivable/Payable
   - Bank Management
   - Budgets, Financial Reports
   - Pre-Costing & Actual Costing

5. **Production** - Manufacturing Execution System (MES)
   - Production Orders, Work Orders
   - Production Lines, WIP Tracking
   - Defects & Rework Management
   - Batch Tracking, Efficiency Metrics

6. **Inventory** - Warehouse Management
   - Multi-Warehouse Management
   - Raw Materials & Stock Items
   - Batch & Lot Tracking
   - Stock Movements & Transfers
   - Inventory Valuation

7. **PLM** - Product Lifecycle Management
   - Style Management
   - Tech Packs, BOMs
   - Size Charts & Color Variants
   - Document Library
   - Approval Workflows

8. **HRM** - Human Resource Management
   - Employee Management
   - Attendance & Shifts
   - Leave Management
   - Payroll Processing
   - Performance Reviews

9. **MRP II** - Material Requirements Planning
   - Demand Forecasting
   - Master Production Schedule
   - Material Requirements
   - Capacity Planning
   - Line Balancing

10. **IoT** - Internet of Things
    - Device Management
    - Real-time Monitoring
    - Alerts & Notifications
    - Sensor Readings
    - Machine Metrics

11. **CMMS** - Maintenance Management
    - Maintenance Schedules
    - Work Orders
    - Breakdown Records
    - Spare Parts Management
    - MTBF/MTTR Tracking

## 🗄️ Database

The system uses PostgreSQL (Neon) with Prisma ORM. Database connection is configured via environment variables.

### Setup Database

1. Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

2. Run migrations:
```bash
pnpm db:migrate
```

3. Generate Prisma Client:
```bash
pnpm db:generate
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ (via nvm recommended)
- PNPM 10+

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

## 📁 Project Structure

```
client/                   # React SPA frontend
├── pages/               # Route components
├── components/           # React components
│   ├── ui/              # UI component library
│   ├── shared/          # Shared components
│   └── [module]/        # Module-specific components
├── store/               # Data stores and mock data
├── locales/             # i18n translations
└── lib/                 # Utilities

server/                   # Express API backend
├── routes/              # API route handlers
├── db.ts                # Database connection
└── index.ts             # Server setup

shared/                   # Shared types
├── api.ts               # API interfaces
└── types.ts             # TypeScript types

prisma/                   # Prisma configuration
├── schema.prisma        # Database schema
└── migrations/          # Database migrations
```

## 🔌 API Endpoints

### Sales
- `GET /api/sales/buyers` - Get all buyers
- `POST /api/sales/buyers` - Create buyer
- `GET /api/sales/orders` - Get all sales orders
- `POST /api/sales/orders` - Create sales order
- `PUT /api/sales/orders/:id` - Update sales order

### Production
- `GET /api/production/orders` - Get production orders
- `POST /api/production/orders` - Create production order
- `GET /api/production/work-orders` - Get work orders
- `POST /api/production/work-orders` - Create work order

### Inventory
- `GET /api/inventory/warehouses` - Get warehouses
- `GET /api/inventory/materials` - Get raw materials
- `POST /api/inventory/materials` - Create raw material
- `GET /api/inventory/stock` - Get stock items

### Quality
- `GET /api/quality/inspections` - Get quality inspections
- `POST /api/quality/inspections` - Create inspection

### Procurement
- `GET /api/procurement/suppliers` - Get suppliers
- `POST /api/procurement/suppliers` - Create supplier
- `GET /api/procurement/orders` - Get purchase orders
- `POST /api/procurement/orders` - Create purchase order

## 🌐 Internationalization

The system supports both Arabic and English:
- Switch language using the language switcher in the header
- All UI components are fully localized
- RTL support for Arabic

## 🎨 Features

- **MegaMenu Navigation**: Non-scrolling horizontal menu across all modules
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Works on all screen sizes
- **Type Safety**: Full TypeScript coverage
- **Form Validation**: Zod schema validation
- **Database Integration**: PostgreSQL with Prisma ORM
- **API Integration**: RESTful API endpoints

## 📝 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm typecheck` - TypeScript validation
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:deploy` - Deploy migrations
- `pnpm db:studio` - Open Prisma Studio

## 🔒 Security

- Environment variables for sensitive data
- `.env` files are gitignored
- Database credentials stored securely
- SSL connection to database

## 📄 License

Private - All rights reserved

## 👥 Contributors

- Development Team

## 🔗 Links

- Repository: https://github.com/Bodymobarez/ManufacureERP.git
- Database: Neon PostgreSQL

