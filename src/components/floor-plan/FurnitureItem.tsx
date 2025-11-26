import React, { MouseEvent } from 'react';
import { Furniture, Selection, DragState } from '@/types';
import { CANVAS_WIDTH_FT, CANVAS_HEIGHT_FT } from '@/utils/dimensions';
import { Move } from 'lucide-react';

interface FurnitureItemProps {
  furniture: Furniture;
  selection: Selection | null;
  dragState: DragState | null;
  onMouseDown: (e: MouseEvent, type: 'room' | 'door' | 'furniture', id: string) => void;
}

const FurnitureItem: React.FC<FurnitureItemProps> = ({ furniture, selection, dragState, onMouseDown }) => {
  // Calculate dimensions in percentage relative to canvas
  const widthPercent = (furniture.width / CANVAS_WIDTH_FT) * 100;
  const depthPercent = (furniture.depth / CANVAS_HEIGHT_FT) * 100;
  const depthPercentHorizontal = (furniture.depth / CANVAS_WIDTH_FT) * 100; // Adjusted for square aspect ratio if needed
  const heightPercent = (furniture.depth / CANVAS_HEIGHT_FT) * 100;

  const isSelected = selection?.id === furniture.id && selection.type === 'furniture';
  const isDragging = dragState?.id === furniture.id && dragState.type === 'furniture';

  const renderSVG = () => {
    const commonStroke = "#4a3b2a";
    const commonFill = "#fff";
    const commonStrokeWidth = "2";
    
    switch (true) {
        case furniture.type.includes('bed_queen'):
            return (
                <svg viewBox="0 0 100 130" className="w-full h-full">
                    {/* Headboard */}
                    <rect x="2" y="2" width="96" height="10" rx="2" fill={commonFill} stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    {/* Mattress */}
                    <rect x="5" y="12" width="90" height="115" rx="2" fill="#f4ece0" stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    {/* Pillows */}
                    <rect x="10" y="20" width="35" height="20" rx="5" fill="#fff" stroke={commonStroke} strokeWidth="1" />
                    <rect x="55" y="20" width="35" height="20" rx="5" fill="#fff" stroke={commonStroke} strokeWidth="1" />
                    {/* Blanket */}
                    <path d="M 5 80 Q 50 70 95 80 L 95 127 L 5 127 Z" fill="#e0d6c5" stroke="none" opacity="0.5" />
                </svg>
            );
        case furniture.type.includes('bed_single'):
            return (
                <svg viewBox="0 0 70 130" className="w-full h-full">
                    <rect x="2" y="2" width="66" height="10" rx="2" fill={commonFill} stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    <rect x="5" y="12" width="60" height="115" rx="2" fill="#f4ece0" stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    <rect x="10" y="20" width="50" height="20" rx="5" fill="#fff" stroke={commonStroke} strokeWidth="1" />
                    <path d="M 5 80 Q 35 70 65 80 L 65 127 L 5 127 Z" fill="#e0d6c5" stroke="none" opacity="0.5" />
                </svg>
            );
        case furniture.type.includes('sofa_3'):
            return (
                <svg viewBox="0 0 140 60" className="w-full h-full">
                    {/* Back */}
                    <rect x="2" y="2" width="136" height="15" rx="5" fill={commonFill} stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    {/* Arms */}
                    <rect x="2" y="10" width="15" height="48" rx="5" fill={commonFill} stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    <rect x="123" y="10" width="15" height="48" rx="5" fill={commonFill} stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    {/* Cushions */}
                    <rect x="19" y="19" width="32" height="39" rx="2" fill="#f4ece0" stroke={commonStroke} strokeWidth="1" />
                    <rect x="54" y="19" width="32" height="39" rx="2" fill="#f4ece0" stroke={commonStroke} strokeWidth="1" />
                    <rect x="89" y="19" width="32" height="39" rx="2" fill="#f4ece0" stroke={commonStroke} strokeWidth="1" />
                </svg>
            );
        case furniture.type.includes('sofa_2'):
            return (
                <svg viewBox="0 0 100 60" className="w-full h-full">
                     {/* Back */}
                     <rect x="2" y="2" width="96" height="15" rx="5" fill={commonFill} stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                     {/* Arms */}
                     <rect x="2" y="10" width="15" height="48" rx="5" fill={commonFill} stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                     <rect x="83" y="10" width="15" height="48" rx="5" fill={commonFill} stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                     {/* Cushions */}
                     <rect x="19" y="19" width="30" height="39" rx="2" fill="#f4ece0" stroke={commonStroke} strokeWidth="1" />
                     <rect x="51" y="19" width="30" height="39" rx="2" fill="#f4ece0" stroke={commonStroke} strokeWidth="1" />
                </svg>
            );
        case furniture.type.includes('table_dining'):
            return (
                <svg viewBox="0 0 120 70" className="w-full h-full">
                    <rect x="2" y="2" width="116" height="66" rx="2" fill="#f0e6d2" stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    {/* Chairs hints */}
                    <rect x="20" y="-5" width="20" height="5" rx="1" fill="#d4c5a9" opacity="0.7" />
                    <rect x="80" y="-5" width="20" height="5" rx="1" fill="#d4c5a9" opacity="0.7" />
                    <rect x="20" y="70" width="20" height="5" rx="1" fill="#d4c5a9" opacity="0.7" />
                    <rect x="80" y="70" width="20" height="5" rx="1" fill="#d4c5a9" opacity="0.7" />
                </svg>
            );
        case furniture.type.includes('table_round'):
            return (
                 <svg viewBox="0 0 80 80" className="w-full h-full">
                    <circle cx="40" cy="40" r="38" fill="#f0e6d2" stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    {/* Chair hints */}
                    <circle cx="40" cy="0" r="5" fill="#d4c5a9" opacity="0.7" />
                    <circle cx="40" cy="80" r="5" fill="#d4c5a9" opacity="0.7" />
                    <circle cx="0" cy="40" r="5" fill="#d4c5a9" opacity="0.7" />
                    <circle cx="80" cy="40" r="5" fill="#d4c5a9" opacity="0.7" />
                 </svg>
            );
        case furniture.type.includes('desk'):
            return (
                <svg viewBox="0 0 80 40" className="w-full h-full">
                    <rect x="2" y="2" width="76" height="36" rx="1" fill="#f4ece0" stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    <rect x="60" y="5" width="15" height="30" rx="1" fill="none" stroke={commonStroke} strokeWidth="1" opacity="0.5" />
                </svg>
            );
        case furniture.type.includes('wardrobe'):
            return (
                <svg viewBox="0 0 80 40" className="w-full h-full">
                    <rect x="2" y="2" width="76" height="36" fill="#fff" stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    <line x1="40" y1="2" x2="40" y2="38" stroke={commonStroke} strokeWidth="1" />
                    {/* Handles */}
                    <line x1="38" y1="18" x2="38" y2="22" stroke={commonStroke} strokeWidth="2" />
                    <line x1="42" y1="18" x2="42" y2="22" stroke={commonStroke} strokeWidth="2" />
                    {/* Hanger bar hint */}
                    <line x1="5" y1="10" x2="75" y2="10" stroke={commonStroke} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                </svg>
            );
        case furniture.type.includes('tv_unit'):
             return (
                <svg viewBox="0 0 100 30" className="w-full h-full">
                    <rect x="2" y="2" width="96" height="26" rx="1" fill="#f4ece0" stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    <rect x="30" y="5" width="40" height="5" fill="#333" opacity="0.8" />
                </svg>
             );
        case furniture.type.includes('toilet'):
             return (
                <svg viewBox="0 0 30 50" className="w-full h-full">
                    {/* Tank */}
                    <rect x="2" y="2" width="26" height="12" rx="1" fill="#fff" stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                    {/* Bowl */}
                    <ellipse cx="15" cy="30" rx="10" ry="14" fill="#fff" stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                </svg>
             );
         case furniture.type.includes('sink'):
             return (
                 <svg viewBox="0 0 40 30" className="w-full h-full">
                     <rect x="2" y="2" width="36" height="26" rx="2" fill="#fff" stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                     <circle cx="20" cy="15" r="8" fill="#e0eff1" stroke="none" />
                     <circle cx="20" cy="15" r="2" fill="#aaa" />
                     {/* Faucet */}
                     <rect x="18" y="2" width="4" height="6" fill="#aaa" />
                 </svg>
             );
        case furniture.type.includes('shower'):
             return (
                 <svg viewBox="0 0 60 60" className="w-full h-full">
                     <rect x="2" y="2" width="56" height="56" rx="0" fill="#e0eff1" stroke={commonStroke} strokeWidth={commonStrokeWidth} />
                     <line x1="2" y1="2" x2="58" y2="58" stroke={commonStroke} strokeWidth="1" opacity="0.5" />
                     <line x1="58" y1="2" x2="2" y2="58" stroke={commonStroke} strokeWidth="1" opacity="0.5" />
                     <circle cx="30" cy="30" r="3" fill="#aaa" />
                 </svg>
             );
        case furniture.type.includes('plant'):
            return (
                <svg viewBox="0 0 30 30" className="w-full h-full">
                     <circle cx="15" cy="15" r="12" fill="#dceddd" stroke={commonStroke} strokeWidth={commonStrokeWidth} strokeDasharray="2,2" />
                     <circle cx="15" cy="15" r="8" fill="#8bc34a" stroke="none" />
                     <circle cx="12" cy="12" r="3" fill="#689f38" stroke="none" />
                     <circle cx="18" cy="18" r="4" fill="#689f38" stroke="none" />
                     <circle cx="18" cy="12" r="3" fill="#689f38" stroke="none" />
                     <circle cx="12" cy="18" r="3" fill="#689f38" stroke="none" />
                </svg>
            );
        default:
            return (
                <div className="w-full h-full border-2 border-[#4a3b2a] bg-white flex items-center justify-center text-[8px]">
                    ?
                </div>
            );
    }
  };

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, 'furniture', furniture.id)}
      onClick={(e) => e.stopPropagation()}
      className={`absolute z-30 cursor-move flex items-center justify-center transition-transform
        ${isSelected ? 'shadow-[0_0_0_2px_#3b82f6]' : ''}
        ${isDragging ? 'opacity-80 cursor-grabbing' : ''}
      `}
      style={{
        left: `${furniture.x}%`,
        top: `${furniture.y}%`,
        width: `${widthPercent}%`,
        height: `${heightPercent}%`,
        transform: `translate(-50%, -50%) rotate(${furniture.rotation}deg)`,
      }}
    >
      {/* SVG Content */}
      {renderSVG()}

      {/* Selection Indicators */}
      {isSelected && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#3b82f6] text-white text-[10px] px-1 rounded whitespace-nowrap pointer-events-none">
               {furniture.width}' x {furniture.depth}'
          </div>
      )}
    </div>
  );
};

export default FurnitureItem;