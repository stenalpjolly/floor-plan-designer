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
import { Room, Door, Furniture, Selection, DragState } from '@/types';
import RoomItem from './RoomItem';
import DoorItem from './DoorItem';
import FurnitureItem from './FurnitureItem';
import ContextMenu from './ContextMenu';

interface CanvasProps {
  containerRef: RefObject<HTMLDivElement | null>;
  rooms: Room[];
  doors: Door[];
  furniture: Furniture[];
  selection: Selection | null;
  dragState: DragState | null;
  showDimensions: boolean;
  viewState: { scale: number; panX: number; panY: number };
  appMode: 'structure' | 'interior';
  onMouseDown: (e: MouseEvent, type: 'room' | 'door' | 'canvas' | 'furniture', id: string) => void;
  onSelectionClear: () => void;
  onUpdateRoomType: (roomId: string, type: string, name: string) => void;
  onWheel?: (e: React.WheelEvent) => void;
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
  furniture,
  selection,
  dragState,
  showDimensions,
  viewState,
  appMode,
  onMouseDown,
  onSelectionClear,
  onUpdateRoomType,
  onWheel
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
      className="flex-grow relative bg-[#f9f5eb] rounded shadow-inner border-[6px] border-[#5c4d3c] overflow-hidden cursor-crosshair w-full h-full"
      ref={containerRef}
      onClick={onSelectionClear}
      onMouseDown={(e) => onMouseDown(e, 'canvas', 'canvas')}
      onWheel={onWheel}
    >
      {/* Grid Background - Fixed to viewport but animates properties to simulate infinite grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
           style={{
             backgroundImage: `
               linear-gradient(#5c4d3c 1px, transparent 1px),
               linear-gradient(90deg, #5c4d3c 1px, transparent 1px)
             `,
             backgroundSize: `${40 * viewState.scale}px ${40 * viewState.scale}px`,
             backgroundPosition: `${viewState.panX}px ${viewState.panY}px`
           }}>
      </div>

      <div
        className="absolute top-0 left-0 origin-top-left will-change-transform"
        style={{
          transform: `translate(${viewState.panX}px, ${viewState.panY}px) scale(${viewState.scale})`,
          width: '100%',
          aspectRatio: '1 / 1'
        }}
      >
        {/* Rooms */}
        <div className={appMode === 'interior' ? 'pointer-events-none' : ''}>
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
        </div>

        {/* Doors */}
        <div className={appMode === 'interior' ? 'pointer-events-none' : ''}>
            {doors.map((door) => (
            <DoorItem
                key={door.id}
                door={door}
                selection={selection}
                onMouseDown={onMouseDown}
            />
            ))}
        </div>

        {/* Furniture */}
        <div className={appMode === 'structure' ? 'pointer-events-none opacity-80' : ''}>
            {furniture.map((item) => (
                <FurnitureItem
                    key={item.id}
                    furniture={item}
                    selection={selection}
                    dragState={dragState}
                    onMouseDown={onMouseDown}
                />
            ))}
        </div>
      </div>

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
    </div>
  );
};

export default Canvas;