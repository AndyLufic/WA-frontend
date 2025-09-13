# Copilot Instructions for WA-frontend

## Overview
This is a Vue.js frontend for a web application. The project uses Vue Router for navigation and is structured for clarity and modularity. The backend is likely in a sibling directory (`WA-backend`).

## Key Architecture
- **Entry Point:** `src/main.js` initializes the Vue app and router.
- **Routing:** All navigation is managed via `src/router/index.js`.
- **Views:** Main UI screens are in `src/views/` (e.g., `CustomerLogin.vue`, `ProviderLogin.vue`, `HomePage.vue`, `SignUp.vue`).
- **Assets:** Static files (e.g., images) are in `src/assets/`.
- **App Shell:** `src/App.vue` is the root component, containing layout and router outlet.

## Developer Workflows
- **Install dependencies:**
  ```sh
  npm install
  ```
- **Start development server (hot reload):**
  ```sh
  npm run serve
  ```
- **Build for production:**
  ```sh
  npm run build
  ```
- **Lint and auto-fix:**
  ```sh
  npm run lint
  ```

## Project Conventions
- **Component Naming:** Views are PascalCase and placed in `src/views/`.
- **Routing:** All navigation logic is centralized in `src/router/index.js`.
- **No explicit state management (Vuex/Pinia) detected**—use local component state or props.
- **Configuration:** Project-level config in `vue.config.js`, `babel.config.js`, and `jsconfig.json`.

## Integration Points
- **Backend:** Not directly referenced here, but likely communicates with `WA-backend` (API endpoints may need to be configured in the future).
- **Public assets:** Place static files in `public/` for direct serving.

## Examples
- To add a new page, create a `.vue` file in `src/views/` and register it in `src/router/index.js`.
- To update the favicon, replace `public/favicon.ico`.

## References
- See `README.md` for basic setup and commands.
- See [Vue CLI Configuration Reference](https://cli.vuejs.org/config/) for advanced config.

---
For questions about cross-component communication, backend integration, or project-specific patterns, review the router and main app files for examples.
