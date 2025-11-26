import React, { MouseEvent } from 'react';
import { CANVAS_WIDTH_FT, CANVAS_HEIGHT_FT } from '@/utils/dimensions';
import { Door, Selection } from '@/types';

interface DoorItemProps {
  door: Door;
  selection: Selection | null;
  onMouseDown: (e: MouseEvent, type: 'room' | 'door', id: string) => void;
}

const DoorItem: React.FC<DoorItemProps> = ({ door, selection, onMouseDown }) => {
  // Standard door width (3 ft) relative to canvas dimensions
  const DOOR_WIDTH_FT = 3;
  const WALL_THICKNESS_FT = 0.5; // Approx 6 inches

  // Calculate percentage dimensions
  const widthPercent = (DOOR_WIDTH_FT / CANVAS_WIDTH_FT) * 100;
  const depthPercent = (WALL_THICKNESS_FT / CANVAS_HEIGHT_FT) * 100;
  const depthPercentHorizontal = (WALL_THICKNESS_FT / CANVAS_WIDTH_FT) * 100; // When vertical, depth is width relative to canvas width

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, 'door', door.id)}
      onClick={(e) => e.stopPropagation()}
      className={`absolute z-20 cursor-move flex items-center justify-center
        ${selection?.id === door.id ? 'ring-2 ring-blue-500' : ''}
      `}
      style={{
        left: `${door.x}%`,
        top: `${door.y}%`,
        width: door.orientation === 'horizontal' ? `${widthPercent}%` : `${depthPercentHorizontal}%`,
        height: door.orientation === 'horizontal' ? `${depthPercent}%` : `${widthPercent * (CANVAS_WIDTH_FT / CANVAS_HEIGHT_FT)}%`, // Adjust height for aspect ratio
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Background to cut the wall - using floor color */}
      <div className={`absolute inset-0 bg-[#f4ece0]
        ${door.orientation === 'horizontal' ? 'border-l-2 border-r-2' : 'border-t-2 border-b-2'}
        border-[#5c4d3c]`}
      ></div>
      
      {/* Architectural Swing Arc */}
      <div className="absolute inset-0 overflow-visible pointer-events-none flex items-center justify-center">
         {door.orientation === 'horizontal' ? (
             <svg
               width="100%"
               height="400%"
               viewBox="0 0 100 200"
               className="overflow-visible"
               style={{
                 transform: door.swing === 'left' ? 'scaleY(-1)' : ''
               }}
             >
               {/* Arc */}
               <path d="M95,100 A90,90 0 0,0 5,10" fill="none" stroke="#4a3b2a" strokeWidth="2" strokeDasharray="5,3" />
               {/* Door Leaf (Open) */}
               <rect x="2" y="10" width="6" height="90" fill="#fff" stroke="#4a3b2a" strokeWidth="2" />
             </svg>
         ) : (
             <svg
               width="400%"
               height="100%"
               viewBox="0 0 200 100"
               className="overflow-visible"
               style={{
                 transform: door.swing === 'left' ? 'scaleX(-1)' : ''
               }}
             >
               {/* Arc */}
               <path d="M100,95 A90,90 0 0,1 10,5" fill="none" stroke="#4a3b2a" strokeWidth="2" strokeDasharray="5,3" />
               {/* Door Leaf (Open) */}
               <rect x="10" y="2" width="90" height="6" fill="#fff" stroke="#4a3b2a" strokeWidth="2" />
             </svg>
         )}
      </div>
    </div>
  );
};

export default DoorItem;