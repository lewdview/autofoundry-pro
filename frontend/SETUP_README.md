# BAT Frontend - Clean Setup

This is a clean copy of the Business Automation Tracker (BAT) frontend, configured to connect to the backend.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts

## Quick Start

### Prerequisites
Make sure the backend is running first:
```bash
cd ../bat-backend-clean
npm start
```
Backend should be accessible at `http://localhost:3000`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   # or use the startup script
   ./start.sh
   ```

3. **Frontend will run on**: `http://localhost:3001`

## Configuration

### Environment Variables
The frontend uses environment variables defined in `.env`:

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3000)
- `VITE_PORT` - Frontend port (default: 3001)
- `VITE_ENABLE_DEBUG` - Enable debug mode

### Backend Connection
The frontend is pre-configured to connect to the backend at:
- **Backend URL**: `http://localhost:3000`
- **Health Check**: `http://localhost:3000/health`

## Testing Connection

Test the backend connection:
```bash
node test-backend-connection.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

### Core Components
- **AutomationInterface** - Main automation workflow
- **AutomationDashboard** - Progress tracking dashboard  
- **StageProgress** - Step-by-step progress visualization
- **CreditManager** - Credit usage management
- **ErrorBoundary** - Error handling wrapper

### UI Components (shadcn/ui)
Complete set of accessible, customizable UI components:
- Forms, buttons, cards, dialogs
- Navigation, menus, tooltips
- Charts, progress indicators
- Toast notifications

### API Integration
- Comprehensive API service with error handling
- Automatic retry logic with exponential backoff
- Request timeout and cancellation
- Type-safe API calls

### Error Handling
- Custom error types (AppError, NetworkError, TimeoutError)
- Global error boundary
- Toast notifications for user feedback
- Detailed error logging

## API Endpoints Integration

The frontend integrates with all backend endpoints:

### Health & System
- `GET /health` - Server health check
- `GET /api/automation/status` - Automation service status

### Two-Question Automation
- `POST /api/automation/two-question-start` - Start automation flow
- `GET /api/automation/session/{id}` - Get session status
- `GET /api/automation/stream/{id}` - Server-sent events stream

### Business Services
- `POST /api/niche/analyze` - Niche analysis
- `POST /api/competitor/find` - Find competitors
- `POST /api/registration/register` - Business registration
- `POST /api/pitch-deck/create` - Generate pitch deck
- `GET /api/funding/sources` - Find funding sources
- `GET /api/progress/session/{id}` - Progress tracking

## Troubleshooting

### Backend Connection Issues
1. Verify backend is running: `curl http://localhost:3000/health`
2. Check CORS configuration in backend
3. Verify API_BASE URL in frontend code

### Build Issues
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf .vite`
3. Check TypeScript errors: `npm run lint`

### Port Conflicts
- Frontend: Change port in `vite.config.ts` and `.env`
- Backend: Update `VITE_API_BASE_URL` to match backend port

## Development Tips

1. **Hot Reload**: Vite provides fast hot module replacement
2. **Component Development**: Use shadcn/ui components for consistency
3. **API Debugging**: Enable debug mode with `VITE_ENABLE_DEBUG=true`
4. **Type Safety**: Leverage TypeScript for better development experience

## Production Build

```bash
npm run build
npm run preview
```

Built files will be in the `dist/` directory.

## Support

- Frontend Framework: React + Vite documentation
- UI Components: shadcn/ui documentation  
- API Integration: See backend `API_ENDPOINTS.md`
- Styling: Tailwind CSS documentation
