import { ROOM_STANDARDS } from '@/data/room-standards';

export const getRoomStandardsContext = (): string => {
  let context = "Standard Room Dimensions (width x height in feet):\n";
  
  Object.values(ROOM_STANDARDS).forEach(std => {
    context += `- ${std.label} (type: '${std.id}'):\n`;
    context += `  * Minimal: ${std.sizes.minimal.w}x${std.sizes.minimal.h} (Area: ${std.sizes.minimal.area})\n`;
    context += `  * Standard: ${std.sizes.standard.w}x${std.sizes.standard.h} (Area: ${std.sizes.standard.area})\n`;
    context += `  * Luxury: ${std.sizes.luxury.w}x${std.sizes.luxury.h} (Area: ${std.sizes.luxury.area})\n`;
    if (std.considerations) {
        context += `  * Note: ${std.considerations}\n`;
    }
  });

  return context;
};