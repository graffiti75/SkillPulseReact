# SkillPulse React

A full-featured task management application.

## Preview

### App running on Google Chrome

![App running on Google Chrome](https://raw.githubusercontent.com/graffiti75/SkillPulseReact/refs/heads/master/media/Screen%20Recording%202026-02-04%20at%2017.10.28.gif)

### App running on Mobile device (Pixel 8a)

![App running on Mobile device Pixel 8a](https://raw.githubusercontent.com/graffiti75/SkillPulseReact/refs/heads/master/media/Screen%20Recording%202026-02-04%20at%2017.21.19.gif)

## Android

This app also was developed in Android. Please chech the Android implementation [here](https://github.com/graffiti75/SkillPulse).

## 📱 About

SkillPulse is a production-ready task management application that allows users to create, edit, and manage tasks with advanced features like date/time scheduling, filtering, and data export. The app includes Firebase authentication and Firestore database integration for persistent data storage.

## ✨ Features

-   **Firebase Authentication**: Secure email/password signup and login
-   **Task Management**: Create, edit, update, and delete tasks with persistence
-   **Date & Time Selection**: Intuitive two-step picker (date → time)
-   **Task Filtering**: Filter tasks by status, date, and other criteria
-   **Data Export**: Download tasks as CSV or JSON formats
-   **Dark/Light Theme**: Toggle between theme modes
-   **Responsive Design**: Optimized for mobile and desktop
-   **Smooth Animations**: Glassmorphism effects and transitions
-   **Real-time Updates**: Firestore integration for real-time data sync
-   **Unit Tests**: Comprehensive test coverage with Vitest

## 🛠️ Tech Stack

-   **Frontend Framework**: React 19.2
-   **Build Tool**: Vite 7.2
-   **Backend/Database**: Firebase (Authentication & Firestore)
-   **Testing**: Vitest 3.2 with React Testing Library
-   **Styling**: CSS3 with CSS Variables
-   **Code Quality**: ESLint & Prettier
-   **Utilities**: UUID for task IDs

## 📁 Project Structure

```
SkillPulse/
├── public/                    # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   │   └── LoginScreen/   # Login/Signup screen
│   │   ├── common/            # Shared components
│   │   │   ├── Alert.jsx
│   │   │   ├── Icons.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   └── FAB.jsx
│   │   └── tasks/             # Task-related components
│   │       ├── TaskCard.jsx
│   │       ├── TaskForm/
│   │       ├── DateTimePicker/
│   │       ├── DeleteConfirmation.jsx
│   │       └── EmptyState.jsx
│   ├── contexts/              # React Context providers
│   │   └── ThemeContext.jsx   # Theme management
│   ├── firebase/              # Firebase integration
│   │   ├── config.js          # Firebase configuration
│   │   ├── auth/              # Authentication functions
│   │   └── tasks/             # Task CRUD operations
│   ├── pages/                 # Page-level components
│   │   ├── TaskScreen/        # Main task management page
│   │   └── DownloadScreen/    # Data export page
│   ├── styles/                # Global styles
│   │   ├── variables.css      # CSS custom properties
│   │   ├── global.css         # Global styles
│   │   ├── _buttons.css       # Button styles
│   │   ├── _forms.css         # Form styles
│   │   ├── _typography.css    # Typography
│   │   ├── _animations.css    # Animations
│   │   └── _loading.css       # Loading states
│   ├── tests/                 # Unit tests
│   │   └── firebase/          # Firebase function tests
│   ├── utils/                 # Helper functions
│   │   ├── dateUtils.js       # Date formatting
│   │   ├── taskUtils.js       # Task utilities
│   │   └── index.js
│   ├── App.jsx                # Root component
│   └── main.jsx               # Entry point
├── index.html                 # HTML template
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite configuration
├── eslint.config.js           # ESLint configuration
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   npm or yarn package manager
-   [Firebase Account](https://firebase.google.com/) (for backend setup)

### 1. Scaffolding with Vite

The project was created using [Vite](https://vitejs.dev/), a modern build tool that's faster than Create React App:

```bash
npx create-vite@latest skillpulse-react --template react
cd skillpulse-react
npm install
```

### 2. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd SkillPulse

# Install dependencies
npm install
```

### 3. Firebase Setup

Create a Firebase project and get your credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore Database
5. Get your Firebase config from Project Settings

### 4. Environment Configuration

Create a `.env.local` file in the root directory with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command                       | Description                               |
| ----------------------------- | ----------------------------------------- |
| `npm run dev`                 | Start development server                  |
| `npm run build`               | Build for production (outputs to `dist/`) |
| `npm run preview`             | Preview production build locally          |
| `npm run lint`                | Run ESLint to check code quality          |
| `npm run lint:prettier:check` | Check code formatting                     |
| `npm run lint:prettier:fix`   | Auto-fix code formatting                  |
| `npm run test`                | Run unit tests once                       |
| `npm run test:watch`          | Run tests in watch mode                   |
| `npm run test:ui`             | Run tests with UI dashboard               |

## 🎯 Core Functionality

### Authentication

-   **Signup**: Create new account with email and password
-   **Login**: Secure Firebase Authentication
-   **Session Persistence**: Auto-login on page reload
-   **Logout**: Clear session and return to login screen

### Task Management

-   **Create Tasks**: Quick task creation from FAB button
-   **Edit Tasks**: Full task details editor with date/time picker
-   **Delete Tasks**: Confirmation dialog to prevent accidents
-   **Task Status**: Mark tasks as complete or pending
-   **Due Dates**: Set specific date and time for tasks

### Advanced Features

-   **Filtering**: Filter tasks by status, date range
-   **Autocomplete**: Task description suggestions
-   **Data Export**: Download all tasks as CSV or JSON
-   **Theme Toggle**: Light and dark mode support
-   **Real-time Sync**: Firestore database keeps data in sync across devices

### UI/UX

-   **Responsive Layout**: Adapts to mobile, tablet, and desktop
-   **Smooth Animations**: Glassmorphism, transitions, and hover effects
-   **Loading States**: User feedback during async operations
-   **Error Handling**: Informative error and success messages
-   **Accessibility**: Semantic HTML and keyboard navigation

## 🎨 Design System

### Color Palette

```css
--primary: #1e40af; /* Deep Blue */
--primary-light: #3b82f6; /* Light Blue */
--primary-dark: #1e3a8a; /* Darker Blue */
--accent: #f59e0b; /* Amber/Orange */
--accent-light: #fbbf24; /* Light Amber */
--success: #10b981; /* Emerald Green */
--danger: #ef4444; /* Red */
--warning: #f97316; /* Orange */
--neutral-50: #f9fafb; /* Almost White */
--neutral-900: #111827; /* Almost Black */
```

### Typography

-   **Primary Font**: DM Sans (Google Fonts) - Clean and modern
-   **Monospace Font**: Space Mono - For IDs and technical content
-   **Font Sizes**: Responsive scaling from mobile to desktop

### Design Elements

-   **Glassmorphism**: Frosted glass effect on login screen
-   **Card Layout**: Tasks displayed as interactive cards with shadows
-   **Floating Action Button**: Quick access to task creation
-   **Modal Dialogs**: Backdrop blur with centered content
-   **Icons**: Inline SVG components for consistency
-   **Spacing**: 8px grid system for consistent layouts
-   **Shadows**: Subtle elevation for depth and hierarchy

## 🔄 Architecture & Key Concepts

### Firebase Integration

SkillPulse uses Firebase for both authentication and data persistence:

-   **Firebase Authentication**: Email/password-based user authentication
-   **Firestore Database**: Real-time NoSQL database for task storage
-   **Environment Variables**: Secure credential management with `.env.local`

### React Patterns Used

| Concept               | Implementation                                        |
| --------------------- | ----------------------------------------------------- |
| State Management      | `useState` hook for local component state             |
| Side Effects          | `useEffect` hook for Firebase listeners and API calls |
| Context API           | `ThemeContext` for app-wide theme management          |
| Custom Hooks          | Task management logic in custom hooks                 |
| Conditional Rendering | Authentication state determines UI                    |
| Component Composition | Modular, reusable components                          |
| Props Drilling        | Minimized with context and lifted state               |

### Android to React Mapping

| Android (Kotlin/Jetpack Compose) | React Equivalent            |
| -------------------------------- | --------------------------- |
| `@Composable` functions          | Functional components       |
| `remember { mutableStateOf() }`  | `useState()` hook           |
| `LaunchedEffect`                 | `useEffect()` hook          |
| `CompositionLocal`               | React Context API           |
| `Material3 Theme`                | CSS custom properties       |
| `Modifier`                       | CSS classes / inline styles |
| `Column`, `Row`                  | Flexbox (`display: flex`)   |
| `LazyColumn`                     | `Array.map()` with key prop |
| `Android Room DB`                | Firestore Database          |
| `Firebase Auth`                  | Firebase Auth Library       |

## 📝 Key Files & Modules

### Entry Points

-   **`src/main.jsx`**: React app entry point, mounts App to DOM
-   **`src/App.jsx`**: Root component handling auth state and routing

### Authentication (Firebase)

-   **`src/firebase/config.js`**: Firebase initialization and configuration
-   **`src/firebase/auth/authOperations.js`**: Login, signup, logout functions
-   **`src/firebase/auth/authValidation.js`**: Input validation for auth forms
-   **`src/firebase/auth/authErrors.js`**: Error message handling
-   **`src/components/auth/LoginScreen/`**: Login and signup UI components

### Task Management

-   **`src/firebase/tasks/taskOperations.js`**: CRUD operations for tasks
-   **`src/firebase/tasks/taskQueries.js`**: Firestore query builders
-   **`src/firebase/tasks/taskMapper.js`**: Transform Firestore data to UI format
-   **`src/components/tasks/TaskCard.jsx`**: Individual task display
-   **`src/components/tasks/TaskForm/`**: Task creation and editing form
-   **`src/pages/TaskScreen/`**: Main task management page
-   **`src/pages/DownloadScreen/`**: Data export functionality

### UI Components

-   **`src/components/common/`**: Shared components (Alert, Modal, Loading, Icons, ThemeToggle)
-   **`src/components/layout/`**: Layout components (Header, FilterBar, FAB)
-   **`src/components/tasks/DateTimePicker/`**: Custom date and time selection component
-   **`src/components/tasks/DeleteConfirmation.jsx`**: Confirmation modal for deletions

### Styling & Theming

-   **`src/styles/variables.css`**: CSS custom properties and theme colors
-   **`src/styles/global.css`**: Global styles and resets
-   **`src/styles/_*.css`**: Modular component-specific styles
-   **`src/contexts/ThemeContext.jsx`**: Theme state management

### Utilities & Tests

-   **`src/utils/dateUtils.js`**: Date formatting and manipulation
-   **`src/utils/taskUtils.js`**: Task-related helper functions
-   **`src/firebase/tasks/csvConverter.js`**: CSV export functionality
-   **`src/firebase/tasks/downloadUtils.js`**: File download helpers
-   **`src/tests/firebase/`**: Unit tests for Firebase functions

## 🔧 Development & Customization

### Adding New Features

#### Creating a New Component

```bash
# 1. Create component directory
mkdir src/components/myfeature

# 2. Create component files
# src/components/myfeature/MyComponent.jsx
# src/components/myfeature/MyComponent.css
# src/components/myfeature/index.js

# 3. Export from index.js
export { default } from './MyComponent';
export * from './MyComponent';

# 4. Import and use in your app
import MyComponent from 'src/components/myfeature';
```

#### Adding a Custom Hook

```javascript
// src/hooks/useMyHook.js
import { useState, useEffect } from 'react';

export function useMyHook() {
	const [state, setState] = useState(null);

	useEffect(() => {
		// Your logic here
	}, []);

	return { state, setState };
}
```

### Modifying Theme Colors

Edit `src/styles/variables.css`:

```css
:root {
	--primary: #your-new-color;
	--accent: #your-accent-color;
	--success: #your-success-color;
	--danger: #your-danger-color;
}

/* Dark theme */
[data-theme='dark'] {
	--primary: #your-dark-primary;
	--background: #1a1a1a;
	--text: #ffffff;
}
```

### Adding Tests

Create test files in `src/tests/` with `.test.js` extension:

```javascript
// src/tests/myFeature.test.js
import { describe, it, expect } from 'vitest';
import { myFunction } from '../utils/myFunction';

describe('myFunction', () => {
	it('should do something', () => {
		expect(myFunction()).toEqual(expectedResult);
	});
});
```

Run tests with:

```bash
npm run test              # Run once
npm run test:watch       # Watch mode
npm run test:ui          # UI dashboard
```

### Deploying to Production

#### Build for Production

```bash
npm run build
# Output will be in dist/ directory
```

### Environment Variables

For different environments, create:

-   `.env.local` - Local development
-   `.env.production` - Production environment
-   `.env.staging` - Staging environment

All variables must start with `VITE_` to be exposed to the client:

```env
VITE_API_URL=https://api.example.com
VITE_FIREBASE_API_KEY=...
```

### Performance Optimization

-   **Code Splitting**: Automatically done by Vite
-   **Image Optimization**: Use modern formats (WebP)
-   **Lazy Loading**: Use React.lazy() for route components
-   **Bundle Analysis**: `npm run build` shows bundle size
-   **Tree Shaking**: Unused code automatically removed

## 🧪 Testing

SkillPulse includes comprehensive unit tests using Vitest and React Testing Library.

### Running Tests

```bash
npm run test              # Run all tests once
npm run test:watch       # Watch mode (re-run on changes)
npm run test:ui          # Launch test UI dashboard
```

### Test Structure

-   **`src/tests/firebase/`**: Firebase function tests
    -   `signup.test.js` - User registration tests
    -   `login.test.js` - User login tests
    -   `logout.test.js` - Logout functionality tests
    -   `onAuthChange.test.js` - Auth state listener tests

### Writing Tests

Example test structure:

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { signup } from '../firebase/auth';

describe('signup', () => {
	beforeEach(() => {
		// Setup before each test
	});

	it('should create a new user account', async () => {
		const result = await signup(email, password);
		expect(result.success).toBe(true);
	});
});
```

## 📚 Resources & Documentation

### Official Documentation

-   [React Documentation](https://react.dev/)
-   [Vite Documentation](https://vitejs.dev/)
-   [Firebase Documentation](https://firebase.google.com/docs)
-   [Vitest Documentation](https://vitest.dev/)

### Learning Resources

-   [React Hooks Guide](https://react.dev/reference/react)
-   [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
-   [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
-   [Web Accessibility](https://www.a11y-101.com/)

### Tools & Libraries Used

-   [UUID Generator](https://github.com/uuidjs/uuid)
-   [Google Fonts](https://fonts.google.com/)
-   [Firebase CLI](https://firebase.google.com/docs/cli)

## 🐛 Troubleshooting

### Firebase Connection Issues

**Problem**: `Firebase initialization failed`

-   **Solution**: Check `.env.local` file has all required Firebase credentials
-   Verify Firebase project is active in Firebase Console
-   Ensure API keys are correct and not rotated

### Port Already in Use

**Problem**: `Port 5173 is already in use`

-   **Solution**:
    ```bash
    npm run dev -- --port 3000  # Use different port
    ```

### Module Not Found Errors

**Problem**: `Cannot find module`

-   **Solution**:
    -   Run `npm install` again
    -   Check import paths are correct (case-sensitive on Linux/Mac)
    -   Clear node_modules: `rm -rf node_modules && npm install`

### Build Failures

**Problem**: `Build fails with unexpected token`

-   **Solution**:
    -   Run ESLint: `npm run lint`
    -   Fix formatting: `npm run lint:prettier:fix`
    -   Check Node.js version: `node --version` (should be v18+)

## 📄 License

This project is provided as-is for educational and personal use purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

Created as a React conversion of the original Android SkillPulse application.

---

**Last Updated**: January 2025  
**Current Version**: 0.0.0  
**Status**: Active Development
