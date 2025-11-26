import { Room, Door } from '@/types';

export const buildFloorPlanPrompt = (rooms: Room[], doors: Door[]): string => {
  if (rooms.length === 0) {
    return "An empty floor plan.";
  }

  let prompt = "A floor plan layout consisting of the following rooms:\n";

  // 1. List Rooms with details
  rooms.forEach((room, index) => {
    prompt += `${index + 1}. ${room.name} (${room.type}): `;
    prompt += `Size approx ${room.dimensions}. `;
    // Add relative position hint based on grid coordinates (simplified)
    // This helps the model understand adjacency somewhat
    prompt += `Located at grid position (${Math.round(room.x)}, ${Math.round(room.y)}). `;
    prompt += `\n`;
  });

  prompt += "\nKey Connections (Doors):\n";

  // 2. List Doors (Basic count and type for now, hard to describe exact adjacency textually without complex logic)
  // We'll summarize door types to give a feel for the connectivity style
  const standardDoors = doors.filter(d => d.type === 'standard').length;
  const slidingDoors = doors.filter(d => d.type === 'sliding').length;
  const doubleDoors = doors.filter(d => d.type === 'double').length;
  const openArchways = doors.filter(d => d.type === 'open').length;

  if (standardDoors > 0) prompt += `- ${standardDoors} standard hinged doors connecting rooms.\n`;
  if (slidingDoors > 0) prompt += `- ${slidingDoors} sliding doors (modern style).\n`;
  if (doubleDoors > 0) prompt += `- ${doubleDoors} double doors (grand entrances).\n`;
  if (openArchways > 0) prompt += `- ${openArchways} open archways for flow between areas.\n`;

  prompt += "\nThe overall layout should be cohesive, with logical flow between these defined spaces.";

  return prompt;
};