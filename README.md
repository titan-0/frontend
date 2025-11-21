# Open Positions Frontend (React + Vite + Tailwind)

A modern, high-performance UI for managing trading positions built with React 18, Vite, and Tailwind CSS.


## Run using docker

1. Build the frontend using:
    `docker build -t frontend .`

2. Open the docker and run the frontend container using      following command:
    `docker run -p 5173:5173 -e VITE_BACKEND_URL=http://host.docker.internal:8000 frontend`

    

## Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm 9+** (comes with Node.js)
- **FastAPI Backend** running on `http://localhost:8000` (see backend README)

## Installation

### 1. Install Dependencies

From PowerShell in the `frontend` folder:

```powershell
npm install
```

This installs:
- `react` & `react-dom` - UI library
- `vite` - Build tool
- `tailwindcss` - Styling
- `lucide-react` - Icon library
- `postcss` - CSS processing

### 2. Verify Backend is Running

Make sure your FastAPI backend is running:

```powershell
# From backend folder (in separate terminal)
cd ../backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

Backend should be at: `http://localhost:8000`

## Development

### Start Development Server

From the `frontend` folder:

```powershell
npm run dev
```

**Default URL:** `http://localhost:5173`

The dev server features:
- 🔄 **Hot Module Replacement (HMR)** - Changes reflect instantly
- 🔗 **API Proxy** - `/api` requests automatically proxy to backend
- 🎯 **Fast Refresh** - React components update without losing state

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginPage.jsx          # Authentication UI
│   │   ├── Header.jsx              # Navigation & branding
│   │   ├── PositionsTable.jsx      # Open positions display
│   │   ├── BrokerOrdersTable.jsx   # Broker orders view
│   │   ├── InternalOrdersTable.jsx # Internal orders view
│   │   ├── TradesTable.jsx         # Completed trades display
│   │   ├── PlaceOrderForm.jsx      # Order submission form
│   │   ├── FiltersBar.jsx          # Data filtering controls
│   │   └── SlideOver.jsx           # Modal/drawer component
│   ├── lib/
│   │   └── api.js                  # API client & utilities
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/                         # Static assets
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── package.json                    # Dependencies & scripts
└── README.md                       # This file
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `LoginPage.jsx` | User authentication with JWT |
| `Header.jsx` | Navigation bar & user menu |
| `PositionsTable.jsx` | Display open trading positions |
| `BrokerOrdersTable.jsx` | Broker-side orders list |
| `InternalOrdersTable.jsx` | Internal orders tracking |
| `TradesTable.jsx` | Completed trades history |
| `PlaceOrderForm.jsx` | Submit new orders |
| `FiltersBar.jsx` | Filter & search data |

## Available Scripts

### Development
```powershell
# Start dev server with hot reload
npm run dev
```

### Build
```powershell
# Create optimized production build
npm run build
```

Outputs to `dist/` folder - ready for deployment.

### Preview
```powershell
# Preview production build locally
npm run preview
```

Serves the `dist/` folder locally to test production build.

### Linting
```powershell
# Check code quality
npm run lint
```

## API Integration

### Authentication Flow

1. **Login** - Submit credentials to `/api/login`
   ```javascript
   const response = await fetch('http://localhost:8000/api/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   })
   const { access_token } = await response.json()
   localStorage.setItem('authToken', access_token)
   ```

2. **Store Token** - Save in localStorage
   ```javascript
   localStorage.setItem('authToken', data.access_token)
   ```

3. **Use Token** - Include in API requests
   ```javascript
   fetch('/api/positions_json', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('authToken')}`
     }
   })
   ```

### Available Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/login` | POST | User authentication |
| `/api/positions_json` | GET | List open positions |
| `/api/internal_order` | GET | List internal orders |
| `/api/broker_order` | GET | List broker orders |
| `/api/trades` | GET | List completed trades |
| `/api/aliases` | GET | List trader aliases |
| `/health` | GET | Backend health check |

