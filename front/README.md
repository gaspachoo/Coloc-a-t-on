# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

To launch the server please type:

```bash
npm install
npm run dev
```

lucide-react :
```bash
npm install leaflet react-leaflet lucide-react
npm install -D @types/leaflet
```


# Do-It Coloc-a-t’on — Frontend

This repository contains the **frontend** of the *Do-It Coloc-a-t’on* project:  
an interactive web application that allows students to **discover, search, filter and manage shared apartments (colocs)** around Centrale Méditerranée using a map-based interface.

The frontend is built with **React + TypeScript + Vite**, and is designed to be **fully compatible with a future backend API**.

---

## Tech Stack

- **React 18**
- **TypeScript**
- **Vite**
- **React Router**
- **Leaflet / OpenStreetMap**
- **Lucide-react (icons)**
- **CSS (custom, no UI framework)**

---

## Main Features

### Interactive Map
- OpenStreetMap integration with Leaflet
- Custom markers for each coloc (logo or default)
- Active coloc highlighted
- Popup opens from map or favorites
- Automatic recentering on selection

### Search, Filters & Favorites
- Search by coloc name or address
- Advanced filters (rent, surface, rooms, A-t’euf)
- Favorites system synchronized across the app
- Bottom preview bar with essential coloc information

### Coloc Detail Page
- Full coloc description page
- Photo carousel with lightbox
- Internal scrolling for long content
- Buttons for favorites and map navigation

---

## Application Architecture

The frontend follows a **component-based architecture** with a centralized UI state.

### Global State Management
- A custom **UI Context** is used to manage:
  - selected coloc
  - filters
  - favorites
- This ensures consistent behavior across the map, sidebar, preview bar, and detail pages.

---

## Project Structure & File Roles

### `src/main.tsx`
Application entry point.  
Initializes React, React Router, and wraps the app with the global UI context provider.

---

### `src/App.tsx`
Main application component.  
Defines the global layout and application routes.

---

### `src/context/uiContext.tsx`
Central UI state manager.  
Handles:
- selected coloc
- filters
- favorites
- UI reset logic

All components consume this context to stay synchronized.

---

### `src/types/filters.ts`
Defines:
- the `Filters` TypeScript interface
- default filter values

Used across the app to ensure consistent filtering behavior.

---

### `src/utils/applyFilters.ts`
Pure utility function that applies:
- text search (name or address)
- numeric filters (rent, surface)
- room selection logic
- A-t’euf filter

This function is the single source of truth for filtering colocs.

---

### `src/mock/colocs.ts`
Temporary mock data source.  
Contains:
- coloc objects
- helper functions (`getColocById`)

Designed to be easily replaced by backend API calls.

---

## Components

### `src/components/layout/`
Layout-level components used across all pages.

- **LeftRail.tsx**  
  Persistent left navigation bar with icons (filters, favorites, settings).

- **SidePanel.tsx**  
  Slide-in panel that displays filters or favorites depending on the active mode.

---

### `src/components/home/`
Components specific to the home (map) page.

- **MapView.tsx**  
  Handles Leaflet map rendering, markers, popups, and map interactions.

- **TopSearchBar.tsx**  
  Search input with selectable search field (name / address).

- **ColocPreviewBar.tsx**  
  Bottom preview bar shown when a coloc is selected.

- **SidebarFilters.tsx**  
  UI for all filters (rent, surface, rooms, A-t’euf).

- **SidebarFavorites.tsx**  
  Displays the list of favorite colocs and allows map selection.

---

### `src/pages/`
Page-level components mapped to routes.

- **HomePage.tsx**  
  Main page containing the map, search bar, filters, and preview bar.

- **ColocDetailPage.tsx**  
  Detailed page for a specific coloc, including photos and description.

---

### `src/services/` (planned)
Will contain API services once backend integration starts.

Example:
- `colocsApi.ts` → fetch colocs from backend

---

### `src/assets/`
Static assets such as logos and images.

---

### `src/App.css`
Global styles for the entire application.  
Includes layout rules, grids, preview bar design, and responsive behavior.

---

## Responsiveness

- Optimized for all desktop screen sizes
- Fixed + flexible layout strategy (`px` + `fr`)
- No layout overflow
- Mobile version planned as a future step

---

## Next Steps

- Backend integration
- Authentication
- CRUD operations for colocs
- Mobile responsive version
