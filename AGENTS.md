# AGENTS.md - Project Context & Commands

## 🚀 Development Workflow
- **Install Dependencies:** `npm install`
- **Start Dev Server (Local Run):** `npm run dev` (Runs Vite on port 3000)
- **Build for Production:** `npm run build`
- **Run Lint/Typecheck (Code Quality Check):** `npm run lint`

## 🧠 Codebase Summary
- **Functionality:** A generator for CSS clamp font sizes, allowing users to input minimum, preferred, and maximum values.
- **Structure:** Front-end application (`App.tsx`, `main.tsx`) relying on components in `src/components` and core logic in `src/utils`.
- **Key Files:**
    - `package.json`: Project scripts and dependencies.
    - `src/utils/clampCalculator.ts`: Core logic for calculating clamp values.

## 🛠️ Commands Used
- `npm run dev`: Runs the Vite development server for live preview.
- `tsc --noEmit`: Checks TypeScript compilation errors without generating output (used via `npm run lint`).

**Note:** The project is a modern frontend application using React/Vite and Tailwind CSS.
