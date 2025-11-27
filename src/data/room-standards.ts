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
      minimal: { area: 140, w: 12, h: 12, description: '140 sq ft' },
      standard: { area: 210, w: 14, h: 15, description: '180-250 sq ft' },
      luxury: { area: 320, w: 16, h: 20, description: '250-400+ sq ft' },
    },
    considerations: 'Allows for King bed, nightstands, dresser, and potential seating area.',
  },
  bedroom: {
    id: 'bedroom',
    label: 'Standard Bedroom',
    category: 'Guest/Child Sleeping',
    visualType: 'bedroom',
    sizes: {
      minimal: { area: 100, w: 10, h: 10, description: '100 sq ft' },
      standard: { area: 144, w: 12, h: 12, description: '120-150 sq ft' },
      luxury: { area: 180, w: 12, h: 15, description: '150-200 sq ft' },
    },
    considerations: 'Space for Queen/Full bed, desk, and circulation.',
  },
  nursery: {
    id: 'nursery',
    label: 'Small Bedroom/Nursery',
    category: 'Minimal Sleeping',
    visualType: 'bedroom',
    sizes: {
      minimal: { area: 70, w: 8, h: 9, description: '70 sq ft' },
      standard: { area: 100, w: 10, h: 10, description: '90-110 sq ft' },
      luxury: { area: 120, w: 10, h: 12, description: '110-130 sq ft' },
    },
    considerations: 'Must meet minimum building code requirements for egress and size.',
  },
  living_formal: {
    id: 'living_formal',
    label: 'Formal Living Room',
    category: 'Dedicated Seating Area',
    visualType: 'living',
    sizes: {
      minimal: { area: 150, w: 12, h: 12.5, description: '150 sq ft' },
      standard: { area: 250, w: 15, h: 17, description: '200-300 sq ft' },
      luxury: { area: 375, w: 18, h: 21, description: '300-450 sq ft' },
    },
    considerations: 'Designed for formal entertaining; size depends on furniture scale.',
  },
  living_family: {
    id: 'living_family',
    label: 'Family Room / Den',
    category: 'Casual Seating & Media',
    visualType: 'living',
    sizes: {
      minimal: { area: 120, w: 10, h: 12, description: '120 sq ft' },
      standard: { area: 220, w: 14, h: 16, description: '180-250 sq ft' },
      luxury: { area: 320, w: 16, h: 20, description: '250-400 sq ft' },
    },
    considerations: 'Focuses on comfort and media viewing; often adjacent to the kitchen.',
  },
  dining: {
    id: 'dining',
    label: 'Formal Dining Room',
    category: 'Dedicated Eating Space',
    visualType: 'dining',
    sizes: {
      minimal: { area: 120, w: 10, h: 12, description: '120 sq ft' },
      standard: { area: 180, w: 12, h: 15, description: '150-200 sq ft' },
      luxury: { area: 250, w: 15, h: 17, description: '200-300 sq ft' },
    },
    considerations: 'Requires 36 inches of clearance around the table for chair movement.',
  },
  breakfast_nook: {
    id: 'breakfast_nook',
    label: 'Breakfast Nook',
    category: 'Informal Eating Area',
    visualType: 'dining',
    sizes: {
      minimal: { area: 50, w: 7, h: 7, description: '50 sq ft' },
      standard: { area: 80, w: 9, h: 9, description: '70-100 sq ft' },
      luxury: { area: 120, w: 10, h: 12, description: '100-150 sq ft' },
    },
    considerations: 'Typically integrated into the kitchen or adjacent to it.',
  },
  kitchen_galley: {
    id: 'kitchen_galley',
    label: 'Galley Kitchen',
    category: 'Minimal Counter Space',
    visualType: 'kitchen',
    sizes: {
      minimal: { area: 70, w: 7, h: 10, description: '70 sq ft' },
      standard: { area: 90, w: 8, h: 11, description: '80-100 sq ft' },
      luxury: { area: 110, w: 9, h: 12, description: '100-120 sq ft' },
    },
    considerations: 'Single-aisle layout; highly efficient use of space.',
  },
  kitchen: {
    id: 'kitchen',
    label: 'U/L-Shape Kitchen',
    category: 'Standard Work Triangle',
    visualType: 'kitchen',
    sizes: {
      minimal: { area: 100, w: 10, h: 10, description: '100 sq ft' },
      standard: { area: 150, w: 12, h: 13, description: '120-180 sq ft' },
      luxury: { area: 220, w: 14, h: 16, description: '180-250 sq ft' },
    },
    considerations: 'Allows for comfortable work zones and potential small island.',
  },
  kitchen_gourmet: {
    id: 'kitchen_gourmet',
    label: 'Gourmet/Eat-In Kitchen',
    category: 'Large Island & Seating',
    visualType: 'kitchen',
    sizes: {
      minimal: { area: 200, w: 14, h: 14, description: '200 sq ft' },
      standard: { area: 300, w: 17, h: 18, description: '250-350 sq ft' },
      luxury: { area: 450, w: 20, h: 23, description: '350-500+ sq ft' },
    },
    considerations: 'Includes multiple appliances, large island, and dedicated seating area.',
  },
  bathroom_master: {
    id: 'bathroom_master',
    label: 'Primary/Master Bathroom',
    category: 'Luxury Fixtures',
    visualType: 'bathroom',
    sizes: {
      minimal: { area: 80, w: 8, h: 10, description: '80 sq ft' },
      standard: { area: 130, w: 10, h: 13, description: '100-150 sq ft' },
      luxury: { area: 200, w: 14, h: 15, description: '150-250+ sq ft' },
    },
    considerations: 'Includes double vanity, separate shower, separate tub, and often a private toilet room.',
  },
  bathroom_full: {
    id: 'bathroom_full',
    label: 'Full Bathroom',
    category: 'Tub/Shower, Toilet, Sink',
    visualType: 'bathroom',
    sizes: {
      minimal: { area: 40, w: 5, h: 8, description: '40 sq ft' },
      standard: { area: 60, w: 6, h: 10, description: '50-70 sq ft' },
      luxury: { area: 85, w: 8, h: 11, description: '70-100 sq ft' },
    },
    considerations: 'Standard three-fixture bath.',
  },
  bathroom_three_quarter: {
    id: 'bathroom_three_quarter',
    label: '3/4 Bathroom',
    category: 'Shower, Toilet, Sink',
    visualType: 'bathroom',
    sizes: {
      minimal: { area: 35, w: 5, h: 7, description: '35 sq ft' },
      standard: { area: 50, w: 6, h: 8.5, description: '45-60 sq ft' },
      luxury: { area: 70, w: 7, h: 10, description: '60-80 sq ft' },
    },
    considerations: 'No bathtub; common in guest suites or basements.',
  },
  bathroom_half: {
    id: 'bathroom_half',
    label: 'Half Bathroom',
    category: 'Toilet, Sink (Powder Room)',
    visualType: 'bathroom',
    sizes: {
      minimal: { area: 18, w: 3, h: 6, description: '18 sq ft' },
      standard: { area: 30, w: 5, h: 6, description: '25-35 sq ft' },
      luxury: { area: 45, w: 6, h: 7.5, description: '35-50 sq ft' },
    },
    considerations: 'Minimal space required for door swing and standing.',
  },
  study: {
    id: 'study',
    label: 'Home Office / Study',
    category: 'Dedicated Work Space',
    visualType: 'study',
    sizes: {
      minimal: { area: 80, w: 8, h: 10, description: '80 sq ft' },
      standard: { area: 120, w: 10, h: 12, description: '100-150 sq ft' },
      luxury: { area: 200, w: 14, h: 14, description: '150-250 sq ft' },
    },
    considerations: 'Space for desk, chair, filing, and potential built-in shelving.',
  },
  laundry: {
    id: 'laundry',
    label: 'Laundry Room',
    category: 'Washer/Dryer & Folding',
    visualType: 'utility',
    sizes: {
      minimal: { area: 40, w: 5, h: 8, description: '40 sq ft' },
      standard: { area: 70, w: 7, h: 10, description: '60-80 sq ft' },
      luxury: { area: 100, w: 10, h: 10, description: '80-120 sq ft' },
    },
    considerations: 'Includes space for utility sink, cabinets, and folding counter.',
  },
  pantry: {
    id: 'pantry',
    label: 'Walk-In Pantry',
    category: 'Food Storage',
    visualType: 'storage',
    sizes: {
      minimal: { area: 20, w: 4, h: 5, description: '20 sq ft' },
      standard: { area: 40, w: 5, h: 8, description: '30-50 sq ft' },
      luxury: { area: 65, w: 8, h: 8, description: '50-80 sq ft' },
    },
    considerations: 'Requires adequate shelving depth and circulation space.',
  },
  mudroom: {
    id: 'mudroom',
    label: 'Mudroom',
    category: 'Transition & Storage',
    visualType: 'entrance',
    sizes: {
      minimal: { area: 30, w: 5, h: 6, description: '30 sq ft' },
      standard: { area: 65, w: 8, h: 8, description: '50-80 sq ft' },
      luxury: { area: 100, w: 10, h: 10, description: '80-120 sq ft' },
    },
    considerations: 'Space for built-in lockers, bench, and coat/shoe storage.',
  },
  closet_master: {
    id: 'closet_master',
    label: 'Primary Walk-In Closet',
    category: 'Master Storage',
    visualType: 'storage',
    sizes: {
      minimal: { area: 60, w: 6, h: 10, description: '60 sq ft' },
      standard: { area: 100, w: 10, h: 10, description: '80-120 sq ft' },
      luxury: { area: 160, w: 12, h: 13.5, description: '120-200+ sq ft' },
    },
    considerations: 'Allows for hanging on both sides and a central dressing area or island.',
  },
  closet_walkin: {
    id: 'closet_walkin',
    label: 'Standard Walk-In Closet',
    category: 'Secondary Storage',
    visualType: 'storage',
    sizes: {
      minimal: { area: 30, w: 5, h: 6, description: '30 sq ft' },
      standard: { area: 50, w: 7, h: 7, description: '40-60 sq ft' },
      luxury: { area: 70, w: 8, h: 9, description: '60-80 sq ft' },
    },
    considerations: 'Minimum 6 feet wide to allow hanging on both sides and circulation.',
  },
  closet_linen: {
    id: 'closet_linen',
    label: 'Linen Closet (Walk-In)',
    category: 'Utility Storage',
    visualType: 'storage',
    sizes: {
      minimal: { area: 15, w: 3, h: 5, description: '15 sq ft' },
      standard: { area: 25, w: 5, h: 5, description: '20-30 sq ft' },
      luxury: { area: 35, w: 5, h: 7, description: '30-40 sq ft' },
    },
    considerations: 'Primarily shelving space.',
  },
  garage_1car: {
    id: 'garage_1car',
    label: 'Single Car Garage',
    category: 'Parking & Minimal Storage',
    visualType: 'garage',
    sizes: {
      minimal: { area: 200, w: 10, h: 20, description: '200 sq ft' },
      standard: { area: 270, w: 12, h: 22.5, description: '240-300 sq ft' },
      luxury: { area: 350, w: 14, h: 25, description: '300-400 sq ft' },
    },
    considerations: 'Standard minimum width is 10 feet, but 12-14 feet is more comfortable.',
  },
  garage_2car: {
    id: 'garage_2car',
    label: 'Two Car Garage',
    category: 'Parking & Storage',
    visualType: 'garage',
    sizes: {
      minimal: { area: 400, w: 20, h: 20, description: '400 sq ft' },
      standard: { area: 484, w: 22, h: 22, description: '440-550 sq ft' },
      luxury: { area: 625, w: 25, h: 25, description: '550-700+ sq ft' },
    },
    considerations: 'Standard minimum width is 20 feet, but 22-24 feet is recommended.',
  },
  garage_3car: {
    id: 'garage_3car',
    label: 'Three Car Garage',
    category: 'Parking & Storage',
    visualType: 'garage',
    sizes: {
      minimal: { area: 600, w: 30, h: 20, description: '600 sq ft' },
      standard: { area: 720, w: 30, h: 24, description: '660-800 sq ft' },
      luxury: { area: 900, w: 36, h: 25, description: '800-1000+ sq ft' },
    },
    considerations: 'Allows for three vehicles plus significant storage or workshop space.',
  },
};