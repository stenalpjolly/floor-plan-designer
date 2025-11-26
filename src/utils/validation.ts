import { Room } from '@/types';
import { CANVAS_WIDTH_FT, CANVAS_HEIGHT_FT } from './dimensions';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

interface RoomRule {
  minWidth: number;
  minHeight: number;
  label: string;
}

export const ROOM_RULES: Record<string, RoomRule> = {
  master_bedroom: { minWidth: 10, minHeight: 10, label: 'Master Bedroom' },
  bedroom: { minWidth: 8, minHeight: 8, label: 'Bedroom' },
  kitchen: { minWidth: 5, minHeight: 5, label: 'Kitchen' },
  dining: { minWidth: 8, minHeight: 8, label: 'Dining Room' },
  living: { minWidth: 10, minHeight: 10, label: 'Living Room' },
  bathroom: { minWidth: 5, minHeight: 5, label: 'Bathroom' },
  study: { minWidth: 7, minHeight: 7, label: 'Study' },
  utility: { minWidth: 4, minHeight: 4, label: 'Utility' },
  garage: { minWidth: 10, minHeight: 18, label: 'Garage' },
  outdoor: { minWidth: 3, minHeight: 3, label: 'Outdoor' },
  corridor: { minWidth: 3, minHeight: 3, label: 'Corridor' },
  storage: { minWidth: 3, minHeight: 3, label: 'Storage' },
  entrance: { minWidth: 4, minHeight: 4, label: 'Entrance' },
};

export const validateRoom = (room: Room): ValidationResult => {
  const rule = ROOM_RULES[room.type];
  if (!rule) return { isValid: true };

  const widthFt = (room.w / 100) * CANVAS_WIDTH_FT;
  const heightFt = (room.h / 100) * CANVAS_HEIGHT_FT;

  // Allow for rotation: check if dimensions satisfy the rule in either orientation
  const passesStandard = widthFt >= rule.minWidth && heightFt >= rule.minHeight;
  const passesRotated = widthFt >= rule.minHeight && heightFt >= rule.minWidth;

  if (passesStandard || passesRotated) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: `${rule.label} must be at least ${rule.minWidth}' x ${rule.minHeight}'`
  };
};