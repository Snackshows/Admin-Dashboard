# StoryBox Admin Panel

A production-ready React admin panel for StoryBox video streaming platform with responsive design and clean architecture.

## Features

- 🎨 Modern, responsive UI with mobile-first design
- 🔐 Secure authentication with JWT tokens
- 📊 Dashboard with analytics and charts
- 👥 User management with block/unblock functionality
- 🎬 Film and category management
- 📺 Episode and content management
- 💎 Subscription plans (Coin & VIP)
- 📱 Fully responsive (Mobile, Tablet, Desktop)
- 🏗️ Clean architecture with separation of concerns
- 🎯 Production-ready code structure

## Tech Stack

- **React** 18.2.0 - UI library
- **React Router** 6.20.0 - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Icons** - Icon library

## Project Structure

```
storybox-admin/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── index.css          # Global styles
│   ├── components/
│   │   ├── common/
│   │   │   ├── Modal.js           # Reusable modal component
│   │   │   ├── Table.js           # Reusable table component
│   │   │   └── Toggle.js          # Toggle switch component
│   │   └── layout/
│   │       ├── Header.js          # Top navigation bar
│   │       ├── Sidebar.js         # Side navigation menu
│   │       └── Layout.js          # Main layout wrapper
│   ├── context/
│   │   └── AuthContext.js         # Authentication state management
│   ├── pages/
│   │   ├── Login.js               # Login page
│   │   ├── Dashboard.js           # Dashboard with analytics
│   │   ├── Users.js               # User management
│   │   ├── FilmCategory.js        # Film categories
│   │   └── ... (other pages)
│   ├── services/
│   │   ├── apiConfig.js           # Axios configuration
│   │   └── api.js                 # API endpoints
│   ├── App.js                     # Main app component with routing
│   └── index.js                   # Entry point
├── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Step 1: Clone and Install

```bash
# Navigate to project directory
cd storybox-admin

# Install dependencies
npm install

# Or with yarn
yarn install
```

### Step 2: Environment Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=https://your-api-url.com/api
```

### Step 3: Start Development Server

```bash
npm start

# Or with yarn
yarn start
```

The app will open at `http://localhost:3000`

## API Integration

### Configuring Your API

All API calls are centralized in `src/services/api.js`. Update the base URL in `src/services/apiConfig.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.storybox.com';
```

### API Structure

The API service is organized by feature:

```javascript
// Authentication
authAPI.login(credentials)
authAPI.demoLogin()
authAPI.logout()

// Dashboard
dashboardAPI.getStats(dateRange)
dashboardAPI.getAnalytics()

// Users
userAPI.getAllUsers(params)
userAPI.blockUser(id)
userAPI.unblockUser(id)

// Film Categories
categoryAPI.getAllCategories()
categoryAPI.createCategory(data)
categoryAPI.updateCategory(id, data)
categoryAPI.deleteCategory(id)

// And more...
```

### Connecting Your Backend APIs

1. **Update API Base URL**: Edit `src/services/apiConfig.js`

2. **Configure Endpoints**: Update endpoint paths in `src/services/api.js` to match your backend

3. **Authentication**: The app uses JWT tokens stored in localStorage. Configure your backend to:
   - Return `{ token, user }` on successful login
   - Accept `Authorization: Bearer <token>` header
   - Return 401 for unauthorized requests

4. **Example API Response Format**:

```javascript
// Login Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Demo Admin",
    "email": "demo@admin.com",
    "avatar": "https://..."
  }
}

// List Response
{
  "data": [...],
  "total": 100,
  "page": 1,
  "perPage": 20
}

// Error Response
{
  "message": "Error description",
  "errors": {...}
}
```

### Testing with Dummy Data

The application includes dummy data for testing. To replace with real APIs:

1. Remove the dummy data arrays from page components
2. Uncomment the API calls in `useEffect` hooks
3. Update state with API responses

Example in `Users.js`:

```javascript
// Before (with dummy data)
const [users, setUsers] = useState([...dummyData]);

// After (with API)
const [users, setUsers] = useState([]);

useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  try {
    const data = await userAPI.getAllUsers();
    setUsers(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Responsive Breakpoints

The application uses the following breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Key Features Implementation

### 1. Authentication

```javascript
// Login
const { login } = useAuth();
const result = await login({ email, password });

// Demo Login
const { demoLogin } = useAuth();
await demoLogin();

// Logout
const { logout } = useAuth();
await logout();
```

### 2. Protected Routes

Routes are automatically protected using the `ProtectedRoute` component in `App.js`.

### 3. API Interceptors

- **Request**: Automatically adds JWT token to headers
- **Response**: Handles 401 errors and redirects to login

### 4. File Uploads

```javascript
import { uploadAPI } from './services/api';

// Upload Image
const formData = new FormData();
formData.append('image', file);
const response = await uploadAPI.uploadImage(file);

// Upload Video with Progress
await uploadAPI.uploadVideo(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

## Building for Production

```bash
# Create production build
npm run build

# Or with yarn
yarn build
```

The build files will be in the `build/` directory.

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to AWS/nginx

1. Build the project: `npm run build`
2. Upload `build/` contents to your server
3. Configure your web server to serve `index.html` for all routes

## Customization

### Changing Theme Colors

Edit CSS variables in `src/assets/styles/index.css`:

```css
:root {
  --primary-color: #FF0080;
  --secondary-color: #7C3AED;
  /* ... */
}
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.js`
3. Add menu item in `src/components/layout/Sidebar.js`

### Modifying API Endpoints

Edit `src/services/api.js` to add/modify endpoints:

```javascript
export const myNewAPI = {
  getData: () => apiClient.get('/my-endpoint'),
  postData: (data) => apiClient.post('/my-endpoint', data),
};
```

## Common Issues & Solutions

### CORS Errors

If you encounter CORS errors:
- Configure your backend to allow requests from your frontend domain
- Add proper CORS headers: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, etc.

### API URL Configuration

Make sure your `.env` file is properly configured:
```env
REACT_APP_API_BASE_URL=https://your-actual-api-url.com/api
```

### 401 Unauthorized Errors

- Check if JWT token is being sent in headers
- Verify token validity on backend
- Check if token is expired

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Loading States**: Show loading indicators during API calls
3. **Form Validation**: Validate user input before API calls
4. **Security**: Never commit `.env` files with sensitive data
5. **Performance**: Implement pagination for large data sets
6. **Testing**: Test on multiple devices and browsers

## Support

For issues or questions:
- Check the code comments for implementation details
- Review API integration examples in the codebase
- Ensure all environment variables are properly set

## License

This project is proprietary software for StoryBox admin panel.
