export type SizeCategory = 'minimal' | 'standard' | 'luxury';

export interface RoomSizeData {
  area: number; // Approximate target area
  w: number;
  h: number;
  description?: string;
}

export interface RoomStandard {
  id: string;
  label: string;
  category: string;
  visualType: 'master_bedroom' | 'bedroom' | 'kitchen' | 'dining' | 'living' | 'bathroom' | 'study' | 'utility' | 'storage' | 'garage' | 'corridor' | 'outdoor' | 'entrance';
  sizes: {
    minimal: RoomSizeData;
    standard: RoomSizeData;
    luxury: RoomSizeData;
  };
  considerations: string;
}

export const ROOM_STANDARDS: Record<string, RoomStandard> = {
  master_bedroom: {
    id: 'master_bedroom',
    label: 'Primary/Master Bedroom',
    category: 'Sleeping & Dressing',
    visualType: 'master_bedroom',
    sizes: {
      minimal: { area: 180, w: 12, h: 15, description: '180 sq ft' },
      standard: { area: 215, w: 14, h: 15.5, description: '180-250 sq ft' },
      luxury: { area: 300, w: 16, h: 19, description: '250+ sq ft' },
    },
    considerations: 'Allows for King bed, nightstands, dresser, and comfortable circulation.',
  },
  bedroom: {
    id: 'bedroom',
    label: 'Standard Bedroom',
    category: 'Guest/Child Sleeping',
    visualType: 'bedroom',
    sizes: {
      minimal: { area: 120, w: 10, h: 12, description: '120 sq ft' },
      standard: { area: 135, w: 11, h: 12.5, description: '120-150 sq ft' },
      luxury: { area: 150, w: 12, h: 12.5, description: '150 sq ft' },
    },
    considerations: 'Space for Queen/Full bed, desk, and dresser.',
  },
  living_formal: {
    id: 'living_formal',
    label: 'Formal Living Room',
    category: 'Dedicated Seating Area',
    visualType: 'living',
    sizes: {
      minimal: { area: 200, w: 14, h: 14.5, description: '200 sq ft' },
      standard: { area: 250, w: 15, h: 17, description: '200-300 sq ft' },
      luxury: { area: 300, w: 17, h: 18, description: '300 sq ft' },
    },
    considerations: 'Size depends on the scale of furniture and intended seating capacity.',
  },
  living_family: {
    id: 'living_family',
    label: 'Family Room / Den',
    category: 'Casual Seating & Media',
    visualType: 'living',
    sizes: {
      minimal: { area: 180, w: 12, h: 15, description: '180 sq ft' },
      standard: { area: 215, w: 14, h: 15.5, description: '180-250 sq ft' },
      luxury: { area: 250, w: 15, h: 17, description: '250 sq ft' },
    },
    considerations: 'Relaxed area, often focused on media viewing.',
  },
  dining: {
    id: 'dining',
    label: 'Formal Dining Room',
    category: 'Dedicated Eating Space',
    visualType: 'dining',
    sizes: {
      minimal: { area: 150, w: 12, h: 12.5, description: '150 sq ft' },
      standard: { area: 175, w: 13, h: 13.5, description: '150-200 sq ft' },
      luxury: { area: 200, w: 14, h: 14.5, description: '200 sq ft' },
    },
    considerations: 'Must allow 36 inches of clearance around the table.',
  },
  kitchen: {
    id: 'kitchen',
    label: 'U/L-Shape Kitchen',
    category: 'Standard Work Triangle',
    visualType: 'kitchen',
    sizes: {
      minimal: { area: 120, w: 10, h: 12, description: '120 sq ft' },
      standard: { area: 150, w: 12, h: 13, description: '120-180 sq ft' },
      luxury: { area: 180, w: 12, h: 15, description: '180 sq ft' },
    },
    considerations: 'Allows for comfortable work zones and potential small island.',
  },
  bathroom_master: {
    id: 'bathroom_master',
    label: 'Primary/Master Bathroom',
    category: 'Luxury Fixtures',
    visualType: 'bathroom',
    sizes: {
      minimal: { area: 100, w: 10, h: 10, description: '100 sq ft' },
      standard: { area: 125, w: 10, h: 12.5, description: '100-150 sq ft' },
      luxury: { area: 150, w: 12, h: 12.5, description: '150 sq ft' },
    },
    considerations: 'Includes double vanity, separate shower, and separate tub.',
  },
  bathroom_full: {
    id: 'bathroom_full',
    label: 'Full Bathroom',
    category: 'Standard Fixtures',
    visualType: 'bathroom',
    sizes: {
      minimal: { area: 50, w: 6, h: 8.5, description: '50 sq ft' },
      standard: { area: 60, w: 7, h: 8.5, description: '50-70 sq ft' },
      luxury: { area: 70, w: 8, h: 9, description: '70 sq ft' },
    },
    considerations: 'Tub/Shower, Toilet, Sink.',
  },
  bathroom_half: {
    id: 'bathroom_half',
    label: 'Half Bathroom',
    category: 'Powder Room',
    visualType: 'bathroom',
    sizes: {
      minimal: { area: 25, w: 5, h: 5, description: '25 sq ft' },
      standard: { area: 30, w: 5, h: 6, description: '25-35 sq ft' },
      luxury: { area: 35, w: 5, h: 7, description: '35 sq ft' },
    },
    considerations: 'Minimal space for toilet and sink.',
  },
  study: {
    id: 'study',
    label: 'Home Office / Study',
    category: 'Dedicated Work Space',
    visualType: 'study',
    sizes: {
      minimal: { area: 100, w: 10, h: 10, description: '100 sq ft' },
      standard: { area: 125, w: 10, h: 12.5, description: '100-150 sq ft' },
      luxury: { area: 150, w: 12, h: 12.5, description: '150 sq ft' },
    },
    considerations: 'Space for desk, chair, filing, and potential client seating.',
  },
  laundry: {
    id: 'laundry',
    label: 'Laundry Room',
    category: 'Utility & Folding',
    visualType: 'utility',
    sizes: {
      minimal: { area: 60, w: 6, h: 10, description: '60 sq ft' },
      standard: { area: 70, w: 7, h: 10, description: '60-80 sq ft' },
      luxury: { area: 80, w: 8, h: 10, description: '80 sq ft' },
    },
    considerations: 'Includes space for utility sink, cabinets, and folding counter.',
  },
  pantry: {
    id: 'pantry',
    label: 'Walk-In Pantry',
    category: 'Food Storage',
    visualType: 'storage',
    sizes: {
      minimal: { area: 30, w: 5, h: 6, description: '30 sq ft' },
      standard: { area: 40, w: 5, h: 8, description: '30-50 sq ft' },
      luxury: { area: 50, w: 6, h: 8.5, description: '50 sq ft' },
    },
    considerations: 'Requires adequate shelving depth and circulation space.',
  },
  garage_2car: {
    id: 'garage_2car',
    label: 'Two Car Garage',
    category: 'Parking & Storage',
    visualType: 'garage',
    sizes: {
      minimal: { area: 440, w: 20, h: 22, description: '440 sq ft' },
      standard: { area: 500, w: 22, h: 23, description: '440-550 sq ft' },
      luxury: { area: 550, w: 24, h: 23, description: '550 sq ft' },
    },
    considerations: 'Standard minimum width is 20 feet.',
  },
};