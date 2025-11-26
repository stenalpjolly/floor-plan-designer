'use server';

import { createVertex } from '@ai-sdk/google-vertex';
import { generateObject } from 'ai';
import { FloorPlanSchema } from '@/types/schemas';

export async function generateFloorPlan(prompt: string) {
  const vertex = createVertex({
    project: 'genarch',
    location: 'global',
  });

  const result = await generateObject({
    model: vertex('gemini-2.5-flash-preview-09-2025'),
    schema: FloorPlanSchema,
    prompt: `Generate a floor plan layout based on the following description: "${prompt}". 
    
    IMPORTANT:
    1. Assume a grid system where 1 unit corresponds to roughly 1 foot.
    2. Coordinates (x, y) and dimensions (w, h) should align to the grid (integers preferred).
    3. Ensure rooms are logically adjacent and doors are placed on shared walls or boundaries.
    4. Provide realistic dimensions for the described rooms.
    `,
  });

  return result.object;
}