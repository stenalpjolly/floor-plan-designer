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
}

export interface Selection {
  type: 'room' | 'door';
  id: string;
}

export interface DragState {
  type: 'room' | 'door';
  id: string;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}