import React, { MouseEvent, RefObject, useState } from 'react';
import {
  BedDouble,
  BedSingle,
  Utensils,
  Sofa,
  Bath,
  Armchair,
  Library,
  WashingMachine,
  Trees,
  Briefcase,
  Car,
  Warehouse,
  DoorOpen
} from 'lucide-react';
import { Room, Door, Selection, DragState } from '@/types';
import RoomItem from './RoomItem';
import DoorItem from './DoorItem';
import ContextMenu from './ContextMenu';

interface CanvasProps {
  containerRef: RefObject<HTMLDivElement | null>;
  rooms: Room[];
  doors: Door[];
  selection: Selection | null;
  dragState: DragState | null;
  showDimensions: boolean;
  onMouseDown: (e: MouseEvent, type: 'room' | 'door', id: string) => void;
  onSelectionClear: () => void;
  onUpdateRoomType: (roomId: string, type: string, name: string) => void;
}

const ROOM_TYPES = [
  { label: 'Master Bedroom', value: 'master_bedroom', icon: <BedDouble className="w-4 h-4" /> },
  { label: 'Bedroom', value: 'bedroom', icon: <BedSingle className="w-4 h-4" /> },
  { label: 'Kitchen', value: 'kitchen', icon: <Utensils className="w-4 h-4" /> },
  { label: 'Living Room', value: 'living', icon: <Sofa className="w-4 h-4" /> },
  { label: 'Dining Room', value: 'dining', icon: <Utensils className="w-4 h-4" /> },
  { label: 'Bathroom', value: 'bathroom', icon: <Bath className="w-4 h-4" /> },
  { label: 'Study / Office', value: 'study', icon: <Library className="w-4 h-4" /> },
  { label: 'Laundry / Utility', value: 'utility', icon: <WashingMachine className="w-4 h-4" /> },
  { label: 'Garage', value: 'garage', icon: <Car className="w-4 h-4" /> },
  { label: 'Balcony / Patio', value: 'outdoor', icon: <Trees className="w-4 h-4" /> },
  { label: 'Corridor / Hall', value: 'corridor', icon: <DoorOpen className="w-4 h-4" /> },
  { label: 'Storage', value: 'storage', icon: <Warehouse className="w-4 h-4" /> },
  { label: 'Entrance', value: 'entrance', icon: <DoorOpen className="w-4 h-4" /> },
];

const Canvas: React.FC<CanvasProps> = ({
  containerRef,
  rooms,
  doors,
  selection,
  dragState,
  showDimensions,
  onMouseDown,
  onSelectionClear,
  onUpdateRoomType
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; roomId: string } | null>(null);

  const handleRoomContextMenu = (e: MouseEvent, roomId: string) => {
    e.preventDefault();
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContextMenu({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            roomId
        });
    }
  };

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
            onContextMenu={handleRoomContextMenu}
          />
        ))}

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            options={ROOM_TYPES.map(type => ({
              label: type.label,
              icon: type.icon,
              action: () => onUpdateRoomType(contextMenu.roomId, type.value, type.label)
            }))}
          />
        )}

        {/* Doors */}
        {doors.map((door) => (
          <DoorItem
            key={door.id}
            door={door}
            selection={selection}
            onMouseDown={onMouseDown}
          />
        ))}
        
    </div>
  );
};

export default Canvas;