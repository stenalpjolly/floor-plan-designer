import React from 'react';
import { 
  BookOpen, Frame, AppWindow, ArrowUpToLine, 
  Lamp, Lightbulb, Leaf, Package, 
  Settings, Blinds, Refrigerator, 
  Mic2, Ruler, Library
} from 'lucide-react';

export interface InteriorElement {
  id: string;
  label: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  type: string; // mapping to furniture type or new types
  defaultWidth: number;
  defaultDepth: number;
}

export const INTERIOR_ELEMENTS: InteriorElement[] = [
  {
    id: 'prayer_niche',
    label: 'Prayer Table/Niche',
    category: 'Devotional Component',
    description: 'Dedicated quiet area for Bible, cross, candles.',
    icon: <BookOpen className="w-full h-full" />,
    type: 'prayer_table',
    defaultWidth: 3,
    defaultDepth: 2
  },
  {
    id: 'millwork',
    label: 'Millwork & Trim',
    category: 'Architectural Detail',
    description: 'Crown molding, baseboards, wainscoting.',
    icon: <Frame className="w-full h-full" />,
    type: 'millwork',
    defaultWidth: 4,
    defaultDepth: 2
  },
  {
    id: 'fenestration',
    label: 'Window/Fenestration',
    category: 'Architectural Detail',
    description: 'Strategic placement of windows for light and views.',
    icon: <AppWindow className="w-full h-full" />,
    type: 'window',
    defaultWidth: 4,
    defaultDepth: 2
  },
  {
    id: 'ceiling_detail',
    label: 'Coffered/Vaulted Ceiling',
    category: 'Architectural Detail',
    description: 'Decorative ceiling treatments.',
    icon: <ArrowUpToLine className="w-full h-full" />,
    type: 'ceiling_detail',
    defaultWidth: 10,
    defaultDepth: 10
  },
  {
    id: 'task_lighting',
    label: 'Task Lighting',
    category: 'Functional Utility',
    description: 'Focused light sources for specific activities.',
    icon: <Lamp className="w-full h-full" />,
    type: 'lighting_task',
    defaultWidth: 3,
    defaultDepth: 3
  },
  {
    id: 'accent_lighting',
    label: 'Accent Lighting',
    category: 'Functional Utility',
    description: 'Highlight artwork or features.',
    icon: <Lightbulb className="w-full h-full" />,
    type: 'lighting_accent',
    defaultWidth: 3,
    defaultDepth: 3
  },
  {
    id: 'biophilic',
    label: 'Biophilic Elements',
    category: 'Sensory/Atmospheric',
    description: 'Indoor plants and natural elements.',
    icon: <Leaf className="w-full h-full" />,
    type: 'plant_large',
    defaultWidth: 3,
    defaultDepth: 3
  },
  {
    id: 'casegoods',
    label: 'Casegoods (Cabinet)',
    category: 'Furnishings',
    description: 'Dressers, cabinets, sideboards.',
    icon: <Package className="w-full h-full" />,
    type: 'cabinet',
    defaultWidth: 4,
    defaultDepth: 2
  },
  {
    id: 'hardware',
    label: 'Hardware Detail',
    category: 'Decorative Detail',
    description: 'Knobs, pulls, handles (Visual marker).',
    icon: <Settings className="w-full h-full" />,
    type: 'hardware',
    defaultWidth: 2.5,
    defaultDepth: 2.5
  },
  {
    id: 'window_treatment',
    label: 'Window Treatment',
    category: 'Furnishings',
    description: 'Curtains, drapes, blinds.',
    icon: <Blinds className="w-full h-full" />,
    type: 'curtain',
    defaultWidth: 4,
    defaultDepth: 2
  },
  {
    id: 'appliance',
    label: 'Appliance Integration',
    category: 'Functional Utility',
    description: 'Custom paneling or placement.',
    icon: <Refrigerator className="w-full h-full" />,
    type: 'appliance',
    defaultWidth: 3,
    defaultDepth: 3
  },
  {
    id: 'acoustic',
    label: 'Acoustic Treatment',
    category: 'Sensory/Atmospheric',
    description: 'Sound absorbing materials.',
    icon: <Mic2 className="w-full h-full" />,
    type: 'acoustic_panel',
    defaultWidth: 4,
    defaultDepth: 2
  },
  {
    id: 'scale_ref',
    label: 'Scale Reference',
    category: 'Aesthetic Principle',
    description: 'Visual balance reference.',
    icon: <Ruler className="w-full h-full" />,
    type: 'reference_scale',
    defaultWidth: 3,
    defaultDepth: 3
  },
  {
    id: 'built_in',
    label: 'Custom Built-In',
    category: 'Architectural Detail',
    description: 'Library shelving, window seats.',
    icon: <Library className="w-full h-full" />,
    type: 'built_in',
    defaultWidth: 6,
    defaultDepth: 1.5
  }
];