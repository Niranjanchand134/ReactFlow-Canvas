<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ReactFlow Frontend

A Vite + React app for building interactive flows with React Flow. This project includes custom nodes, custom edges, keyboard shortcuts, and a responsive layout.

## Features

- Interactive React Flow canvas with drag-and-drop support
- Custom node and edge components
- Keyboard shortcuts for flow actions
- Sidebar, header, and footer UI

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Start the development server:
   `npm run dev`
3. Open your browser at `http://localhost:3000`

## Build

`npm run build`

## Environment

No special environment variables are required by default. If you add custom configuration variables, place them in `.env.local`.

## Project structure

- `src/` — React components and app logic
- `src/components/` — page and UI components
- `src/nodes/` — custom React Flow node components
- `src/edges/` — custom React Flow edge components
- `src/hooks/` — reusable hooks such as keyboard shortcuts
