'use server';

import { createVertex } from '@ai-sdk/google-vertex';
import { generateObject } from 'ai';
import { FloorPlanSchema } from '@/types/schemas';
import { getRoomStandardsContext } from '@/utils/ai-context';

export async function generateFloorPlan(prompt: string) {
  const vertex = createVertex({
    project: 'genarch',
    location: 'global',
  });

  const roomStandards = getRoomStandardsContext();

  const result = await generateObject({
    model: vertex('gemini-2.5-flash-preview-09-2025'),
    schema: FloorPlanSchema,
    prompt: `Generate a floor plan layout based on the following description: "${prompt}".
    
    STRICT GUIDELINES:
    1. **Grid System & Scale**:
       - 1 unit = 1 foot.
       - Use integer coordinates (x, y) and dimensions (w, h).
       - **Canvas Size**: Assume a large canvas. Do NOT compress rooms to fit in a small area. A typical house plan might span 40-60 units in width/height.
    
    2. **Room Dimensions (MANDATORY)**:
       - You MUST use the specific dimensions provided below.
       - **DO NOT SHRINK ROOMS**. If a standard bedroom is 12x12, do NOT make it 6x6.
       - If a room's dimensions are not explicitly in the prompt, use the 'Standard' size from the list below.
    ${roomStandards}
    
    3. **Logical Layout**:
       - Rooms must be placed adjacent to each other to form a cohesive house.
       - No floating rooms.
       - **No Overlaps**: Rooms must not overlap.
       - **Hallways**: Hallways should be at least 3-4 units wide (feet), not 2 units.
    
    4. **Door Placement & Sizing (CRITICAL)**:
       - **Door Width**: Standard doors are approx 3 units wide.
       - **Placement**: Doors MUST be placed EXACTLY on the shared boundary between two rooms or a room and the exterior.
       - A door coordinate (x, y) must lie on a wall segment.
       - **Orientation**: 'horizontal' for doors on horizontal walls, 'vertical' for doors on vertical walls.
       - **Logic**: Connect logical spaces (e.g., Living Room -> Kitchen, Bedroom -> Hallway/Corridor).
       - **Visual Check**: If a wall is 10 units long, a door should take up a small portion of it. If a wall is 6 units long and a door is 3 units, it looks crowded. Ensure walls are long enough to accommodate doors + structure.
    `,
  });

  return result.object;
}