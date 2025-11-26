import React, { MouseEvent, RefObject } from 'react';
import { Room, Door, Selection, DragState } from '@/types';
import RoomItem from './RoomItem';
import DoorItem from './DoorItem';

interface CanvasProps {
  containerRef: RefObject<HTMLDivElement | null>;
  rooms: Room[];
  doors: Door[];
  selection: Selection | null;
  dragState: DragState | null;
  showDimensions: boolean;
  onMouseDown: (e: MouseEvent, type: 'room' | 'door', id: string) => void;
  onSelectionClear: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
  containerRef,
  rooms,
  doors,
  selection,
  dragState,
  showDimensions,
  onMouseDown,
  onSelectionClear
}) => {
  return (
    <div
      className="flex-grow relative bg-[#f9f5eb] rounded shadow-inner border-[6px] border-[#5c4d3c] overflow-hidden cursor-crosshair"
      style={{ aspectRatio: '3/2' }}
      ref={containerRef}
      onClick={onSelectionClear}
    >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: `
                 linear-gradient(#5c4d3c 1px, transparent 1px),
                 linear-gradient(90deg, #5c4d3c 1px, transparent 1px)
               `, 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* Rooms */}
        {rooms.map((room) => (
          <RoomItem
            key={room.id}
            room={room}
            selection={selection}
            dragState={dragState}
            showDimensions={showDimensions}
            onMouseDown={onMouseDown}
          />
        ))}

        {/* Doors */}
        {doors.map((door) => (
          <DoorItem
            key={door.id}
            door={door}
            selection={selection}
            onMouseDown={onMouseDown}
          />
        ))}
        
        {/* Courtyard Visual Helper */}
        <div className="absolute top-[38%] left-[43%] text-[#4a3b2a] opacity-10 font-bold text-4xl pointer-events-none z-0 rotate-45">
           COURTYARD
        </div>

    </div>
  );
};

export default Canvas;