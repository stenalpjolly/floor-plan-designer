# Floor Plan Creator - Architectural Blueprint

## 1. Project Overview
The **Floor Plan Creator** is a modern web application designed to allow users to intuitively create and edit 2D floor plans. Converting a React single-file prototype into a robust **Next.js** application, this tool enables users to drag and drop rooms, add doors, adjust dimensions via resizing, and manage property details. It features intelligent snapping for easy room alignment and supports saving/loading designs via JSON.

## 2. Tech Stack
*   **Framework**: Next.js 14+ (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Package Manager**: pnpm

## 3. Core Features

### Interactive Workspace
*   **Infinite/Fixed Canvas**: A droppable area for placing elements.
*   **Grid System**: Visual grid for alignment and visual estimation of size.
*   **Drag & Drop**: Fluid movement of rooms and doors using pointer events.

### Room Management
*   **Creation**: Add new rooms from a preset list (Bedroom, Bathroom, Living Room, etc.).
*   **Manipulation**:
    *   **Move**: Drag rooms around the canvas.
    *   **Resize**: Drag edges or corners to change dimensions ($w \times h$).
*   **Properties**: Edit room name, type, and specific details.
*   **Wall Visibility**: Toggle visibility of individual walls (top, bottom, left, right) to create open-concept spaces or complex shapes.

### Door Management
*   **Placement**: Add doors to the canvas, typically snapping to room borders.
*   **Adjustment**:
    *   **Move**: Reposition doors along walls.
    *   **Orientation**: Toggle between 'horizontal' and 'vertical'.
    *   **Swing**: Toggle swing direction ('left' or 'right') to indicate opening direction.

### Intelligent Snapping
*   **Room-to-Room**: Rooms automatically snap to adjacent room edges to ensure no gaps or overlaps, making it easier to create contiguous floor plans.

### Persistence
*   **JSON Export**: Serialize the current state (rooms array) into a JSON string for saving.
*   **JSON Import**: Load a previously saved JSON string to restore the layout.

## 4. Data Structures

The application state relies principally on two data models: `Room` and `Door`.

### Room Interface
```typescript
type RoomType = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'other'; // Extendable

interface RoomBorders {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

interface Room {
  id: string;          // Unique identifier (UUID recommended)
  name: string;        // User-facing label (e.g., "Master Bedroom")
  type: RoomType;      // Classification for styling/logic
  details: string;     // Additional notes or metadata
  dimensions: string;  // Display string (e.g., "12x10") or calculated from w/h
  x: number;           // X-coordinate position on canvas
  y: number;           // Y-coordinate position on canvas
  w: number;           // Width in pixels/units
  h: number;           // Height in pixels/units
  borders: RoomBorders; // Visibility state of walls
}
```

### Door Interface
```typescript
interface Door {
  id: string;
  x: number;
  y: number;
  orientation: 'horizontal' | 'vertical';
  swing: 'left' | 'right';
  // Optional: roomId reference if doors are strictly bound to rooms
}
```

## 5. Component Architecture

The migration to Next.js encourages a component-based architecture to improve maintainability and performance.

### File Structure
*   `app/page.tsx`: **Server Component**. The main entry route. Sets up the basic page layout and metadata. Renders the `FloorPlanApp`.
*   `components/FloorPlanApp.tsx`: **Client Component**. The main container.
    *   Holds the central state (`rooms`, `doors`, `selection`).
    *   Manages global event listeners (drag start, drag move, drag end).
    *   Handles "Intelligent Snapping" logic during move operations.

### Component Decomposition Strategy
The application is refactored from a monolithic file into a modular structure to separate concerns and improve maintainability:

1.  **`src/types/index.ts`**: Shared type definitions (`Room`, `Door`, `Selection`, `DragState`).
2.  **`src/components/floor-plan/`**: Directory containing sub-components.
    *   **`Toolbar.tsx`**: Header controls for file operations (Export/Import), adding items (Room/Door), and toggles (Dimensions).
    *   **`Canvas.tsx`**: The main workspace handling the grid background and rendering the list of rooms and doors.
    *   **`Sidebar.tsx`**: The property editor for modifying the selected room or door details.
    *   **`RoomItem.tsx`**: Renders a single room, handles visual states (hover, selection, drag), and wall borders.
    *   **`DoorItem.tsx`**: Renders a single door with architectural symbols for orientation and swing.
3.  **`src/components/FloorPlanApp.tsx`**: The container component that manages the global state (`rooms`, `doors`, `selection`, `dragState`) and orchestrates event handling.

### State Management Flow
*   **Central Store**: Use React `useState` (or a reducer) inside `FloorPlanApp` to hold the array of Rooms and Doors.
*   **Actions**: Functions like `updateRoom(id, newAttrs)` or `addRoom(room)` are defined in `FloorPlanApp` and passed down to `Toolbar` or `Room` components.