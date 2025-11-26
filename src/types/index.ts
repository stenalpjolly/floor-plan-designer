export interface Room {
  id: string;
  name: string;
  dimensions: string;
  details: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  borders: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
}

export interface Door {
  id: string;
  x: number;
  y: number;
  orientation: 'horizontal' | 'vertical';
  swing: 'left' | 'right';
  type: 'standard' | 'sliding' | 'double' | 'open';
  width?: number; // Width in feet
}

export interface Furniture {
  id: string;
  type: string;
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
  rotation: number; // Degrees (0, 90, 180, 270)
  width: number; // Width in feet
  depth: number; // Depth in feet
}

export interface Selection {
  type: 'room' | 'door' | 'furniture';
  id: string;
}

export interface DragState {
  type: 'room' | 'door' | 'canvas' | 'furniture';
  id: string;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}