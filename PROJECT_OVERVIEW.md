# Project Overview

## Project Name
ReactFlow

## Description
A React + TypeScript flow editor built with Vite and React Flow. The app provides a drag-and-drop sidebar for adding custom nodes, a canvas for building flow graphs, and a theme toggle to switch between light and dark modes.

## Key Features
- Drag-and-drop node creation from a sidebar
- Custom node types: Input, Result, Image, Operation, Cumulative
- React Flow canvas with custom edge rendering and flow controls
- Light/dark theme support across the UI and node cards
- Context menu for node actions, duplication, deletion, and export
- Flow execution logic for evaluating operation and result nodes
- Keyboard and clipboard shortcuts for copy/paste and undo/redo

## Main Files and Structure
- `index.html` - app entry HTML
- `package.json` - dependencies and scripts
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `src/main.tsx` - React app bootstrap
- `src/App.tsx` - top-level app and theme state management
- `src/index.css` - global styles and theme variables

### Components
- `src/components/Header.tsx` - toolbar, run/save buttons, theme toggle
- `src/components/Sidebar.tsx` - drag-and-drop node palette and search
- `src/components/FlowCanvas.tsx` - main React Flow canvas and node rendering
- `src/components/ContextMenu.tsx` - right-click node/canvas menu
- `src/components/Footer.tsx` - status bar

### Node Components
- `src/components/nodes/InputNode.tsx` - numeric input node
- `src/components/nodes/ResultNode.tsx` - output/result node with optional image support
- `src/components/nodes/ImageNode.tsx` - image upload node
- `src/components/nodes/OperationNode.tsx` - arithmetic operation nodes
- `src/components/nodes/CumulativeNode.tsx` - cumulative calculation node

### Edges and Utilities
- `src/components/edges/CustomEdge.tsx` - custom edge styling and animation
- `src/hooks/useKeyboardShortcuts.ts` - keyboard shortcut handlers
- `src/utils/Tostify.util.ts` - toast notification utilities

## Theme Support
The app supports a `light` and `dark` theme. Theme state is managed in `App.tsx` and passed down to components so the sidebar, canvas, nodes, and controls update their appearance consistently.

## Scripts
- `npm install` - install project dependencies
- `npm run dev` - start the development server
- `npm run build` - build the production bundle
- `npm run lint` - run TypeScript type checks (`tsc --noEmit`)

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown in the terminal.

## Notes
- The project uses Tailwind-style utility classes for styling.
- Theme-aware node components use `theme` props to apply light/dark visual variants.
- The canvas uses React Flow `Background` and `MiniMap` components with theme-aware colors.
