# SkillPulse React

A task management application converted from Android (Kotlin/Jetpack Compose) to React.

## 🛠️ How This Project Was Created

### 1. Scaffolding with Vite

The project was created using [Vite](https://vitejs.dev/), a modern build tool that's faster than Create React App:

```bash
npx create-vite@latest skillpulse-react --template react
cd skillpulse-react
npm install
```

### 2. Adding Dependencies

The only additional dependency needed:

```bash
npm install uuid
```

- **uuid**: Generates unique IDs for tasks (similar to Android's UUID)

### 3. Project Structure

After scaffolding, the default Vite files were reorganized into a scalable structure:

```
skillpulse-react/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── LoginScreen.css
│   │   │   └── index.js
│   │   ├── common/         # Shared components
│   │   │   ├── Alert.jsx
│   │   │   ├── Alert.css
│   │   │   ├── Icons.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Modal.css
│   │   │   └── index.js
│   │   ├── layout/         # Layout components
│   │   │   ├── FAB.jsx
│   │   │   ├── FAB.css
│   │   │   ├── FilterBar.jsx
│   │   │   ├── FilterBar.css
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   └── index.js
│   │   └── tasks/          # Task-related components
│   │       ├── DateTimePicker.jsx
│   │       ├── DateTimePicker.css
│   │       ├── DeleteConfirmation.jsx
│   │       ├── DeleteConfirmation.css
│   │       ├── EmptyState.jsx
│   │       ├── EmptyState.css
│   │       ├── TaskCard.jsx
│   │       ├── TaskCard.css
│   │       ├── TaskForm.jsx
│   │       ├── TaskForm.css
│   │       └── index.js
│   ├── hooks/              # Custom React hooks (for future use)
│   ├── pages/              # Page-level components
│   │   ├── TaskScreen.jsx
│   │   ├── TaskScreen.css
│   │   └── index.js
│   ├── styles/             # Global styles
│   │   ├── variables.css   # CSS custom properties
│   │   └── global.css      # Global styles & animations
│   ├── utils/              # Helper functions
│   │   ├── dateUtils.js    # Date formatting utilities
│   │   ├── taskUtils.js    # Task creation & sample data
│   │   └── index.js
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
├── index.html              # HTML template
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

```bash
# 1. Navigate to the project folder
cd skillpulse-react

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `http://localhost:5173` |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check for code issues |

## ✨ Features

All features from the original Android app have been implemented:

- **Authentication**: Login/Sign-up screen with email and password
- **Task Management**: Create, edit, and delete tasks
- **Date/Time Picker**: Custom two-step picker (date → time)
- **Filtering**: Filter tasks by date
- **Autocomplete**: Suggestions while typing task descriptions
- **Responsive Design**: Works on mobile and desktop
- **Animations**: Smooth transitions and hover effects

## 🎨 Design System

### Colors (CSS Variables)

```css
--primary: #1E40AF;       /* Blue */
--primary-light: #3B82F6;
--accent: #F59E0B;        /* Amber */
--success: #10B981;       /* Green */
--danger: #EF4444;        /* Red */
```

### Typography

- **Body**: DM Sans (Google Fonts)
- **Monospace**: Space Mono (for IDs and stats)

### Components

- Glassmorphism effects on login screen
- Card-based task display with hover animations
- Floating Action Button (FAB) for adding tasks
- Modal dialogs with backdrop blur

## 🔄 Android to React Mapping

| Android (Kotlin/Compose) | React Equivalent |
|--------------------------|------------------|
| `@Composable` functions | Functional components |
| `remember { mutableStateOf() }` | `useState()` hook |
| `LaunchedEffect` | `useEffect()` hook |
| `NavController` | Conditional rendering / React Router |
| `Material3 Theme` | CSS custom properties |
| `Modifier` | CSS classes / inline styles |
| `Column`, `Row` | Flexbox (`display: flex`) |
| `LazyColumn` | `map()` over array |

## 📁 Key Files Explained

### `src/main.jsx`
Entry point that renders the App component into the DOM.

### `src/App.jsx`
Root component that handles authentication state and renders either LoginScreen or TaskScreen.

### `src/components/common/Icons.jsx`
SVG icons as React components (replaces Android vector drawables).

### `src/utils/taskUtils.js`
Task creation logic and sample data.

### `src/styles/variables.css`
CSS custom properties for consistent theming.

## 🔧 Customization

### Adding New Components

1. Create a new folder in `src/components/`
2. Add `.jsx` and `.css` files
3. Export from `index.js`
4. Import where needed

### Changing Colors

Edit `src/styles/variables.css`:

```css
:root {
  --primary: #your-color;
  --accent: #your-color;
}
```

### Connecting to a Backend

Replace the mock async operations in `TaskScreen.jsx` with actual API calls:

```javascript
// Instead of:
await new Promise((resolve) => setTimeout(resolve, 800));
setTasks(SAMPLE_TASKS);

// Use:
const response = await fetch('/api/tasks');
const tasks = await response.json();
setTasks(tasks);
```

## 📚 Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

## 📄 License

This project is for educational purposes.