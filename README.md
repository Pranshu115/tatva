# AI Procurement Optimizer

Clean, minimal UI for AI-powered procurement workflow with 4 key pages.

## Features

1. **BOQ Normalize** - Upload BOQ files and map to normalized catalog with AI confidence scores
2. **Vendor Select** - Compare vendors by price/lead time and select best options (INR pricing)
3. **Substitution** - Review AI-suggested alternatives with cost savings (in INR)
4. **Create PO** - Group items by vendor and confirm purchase orders

## Setup

```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Run development servers
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

## Tech Stack

- Frontend: React + Vite, React Router, Lucide Icons
- Backend: Node.js + Express
- Styling: Clean CSS with soft colors (#4f46e5 primary, minimal tables/cards)
