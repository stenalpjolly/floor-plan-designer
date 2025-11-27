import React, { MouseEvent } from 'react';
import { Move, AlertTriangle } from 'lucide-react';
import { Room, Selection, DragState } from '@/types';
import { validateRoom } from '@/utils/validation';
import { calculateArea } from '@/utils/dimensions';

interface RoomItemProps {
  room: Room;
  selection: Selection | null;
  dragState: DragState | null;
  showDimensions: boolean;
  onMouseDown: (e: MouseEvent, type: 'room' | 'door', id: string) => void;
  onContextMenu: (e: MouseEvent, roomId: string) => void;
}

const getRoomColor = (type: string) => {
  // Helper to match prefixes for grouped coloring
  if (type.startsWith('kitchen')) return 'bg-[#fff0f0] hover:bg-[#ffe0e0]'; // Reddish
  if (type.startsWith('bathroom')) return 'bg-[#e0eff1] hover:bg-[#d0eef1]'; // Cyanish
  if (type.startsWith('living')) return 'bg-[#fdf6e9] hover:bg-[#fcf0dc]'; // Warm
  if (type.startsWith('garage')) return 'bg-[#e0e0e0] hover:bg-[#d1d1d1]'; // Grey
  if (type.startsWith('closet') || type === 'pantry') return 'bg-[#e8e4dd] hover:bg-[#ded9cf]'; // Storage Brown
  
  switch (type) {
    case 'master_bedroom': return 'bg-[#e8dcca] hover:bg-[#decbb5]'; // Distinct Beige
    case 'bedroom':
    case 'nursery':
      return 'bg-[#f0e6d2] hover:bg-[#e6dcc8]'; // Standard Beige
    
    case 'dining':
    case 'breakfast_nook':
      return 'bg-[#fff8e0] hover:bg-[#ffeecc]'; // Yellowish
      
    case 'study': return 'bg-[#f2f0e6] hover:bg-[#e6e2d1]'; // Office White
    
    case 'laundry':
    case 'utility':
      return 'bg-[#ebebeb] hover:bg-[#dddddd]'; // Utility Grey
      
    case 'mudroom':
    case 'entrance':
      return 'bg-[#f5f5dc] hover:bg-[#ebebc2]'; // Entry Beige
      
    case 'outdoor': return 'bg-[#e8f5e9] hover:bg-[#dceddd]'; // Green
    case 'corridor': return 'bg-[#f9f9f9] hover:bg-[#f0f0f0]'; // White/Grey
    
    default: return 'bg-white hover:bg-gray-50';
  }
};

const RoomItem: React.FC<RoomItemProps> = ({ room, selection, dragState, showDimensions, onMouseDown, onContextMenu }) => {
  const validation = validateRoom(room);

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, 'room', room.id)}
      onContextMenu={(e) => onContextMenu(e, room.id)}
      onClick={(e) => e.stopPropagation()} 
      className={`absolute flex flex-col items-center justify-center text-center overflow-hidden transition-shadow group
        ${getRoomColor(room.type)}
        ${selection?.id === room.id ? 'z-10 shadow-[0_0_0_4px_#d4a373,0_25px_50px_-12px_rgba(0,0,0,0.25)]' : 'z-0 hover:z-10'}
        ${!validation.isValid && selection?.id !== room.id ? 'shadow-[0_0_0_2px_#ef4444]' : ''}
        ${dragState?.id === room.id ? 'cursor-grabbing opacity-90' : 'cursor-grab'}
      `}
      style={{
        left: `${room.x}%`,
        top: `${room.y}%`,
        width: `${room.w}%`,
        height: `${room.h}%`,
        // Dynamic borders based on state
        borderTop: room.borders.top ? '3px solid #4a3b2a' : 'none',
        borderBottom: room.borders.bottom ? '3px solid #4a3b2a' : 'none',
        borderLeft: room.borders.left ? '3px solid #4a3b2a' : 'none',
        borderRight: room.borders.right ? '3px solid #4a3b2a' : 'none',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.03)' 
      }}
    >
      {/* Visual "Wall" Inner Line for Blueprint Look - only on active borders */}
      <div className="absolute inset-1 pointer-events-none" style={{
         borderTop: room.borders.top ? '1px solid #4a3b2a' : 'none',
         borderBottom: room.borders.bottom ? '1px solid #4a3b2a' : 'none',
         borderLeft: room.borders.left ? '1px solid #4a3b2a' : 'none',
         borderRight: room.borders.right ? '1px solid #4a3b2a' : 'none',
         opacity: 0.3
      }}></div>

      <div className="z-10 pointer-events-none px-1">
        <span className="font-bold text-[0.6rem] md:text-xs lg:text-sm leading-tight block">
          {room.name}
        </span>
        {showDimensions && (
          <>
            <span className="text-[0.5rem] md:text-[0.65rem] text-[#6b5d4d] mt-1 font-sans block opacity-80">
              {room.dimensions}
            </span>
            <span className="text-[0.5rem] md:text-[0.65rem] text-[#6b5d4d] font-sans block opacity-60">
              {calculateArea(room.w, room.h)} sq.ft
            </span>
          </>
        )}
      </div>

      {/* Resize Handle Hint */}
      {selection?.id === room.id && (
         <div className="absolute bottom-1 right-1 opacity-50 pointer-events-none">
           <Move className="w-3 h-3 text-[#4a3b2a]" />
         </div>
      )}

      {/* Validation Warning */}
      {!validation.isValid && (
        <div className="absolute top-1 right-1 text-[#dc2626] bg-white/80 rounded-full p-0.5" title={validation.message}>
          <AlertTriangle className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};

export default RoomItem;