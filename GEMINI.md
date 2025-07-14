# Project Guidelines

This is a React project. When making changes, please adhere to the following:

- **Code Style:** Follow existing ESLint rules and Prettier formatting.
- **Component Structure:** Keep components small, reusable, and focused on a single responsibility.
- **State Management:** Prefer local component state for simple UI interactions. For global state, consider using React Context or a dedicated state management library if already in use.
- **Styling:** Use CSS modules or styled-components as per existing patterns.
- **Testing:** Write unit tests for new components and features using React Testing Library and Jest.
- **File Naming:** Use PascalCase for component files (e.g., `MyComponent.js`) and camelCase for other JavaScript files (e.g., `utilityFunctions.js`).
- **Accessibility:** Ensure all UI changes are accessible.

## Available Scripts

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Builds the app for production.

## Important Directories

- `src/components/`: Contains all React components.
- `public/`: Contains static assets.
- `src/data/`: Contains data files.
