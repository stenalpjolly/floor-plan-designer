import React, { MouseEvent } from 'react';
import { Door, Selection } from '@/types';

interface DoorItemProps {
  door: Door;
  selection: Selection | null;
  onMouseDown: (e: MouseEvent, type: 'room' | 'door', id: string) => void;
}

const DoorItem: React.FC<DoorItemProps> = ({ door, selection, onMouseDown }) => {
  return (
    <div
      onMouseDown={(e) => onMouseDown(e, 'door', door.id)}
      onClick={(e) => e.stopPropagation()} 
      className={`absolute z-20 cursor-move flex items-center justify-center
        ${selection?.id === door.id ? 'ring-2 ring-red-400' : ''}
      `}
      style={{
        left: `${door.x}%`,
        top: `${door.y}%`,
        width: door.orientation === 'horizontal' ? '6%' : '3%',
        height: door.orientation === 'horizontal' ? '3%' : '6%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* White background to cut the wall */}
      <div className="absolute inset-0 bg-[#f4ece0] border border-[#5c4d3c]"></div>
      
      {/* Architectural Swing Arc */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
         {/* Simplified architectural door symbol */}
         {door.orientation === 'horizontal' ? (
             <svg width="100%" height="200%" viewBox="0 0 100 100" className="overflow-visible" style={{ 
               transform: door.swing === 'left' ? 'scaleY(-1) translateY(50%)' : 'translateY(-50%)' 
             }}>
               <path d="M0,50 Q50,50 50,0" fill="none" stroke="#4a3b2a" strokeWidth="8" />
               <line x1="0" y1="50" x2="50" y2="0" stroke="#4a3b2a" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
               <line x1="50" y1="50" x2="50" y2="0" stroke="#4a3b2a" strokeWidth="8" />
             </svg>
         ) : (
             <svg width="200%" height="100%" viewBox="0 0 100 100" className="overflow-visible" style={{ 
               transform: door.swing === 'left' ? 'scaleX(-1) translateX(50%)' : 'translateX(-50%)' 
             }}>
               <path d="M50,0 Q50,50 0,50" fill="none" stroke="#4a3b2a" strokeWidth="8" />
               <line x1="50" y1="0" x2="0" y2="50" stroke="#4a3b2a" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
               <line x1="50" y1="50" x2="0" y2="50" stroke="#4a3b2a" strokeWidth="8" />
             </svg>
         )}
      </div>
    </div>
  );
};

export default DoorItem;