### Query Parameters

All list endpoints support pagination and filtering:

```
GET /api/positions_json?page=1&limit=20&ticker=AAPL&broker=goldman_sachs
```

Parameters:
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 20)
- `broker` - Filter by broker
- `client_id` - Filter by client
- `ticker` - Filter by ticker symbol
- `product` - Filter by product
- `action` - Filter by action type
- `account` - Filter by account

## Configuration

### Environment Variables

Create a `.env` file in the `frontend` folder:

```env
VITE_BACKEND_URL=http://localhost:8000
```

Override backend URL if needed. Used in `vite.config.js`.

### Tailwind CSS

Customize styling in `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
    },
  },
}
```

### Vite Configuration

Build settings in `vite.config.js`:

```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
}
```

## Development Workflow

### 1. Start Backend
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

### 2. Start Frontend (new terminal)
```powershell
cd frontend
npm run dev
```

### 3. Open in Browser
Navigate to: `http://localhost:5173`

### 4. Login
Use demo credentials to test (any email/password if backend allows demo mode)

### 5. Develop & Test
- Frontend auto-reloads on code changes
- Backend auto-reloads with `--reload`
- Check network tab in DevTools to monitor API calls

## Building for Production

### Create Production Build

```powershell
npm run build
```

This creates an optimized build in the `dist/` folder:
- ✅ Minified JavaScript
- ✅ Optimized CSS
- ✅ Asset hashing for caching
- ✅ Tree-shaking unused code

### Test Production Build Locally

```powershell
npm run preview
```

Then visit the URL shown (typically `http://localhost:4173`).

### Deploy to Production

Option 1: **Serve with Static Web Server**
```powershell
# Copy dist/ to web server (Nginx, Apache, etc.)
npm run build
# Upload dist/ to your hosting
```

Option 2: **Docker**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
RUN npm install -g serve
COPY --from=build /app/dist /app/dist
EXPOSE 3000
CMD ["serve", "-s", "/app/dist", "-l", "3000"]
```

Option 3: **Integrate with FastAPI**
Serve `dist/` as static files from FastAPI backend.

## Troubleshooting

### `npm install` fails
```powershell
# Clear npm cache
npm cache clean --force
# Remove node_modules
Remove-Item -Recurse node_modules
# Reinstall
npm install
```

### API requests fail with CORS error
- Verify backend is running on `http://localhost:8000`
- Check vite.config.js proxy configuration
- Ensure backend has CORS middleware enabled

### Dev server won't start
```powershell
# Check if port 5173 is in use
netstat -ano | findstr :5173
# Use different port
npm run dev -- --port 3000
```

### Hot reload not working
1. Check file changes are saved
2. Verify Vite version is latest: `npm list vite`
3. Restart dev server: `Ctrl+C` then `npm run dev`

### Token expires during development
- Tokens are stored in `localStorage`
- Check browser DevTools → Application → Local Storage
- Login again to get a new token

### Components not updating after backend changes
- Ensure backend is running with `--reload`
- Check network tab in DevTools for 5xx errors
- Review backend terminal for exception messages

## Performance Tips

- 📦 Use code splitting for large components
- 🖼️ Optimize images before adding to project
- 🔄 Use React.memo for expensive components
- 🎯 Monitor bundle size: `npm run build -- --analyze`
- ⚡ Enable gzip compression on server

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Lucide React Icons](https://lucide.dev)
- [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly in dev environment
4. Commit with clear messages
5. Submit pull request

## Support

For issues:
1. Check browser console for errors (F12)
2. Review network requests in DevTools
3. Check backend logs for API errors
4. Verify environment variables are set
5. Ensure backend is running and accessible
- `POST /place_order` → places a new order (JSON payload)
- `POST /exit_position` → exits one or more positions (payload: `{ orders: [{ order_id }] }`)

If `GET /positions_json` is missing, I can add it to `open_positions_app/main.py`.
