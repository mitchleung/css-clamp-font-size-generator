# 📐 CSS Clamp Font Size Generator

A professional tool for creating fluid typography using the CSS `clamp()` function. This generator eliminates the need for complex manual calculations or numerous media queries by creating a linear scale between your minimum and maximum font sizes.

## ✨ Features

- **🚀 Fluid Typography Engine**: Automatically calculates the mathematical slope and intercept required for perfect linear scaling between viewports.
- **🛠️ Highly Customizable**:
  - Set custom **Minimum** and **Maximum** font sizes.
  - Define the **Viewport Range** (e.g., 375px to 1440px) where scaling occurs.
  - Toggle between `rem` and `px` units.
  - Adjust the root font size for precise `rem` calculations.
- **📋 Multiple Export Formats**:
  - **Standard CSS**: `font-size: clamp(...)`
  - **Tailwind CSS**: Arbitrary value classes like `text-[clamp(...)]`
  - **CSS Variables**: `--font-fluid: clamp(...)`
  - **SCSS Mixins**: Ready-to-use `@mixin` definitions.
- **📊 Visual Validation**:
  - **Live Preview**: See your text scale in real-time as you adjust parameters.
  - **Breakpoint Analysis**: A detailed table showing exactly how the font renders on common devices (from Mobile Mini to FHD Monitors).
  - **Scaling Graph**: A visual representation of the fluid growth curve.
- **🎯 Professional Presets**: Includes a library of industry-standard presets for Hero displays, Headings (H1-H6), Body text, and Captions.
- **✍️ Direct Mode**: For advanced users, manually define your `min`, `preferred`, and `max` values.

## 📖 How it Works

The generator uses the CSS `clamp()` function:
`clamp(minimum, preferred, maximum)`

The "preferred" value is calculated using a linear equation:
`slope * viewport_width + intercept`

This ensures that the font size grows smoothly as the screen widens, but never shrinks below the minimum or grows beyond the maximum, providing a seamless experience across all device categories.

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS recommended)

### Local Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to the URL provided by Vite (usually `http://localhost:5173`).

## 💻 Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📄 License
This project is licensed under the MIT License.
