# 🏠 AI Floor Plan Creator

A powerful, interactive, and AI-enhanced web application for designing floor plans. Built with **Next.js 16**, **React 19**, and **Google Vertex AI**, this tool allows users to rapidly structure layouts, design interiors, and visualize their creations in 3D.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-cyan)
![Vertex AI](https://img.shields.io/badge/AI-Google%20Vertex-orange)

## ✨ Key Features

### 🏗️ Dual-Mode Design System
- **Structure Mode**: Focus on the architectural layout. Add rooms, doors, and define walls without accidental furniture selection.
- **Interior Mode**: Switch focus to furnishing. The structure becomes a locked background, allowing you to place and arrange furniture freely.

### 🚀 "Ultimate Speed" Tools
Designed for efficiency, enabling users to draft plans in minutes:
- **Smart Room Presets**: One-click addition of standard rooms (Master Bed, Kitchen, Living, etc.) with auto-sizing and color coding.
- **Directional Cloning**: Quickly expand your layout by cloning rooms to specific sides (Top, Bottom, Left, Right).
- **Quick Sizing**: Rapidly adjust room dimensions with standard preset buttons (8x8, 12x12, etc.).
- **Intelligent Snapping**: Rooms automatically snap to adjacent walls for clean, gap-free layouts.

### 🤖 AI-Powered Generation
- **Text-to-Plan**: Describe your dream layout (e.g., "A 3-bedroom house with a large open kitchen") and let Gemini 2.5 Flash generate the initial floor plan structure for you.
- **2D-to-3D Visualization**: Instantly generate a photorealistic isometric 3D view of your current floor plan using Gemini 3 Pro, preserving your layout's context.

### 🎨 Interactive Canvas
- **Drag & Drop**: Intuitive manipulation of all elements.
- **Zoom & Pan**: Infinite canvas with smooth zooming and panning controls.
- **Customization**: Fine-tune dimensions, wall visibility, door swings, and furniture rotation.

### 💾 Data Management
- **Save & Load**: Export your designs to JSON to save progress and import them later.
- **Image Export**: Download high-resolution PNGs of your 2D floor plans.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI Integration**:
    - [Google Vertex AI SDK](https://www.npmjs.com/package/@ai-sdk/google-vertex)
    - [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **Canvas & Interaction**: Custom SVG-based canvas with `html2canvas` for image capture.
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Google Cloud Project with Vertex AI API enabled.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/floor-plan-creator.git
   cd floor-plan-creator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Environment Setup:**
   Ensure your environment is authenticated with Google Cloud. This project uses `google-auth-library` which looks for application default credentials.
   - **Local Dev**: Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable to your service account key file path, or use `gcloud auth application-default login`.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### 1. Structure Mode (Default)
*   **Adding Rooms**: Click "Add Room" in the toolbar or select a preset from the Sidebar.
*   **Editing Rooms**: Click a room to select it. Use the Sidebar to:
    *   Rename or change type.
    *   Adjust dimensions using sliders or quick-size buttons.
    *   Toggle wall visibility (Open/Closed).
    *   Clone the room in a specific direction.
*   **Adding Doors**: Click "Add Door". Drag it onto a wall (it will auto-mask the wall). Configure swing and type (Standard, Sliding, Double) in the sidebar.

### 2. Interior Mode
*   Switch to **Interior Mode** using the toggle in the Toolbar.
*   **Library**: Browse the furniture library in the Sidebar.
*   **Placement**: Click an item to add it to the center, then drag to position.
*   **Customization**: Rotate and resize furniture to fit your layout.

### 3. AI Features
*   **Generate Plan**: Click the "Sparkles" icon in the toolbar. Enter a prompt like *"A modern apartment with 2 bedrooms and a study"* and click Generate.
*   **3D View**: Click the "3D Cube" icon. The app will capture your current view and send it to Vertex AI to render a 3D visualization.

## 📂 Project Structure

```
src/
├── app/
│   ├── actions/           # Server Actions for AI (Vertex AI)
│   │   ├── generate-plan.ts    # Text-to-JSON Floor Plan
│   │   └── generate-3d-view.ts # Image+Text-to-Image 3D View
│   ├── page.tsx           # Main Entry Point
│   └── layout.tsx         # Root Layout
├── components/
│   ├── FloorPlanApp.tsx   # Main Application Container & State
│   └── floor-plan/        # Floor Plan Specific Components
│       ├── Canvas.tsx     # SVG Rendering & Interaction Logic
│       ├── Sidebar.tsx    # Properties Panel & Library
│       ├── Toolbar.tsx    # Top Control Bar
│       └── items/         # Individual Render Components (Room, Door, etc.)
├── hooks/
│   └── useHistory.ts      # Undo/Redo State Management
├── types/                 # TypeScript Interfaces (Room, Furniture, etc.)
└── utils/                 # Helper Functions (Geometry, Validation)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🚀 Deployment

### GitHub Pages (Static Demo)
This application is configured to deploy automatically to **GitHub Pages**.
- The site is built as a static export.
- **Note:** AI features (Plan Generation, 3D View) are **disabled** on the GitHub Pages demo because they require server-side execution (Next.js Server Actions).

**To enable GitHub Pages for your fork:**
1. Go to your repository **Settings**.
2. Navigate to **Pages** (under Code and automation).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The deployment workflow (`.github/workflows/deploy.yml`) will automatically trigger on your next push to `main`.

### Full Deployment (with AI Features)
To deploy the full version with AI capabilities, use a platform that supports Next.js Server Actions, such as **Vercel** or **Google Cloud Run**.

**Vercel:**
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add your `GOOGLE_APPLICATION_CREDENTIALS` (as a base64 encoded string or JSON) to the Environment Variables.
4. Set `NEXT_PUBLIC_ENABLE_AI` to `true`.
