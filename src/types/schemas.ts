import { z } from 'zod';

// Matches 'borders' in Room interface
const BorderSchema = z.object({
  top: z.boolean(),
  bottom: z.boolean(),
  left: z.boolean(),
  right: z.boolean(),
});

// Matches 'Room' interface
export const RoomSchema = z.object({
  id: z.string().describe("Unique identifier for the room, e.g., 'room_1'"),
  name: z.string().describe("Display name, e.g., 'Master Bedroom'"),
  dimensions: z.string().describe("Text description of dimensions, e.g., '15' x 12''"),
  details: z.string().describe("Brief description of the room's purpose"),
  x: z.number().describe("X coordinate on the grid"),
  y: z.number().describe("Y coordinate on the grid"),
  w: z.number().describe("Width in grid units"),
  h: z.number().describe("Height in grid units"),
  type: z.enum([
    'master_bedroom', 'bedroom', 'nursery',
    'living_formal', 'living_family',
    'dining', 'breakfast_nook',
    'kitchen_galley', 'kitchen', 'kitchen_gourmet',
    'bathroom_master', 'bathroom_full', 'bathroom_three_quarter', 'bathroom_half',
    'study',
    'laundry', 'pantry', 'mudroom',
    'closet_master', 'closet_walkin', 'closet_linen',
    'garage_1car', 'garage_2car', 'garage_3car',
    'utility', 'outdoor', 'corridor', 'entrance', 'storage' // Keep legacy/generic types for compatibility
  ]).describe("Type of room for styling purposes"),
  borders: BorderSchema,
});

// Matches 'Door' interface
export const DoorSchema = z.object({
  id: z.string().describe("Unique identifier, e.g., 'door_1'"),
  x: z.number(),
  y: z.number(),
  orientation: z.enum(['horizontal', 'vertical']),
  swing: z.enum(['left', 'right']),
});

// The top-level schema for the LLM response
export const FloorPlanSchema = z.object({
  rooms: z.array(RoomSchema),
  doors: z.array(DoorSchema),
});