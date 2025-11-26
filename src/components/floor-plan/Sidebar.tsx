import React from 'react';
import { Copy, Trash2, MousePointer2 } from 'lucide-react';
import { Room, Door, Selection } from '@/types';

interface SidebarProps {
  selection: Selection | null;
  selectedRoom: Room | null;
  selectedDoor: Door | null;
  onDuplicateRoom: (roomId: string) => void;
  onDeleteItem: () => void;
  onUpdateRoom: (id: string, field: keyof Room, value: any) => void;
  onToggleWall: (roomId: string, wall: keyof Room['borders']) => void;
  onUpdateDoor: (id: string, field: keyof Door, value: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selection,
  selectedRoom,
  selectedDoor,
  onDuplicateRoom,
  onDeleteItem,
  onUpdateRoom,
  onToggleWall,
  onUpdateDoor
}) => {
  return (
    <div className="w-full lg:w-80 flex-shrink-0 bg-[#f4ece0] border-l-4 border-[#d4c5a9] lg:border-l-0 lg:border border-[#d4c5a9] shadow-xl flex flex-col">
      <div className="p-4 bg-[#5c4d3c] text-[#f4ece0] flex justify-between items-center">
        <h2 className="font-bold text-lg">
          {selectedRoom ? 'Room Properties' : selectedDoor ? 'Door Properties' : 'Editor'}
        </h2>
        {selection && (
          <div className="flex gap-2">
             {selectedRoom && (
               <button 
                  onClick={() => onDuplicateRoom(selectedRoom.id)}
                  className="text-[#f4ece0] hover:text-white p-1 rounded hover:bg-white/10"
                  title="Duplicate Room"
               >
                 <Copy className="w-5 h-5" />
               </button>
             )}
             <button 
                onClick={onDeleteItem}
                className="text-red-300 hover:text-red-100 p-1 rounded hover:bg-white/10"
                title="Delete Selected Item"
             >
                <Trash2 className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>

      <div className="flex-grow p-6 overflow-y-auto">
        {selectedRoom && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-200">
            {/* Name Edit */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-1">Room Name</label>
              <input 
                type="text" 
                value={selectedRoom.name}
                onChange={(e) => onUpdateRoom(selectedRoom.id, 'name', e.target.value)}
                className="w-full bg-white border border-[#d4c5a9] p-2 rounded text-[#4a3b2a] font-bold focus:outline-none focus:ring-2 focus:ring-[#5c4d3c]"
              />
            </div>

            {/* Wall Visibility Toggles */}
            <div className="bg-white/50 p-3 rounded border border-[#d4c5a9]">
               <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-2">Wall Visibility</label>
               <div className="grid grid-cols-2 gap-2">
                  {(['top', 'bottom', 'left', 'right'] as const).map(wall => (
                    <button
                      key={wall}
                      onClick={() => onToggleWall(selectedRoom.id, wall)}
                      className={`text-xs px-2 py-1 rounded border capitalize transition-all ${
                        selectedRoom.borders[wall] 
                          ? 'bg-[#5c4d3c] text-white border-[#5c4d3c]' 
                          : 'bg-transparent text-[#8c7b66] border-[#d4c5a9] hover:bg-white'
                      }`}
                    >
                      {wall} {selectedRoom.borders[wall] ? 'Visible' : 'Hidden'}
                    </button>
                  ))}
               </div>
            </div>

            {/* Dimensions Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-1">Dimensions (Calculated)</label>
              <input
                type="text"
                value={selectedRoom.dimensions}
                readOnly
                className="w-full bg-[#f4ece0] border border-[#d4c5a9] p-2 rounded text-[#4a3b2a] font-mono text-sm focus:outline-none cursor-not-allowed opacity-75"
              />
            </div>

            {/* Size Sliders */}
            <div className="space-y-4 pt-4 border-t border-[#d4c5a9]">
               <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#8c7b66]">WIDTH (%)</span>
                  <span className="text-[#4a3b2a]">{selectedRoom.w}%</span>
                </div>
                <input 
                  type="range" min="4" max="50" 
                  value={selectedRoom.w} 
                  onChange={(e) => onUpdateRoom(selectedRoom.id, 'w', parseInt(e.target.value))}
                  className="w-full accent-[#5c4d3c]"
                />
               </div>
               <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#8c7b66]">HEIGHT (%)</span>
                  <span className="text-[#4a3b2a]">{selectedRoom.h}%</span>
                </div>
                <input 
                  type="range" min="4" max="50" 
                  value={selectedRoom.h} 
                  onChange={(e) => onUpdateRoom(selectedRoom.id, 'h', parseInt(e.target.value))}
                  className="w-full accent-[#5c4d3c]"
                />
               </div>
            </div>
          </div>
        )}

        {selectedDoor && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right duration-200">
              <div className="bg-white/50 p-4 rounded border border-[#d4c5a9]">
                <h3 className="font-bold text-[#5c4d3c] mb-4">Door Settings</h3>
                
                <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-2">Door Type</label>
                      <select
                         value={selectedDoor.type}
                         onChange={(e) => onUpdateDoor(selectedDoor.id, 'type', e.target.value)}
                         className="w-full bg-white border border-[#d4c5a9] p-2 rounded text-[#4a3b2a] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5c4d3c]"
                      >
                         <option value="standard">Standard Hinged</option>
                         <option value="double">Double Door</option>
                         <option value="sliding">Sliding Door</option>
                         <option value="open">Open / Archway</option>
                      </select>
                   </div>
 
                   <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-2">Orientation</label>
                      <div className="flex gap-2">
                        <button
                           onClick={() => onUpdateDoor(selectedDoor.id, 'orientation', 'horizontal')}
                           className={`flex-1 py-2 text-xs rounded border ${selectedDoor.orientation === 'horizontal' ? 'bg-[#5c4d3c] text-white' : 'bg-white text-[#5c4d3c]'}`}
                        >Horizontal</button>
                        <button
                           onClick={() => onUpdateDoor(selectedDoor.id, 'orientation', 'vertical')}
                           className={`flex-1 py-2 text-xs rounded border ${selectedDoor.orientation === 'vertical' ? 'bg-[#5c4d3c] text-white' : 'bg-white text-[#5c4d3c]'}`}
                        >Vertical</button>
                      </div>
                   </div>
 
                   <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-2">Swing Direction</label>
                      <div className="flex gap-2">
                        <button
                           onClick={() => onUpdateDoor(selectedDoor.id, 'swing', 'left')}
                           className={`flex-1 py-2 text-xs rounded border ${selectedDoor.swing === 'left' ? 'bg-[#5c4d3c] text-white' : 'bg-white text-[#5c4d3c]'}`}
                        >Normal</button>
                        <button
                           onClick={() => onUpdateDoor(selectedDoor.id, 'swing', 'right')}
                           className={`flex-1 py-2 text-xs rounded border ${selectedDoor.swing === 'right' ? 'bg-[#5c4d3c] text-white' : 'bg-white text-[#5c4d3c]'}`}
                        >Reverse</button>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="text-xs text-[#8c7b66]">
                <p>Drag the door to position it over any wall. The white background will automatically hide the wall behind it.</p>
              </div>
           </div>
        )}

        {!selection && (
          <div className="h-full flex flex-col items-center justify-center text-center text-[#8c7b66] opacity-60">
            <MousePointer2 className="w-12 h-12 mb-2" />
            <p>Select a room or door to edit its properties.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;