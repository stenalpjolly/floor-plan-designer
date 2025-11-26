import React, { MouseEvent } from 'react';
import { Move } from 'lucide-react';
import { Room, Selection, DragState } from '@/types';

interface RoomItemProps {
  room: Room;
  selection: Selection | null;
  dragState: DragState | null;
  showDimensions: boolean;
  onMouseDown: (e: MouseEvent, type: 'room' | 'door', id: string) => void;
  onContextMenu: (e: MouseEvent, roomId: string) => void;
}

const getRoomColor = (type: string) => {
  switch (type) {
    case 'bedroom': return 'bg-[#f0e6d2] hover:bg-[#e6dcc8]';
    case 'bathroom': return 'bg-[#e0eff1] hover:bg-[#d0eef1]';
    case 'living': return 'bg-[#fdf6e9] hover:bg-[#fcf0dc]';
    case 'utility': return 'bg-[#ebebeb] hover:bg-[#dddddd]';
    case 'outdoor': return 'bg-[#e8f5e9] hover:bg-[#dceddd]';
    default: return 'bg-white hover:bg-gray-50';
  }
};

const RoomItem: React.FC<RoomItemProps> = ({ room, selection, dragState, showDimensions, onMouseDown, onContextMenu }) => {
  return (
    <div
      onMouseDown={(e) => onMouseDown(e, 'room', room.id)}
      onContextMenu={(e) => onContextMenu(e, room.id)}
      onClick={(e) => e.stopPropagation()} 
      className={`absolute flex flex-col items-center justify-center text-center overflow-hidden transition-shadow group
        ${getRoomColor(room.type)}
        ${selection?.id === room.id ? 'z-10 ring-4 ring-[#d4a373] shadow-2xl' : 'z-0 hover:z-10'}
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
          <span className="text-[0.5rem] md:text-[0.65rem] text-[#6b5d4d] mt-1 font-sans block opacity-80">
            {room.dimensions}
          </span>
        )}
      </div>

      {/* Resize Handle Hint */}
      {selection?.id === room.id && (
         <div className="absolute bottom-1 right-1 opacity-50 pointer-events-none">
           <Move className="w-3 h-3 text-[#4a3b2a]" />
         </div>
      )}
    </div>
  );
};

export default RoomItem;