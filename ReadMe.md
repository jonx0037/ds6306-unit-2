# NBA Player Analysis Visualization

A React + TypeScript + Vite application for visualizing NBA player statistics and analysis. This project includes interactive visualizations using Recharts to explore player heights, weights, positions, and their evolution over time.

This project was forked from [MSDS_6306_Doing-Data-Science](https://github.com/BivinSadler/MSDS_6306_Doing-Data-Science.git) and enhanced with React-based visualizations.

## Repository

- GitHub: [https://github.com/jonx0037/ds6306-unit-2](https://github.com/jonx0037/ds6306-unit-2)
- Live Demo: [https://jonx0037.github.io/ds6306-unit-2/](https://jonx0037.github.io/ds6306-unit-2/)

## Contact

Jonathan Rocha - jarocha@smu.edu

## Features

- Height and weight relationship analysis by position
- Position distribution visualization
- Height distribution across positions
- Height evolution over time
- 3D visualization of player metrics
- Education and income correlation analysis

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/jonx0037/ds6306-unit-2.git
cd ds6306-unit-2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment process is triggered whenever changes are pushed to the main branch.

### Manual Deployment

To deploy manually:

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

### Deployment Configuration

- The application is configured to deploy to GitHub Pages using the `gh-pages` package
- Vite is configured with the correct base URL for GitHub Pages
- GitHub Actions workflow automatically handles deployment on push to main
- All assets (CSV files, images) are served from the `public` directory

## ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Recharts
- TailwindCSS
- Papa Parse (for CSV parsing)

## Data Sources

The application uses two main data sources:
- `public/PlayersBBall.csv`: NBA player statistics
- `public/Education_Income.csv`: Education and income correlation data
