import React from 'react';
import { Copy, Trash2, MousePointer2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Layout, Grid, Plus, Minus, AlertTriangle, BedDouble, BedSingle, Sofa, Utensils, Monitor, Archive, Armchair, Flower2, Bath, Droplets, CloudRain } from 'lucide-react';
import { Room, Door, Furniture, Selection } from '@/types';
import { validateRoom } from '@/utils/validation';

interface SidebarProps {
  appMode: 'structure' | 'interior';
  selection: Selection | null;
  selectedRoom: Room | null;
  selectedDoor: Door | null;
  selectedFurniture: Furniture | null;
  onDuplicateRoom: (roomId: string) => void;
  onDuplicateRoomDirectional: (roomId: string, direction: 'top' | 'bottom' | 'left' | 'right') => void;
  onDeleteItem: () => void;
  onUpdateRoom: (id: string, field: keyof Room, value: any) => void;
  onToggleWall: (roomId: string, wall: keyof Room['borders']) => void;
  onUpdateDoor: (id: string, field: keyof Door, value: any) => void;
  onAddFurniture: (type: string) => void;
  onUpdateFurniture: (id: string, field: keyof Furniture, value: any) => void;
}

// Preset Definitions for "Smart Types"
const ROOM_PRESETS = {
    master_bedroom: { label: 'Master Bed', w: 18, h: 16, color: '#e8dcca' },
    bedroom: { label: 'Bedroom', w: 14, h: 14, color: '#f0e6d2' },
    kitchen: { label: 'Kitchen', w: 14, h: 12, color: '#fff0f0' },
    dining: { label: 'Dining', w: 14, h: 12, color: '#fff8e0' },
    living: { label: 'Living', w: 20, h: 18, color: '#fdf6e9' },
    bathroom: { label: 'Bath', w: 8, h: 10, color: '#e0eff1' },
    corridor: { label: 'Corridor', w: 25, h: 6, color: '#f9f9f9' },
    garage: { label: 'Garage', w: 20, h: 20, color: '#e0e0e0' },
};

const FURNITURE_LIBRARY = [
    { type: 'bed_queen', label: 'Queen Bed', icon: <BedDouble className="w-5 h-5" /> },
    { type: 'bed_single', label: 'Single Bed', icon: <BedSingle className="w-5 h-5" /> },
    { type: 'sofa_3', label: '3-Seat Sofa', icon: <Sofa className="w-5 h-5" /> },
    { type: 'sofa_2', label: '2-Seat Sofa', icon: <Armchair className="w-5 h-5" /> },
    { type: 'table_dining', label: 'Dining Table', icon: <Utensils className="w-5 h-5" /> },
    { type: 'table_round', label: 'Round Table', icon: <Utensils className="w-5 h-5" /> },
    { type: 'desk', label: 'Office Desk', icon: <Monitor className="w-5 h-5" /> },
    { type: 'wardrobe', label: 'Wardrobe', icon: <Archive className="w-5 h-5" /> },
    { type: 'tv_unit', label: 'TV Unit', icon: <Monitor className="w-5 h-5" /> },
    { type: 'toilet', label: 'Toilet', icon: <Bath className="w-5 h-5" /> },
    { type: 'sink', label: 'Sink', icon: <Droplets className="w-5 h-5" /> },
    { type: 'shower', label: 'Shower', icon: <CloudRain className="w-5 h-5" /> },
    { type: 'plant', label: 'Indoor Plant', icon: <Flower2 className="w-5 h-5" /> },
];

const Sidebar: React.FC<SidebarProps> = ({
  appMode,
  selection,
  selectedRoom,
  selectedDoor,
  selectedFurniture,
  onDuplicateRoom,
  onDuplicateRoomDirectional,
  onDeleteItem,
  onUpdateRoom,
  onToggleWall,
  onUpdateDoor,
  onAddFurniture,
  onUpdateFurniture
}) => {
  
  const handleApplyPreset = (type: string) => {
      if (!selectedRoom) return;
      // @ts-ignore
      const preset = ROOM_PRESETS[type];
      if (preset) {
          onUpdateRoom(selectedRoom.id, 'type', type);
          // Update name to match preset if it hasn't been custom renamed (or just always update it for speed)
          onUpdateRoom(selectedRoom.id, 'name', preset.label);
          // We do separate updates, or the parent could handle a bulk update.
          // Ideally we'd add a bulk update method, but calling twice is okay for now.
          onUpdateRoom(selectedRoom.id, 'w', preset.w);
          onUpdateRoom(selectedRoom.id, 'h', preset.h);
      }
  };

  const handleFlip = () => {
      if (!selectedRoom) return;
      const currentW = selectedRoom.w;
      const currentH = selectedRoom.h;
      onUpdateRoom(selectedRoom.id, 'w', currentH);
      onUpdateRoom(selectedRoom.id, 'h', currentW);
  };

  const setWallPreset = (mode: 'open' | 'closed') => {
      if (!selectedRoom) return;
      const isVisible = mode === 'closed';
      (['top', 'bottom', 'left', 'right'] as const).forEach(wall => {
           // If current state is different, toggle it.
           // Note: This is a bit hacky because `onToggleWall` toggles.
           // A better `setWall` method would be cleaner, but we work with what we have.
           if (selectedRoom.borders[wall] !== isVisible) {
               onToggleWall(selectedRoom.id, wall);
           }
      });
  };

  const roomValidation = selectedRoom ? validateRoom(selectedRoom) : null;

  return (
    <div className="w-full lg:w-80 flex-shrink-0 bg-[#f4ece0] border-l-4 border-[#d4c5a9] lg:border-l-0 lg:border border-[#d4c5a9] shadow-xl flex flex-col">
      <div className="p-4 bg-[#5c4d3c] text-[#f4ece0] flex justify-between items-center">
        <h2 className="font-bold text-lg">
          {appMode === 'interior' ? 'Interior Design' : (selectedRoom ? 'Room Properties' : selectedDoor ? 'Door Properties' : 'Structure Editor')}
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
            
            {/* Validation Warning */}
            {roomValidation && !roomValidation.isValid && (
              <div className="bg-red-50 border border-red-200 p-3 rounded text-red-700 text-xs flex gap-2 items-start">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{roomValidation.message}</span>
              </div>
            )}

            {/* --- 1. SMART ACTIONS (Clone & Flip) --- */}
            <div className="bg-[#e8dfce] p-3 rounded border border-[#d4c5a9]">
               <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-2 flex items-center gap-1">
                   <Layout className="w-3 h-3"/> Rapid Layout
               </label>
               <div className="flex gap-2 justify-center mb-2">
                    <button
                        onClick={() => onDuplicateRoomDirectional(selectedRoom.id, 'top')}
                        className="p-2 bg-white border border-[#d4c5a9] rounded hover:bg-[#5c4d3c] hover:text-white transition-colors" title="Clone Top"
                    ><ArrowUp className="w-4 h-4"/></button>
               </div>
               <div className="flex gap-2 justify-center mb-2">
                    <button
                         onClick={() => onDuplicateRoomDirectional(selectedRoom.id, 'left')}
                         className="p-2 bg-white border border-[#d4c5a9] rounded hover:bg-[#5c4d3c] hover:text-white transition-colors" title="Clone Left"
                    ><ArrowLeft className="w-4 h-4"/></button>
                    
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-[#5c4d3c] bg-[#d4c5a9]/30 rounded-full text-xs">
                        ROOM
                    </div>

                    <button
                         onClick={() => onDuplicateRoomDirectional(selectedRoom.id, 'right')}
                         className="p-2 bg-white border border-[#d4c5a9] rounded hover:bg-[#5c4d3c] hover:text-white transition-colors" title="Clone Right"
                    ><ArrowRight className="w-4 h-4"/></button>
               </div>
               <div className="flex gap-2 justify-center">
                    <button
                         onClick={() => onDuplicateRoomDirectional(selectedRoom.id, 'bottom')}
                         className="p-2 bg-white border border-[#d4c5a9] rounded hover:bg-[#5c4d3c] hover:text-white transition-colors" title="Clone Bottom"
                    ><ArrowDown className="w-4 h-4"/></button>
               </div>
               
               <div className="mt-3 pt-3 border-t border-[#d4c5a9]/50 flex gap-2">
                   <button
                      onClick={handleFlip}
                      className="flex-1 py-1 bg-white border border-[#d4c5a9] rounded text-xs font-bold text-[#5c4d3c] flex items-center justify-center gap-1 hover:bg-[#fcf0dc]"
                   >
                       <RotateCcw className="w-3 h-3"/> Rotate 90°
                   </button>
               </div>
            </div>

            {/* --- 2. ROOM TYPE PRESETS --- */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-1 flex items-center gap-1">
                  <Grid className="w-3 h-3"/> Smart Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                  {Object.entries(ROOM_PRESETS).map(([key, preset]) => (
                      <button
                          key={key}
                          onClick={() => handleApplyPreset(key)}
                          className={`text-xs py-2 px-1 rounded border transition-all text-center truncate ${
                              selectedRoom.type === key
                              ? 'bg-[#5c4d3c] text-white border-[#5c4d3c] shadow-inner'
                              : 'bg-white text-[#4a3b2a] border-[#d4c5a9] hover:bg-[#fcf0dc]'
                          }`}
                          style={{ borderLeftWidth: selectedRoom.type === key ? '4px' : '1px', borderLeftColor: preset.color }}
                      >
                          {preset.label}
                      </button>
                  ))}
              </div>
            </div>

            {/* Name Edit */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-1">Custom Name</label>
              <input
                type="text"
                value={selectedRoom.name}
                onChange={(e) => onUpdateRoom(selectedRoom.id, 'name', e.target.value)}
                className="w-full bg-white border border-[#d4c5a9] p-2 rounded text-[#4a3b2a] font-bold focus:outline-none focus:ring-2 focus:ring-[#5c4d3c]"
              />
            </div>

            {/* Dimensions Text & Quick Size */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-1">Dimensions (Calculated)</label>
              <div className="flex gap-2 mb-2">
                   <input
                        type="text"
                        value={selectedRoom.dimensions}
                        readOnly
                        className="flex-grow bg-[#f4ece0] border border-[#d4c5a9] p-2 rounded text-[#4a3b2a] font-mono text-sm focus:outline-none cursor-not-allowed opacity-75"
                    />
              </div>
              <div className="flex gap-1">
                   {[8, 12, 16, 20].map(size => (
                       <button
                           key={size}
                           onClick={() => {
                               onUpdateRoom(selectedRoom.id, 'w', size);
                               onUpdateRoom(selectedRoom.id, 'h', size);
                           }}
                           className="flex-1 py-1 bg-white border border-[#d4c5a9] rounded text-[10px] font-bold text-[#8c7b66] hover:bg-[#5c4d3c] hover:text-white"
                       >
                           {size}x{size}
                       </button>
                   ))}
              </div>
            </div>

            {/* Size Sliders */}
            <div className="space-y-3 pt-3 border-t border-[#d4c5a9]">
               <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#8c7b66]">WIDTH</span>
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
                  <span className="font-bold text-[#8c7b66]">HEIGHT</span>
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

            {/* Wall Visibility Toggles */}
            <div className="bg-white/50 p-3 rounded border border-[#d4c5a9]">
               <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66]">Wall Visibility</label>
                    <div className="flex gap-1">
                         <button onClick={() => setWallPreset('open')} className="text-[10px] px-1 bg-white border border-[#d4c5a9] rounded hover:bg-[#5c4d3c] hover:text-white" title="Open All">OPEN</button>
                         <button onClick={() => setWallPreset('closed')} className="text-[10px] px-1 bg-white border border-[#d4c5a9] rounded hover:bg-[#5c4d3c] hover:text-white" title="Close All">BOX</button>
                    </div>
               </div>
               
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
                      {wall}
                    </button>
                  ))}
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

                   <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-2">Width (ft)</label>
                      <div className="flex items-center gap-2 bg-white border border-[#d4c5a9] rounded p-1">
                          <button
                              onClick={() => {
                                  const currentWidth = selectedDoor.width ?? (selectedDoor.type === 'double' ? 6 : 3);
                                  onUpdateDoor(selectedDoor.id, 'width', Math.max(1, currentWidth - 0.5));
                              }}
                              className="p-1 hover:bg-[#f4ece0] rounded text-[#5c4d3c]"
                              title="Decrease Width"
                          >
                              <Minus className="w-4 h-4" />
                          </button>
                          <span className="flex-1 text-center font-bold text-[#4a3b2a] text-sm">
                              {selectedDoor.width ?? (selectedDoor.type === 'double' ? 6 : 3)} ft
                          </span>
                          <button
                              onClick={() => {
                                  const currentWidth = selectedDoor.width ?? (selectedDoor.type === 'double' ? 6 : 3);
                                  onUpdateDoor(selectedDoor.id, 'width', Math.min(12, currentWidth + 0.5));
                              }}
                              className="p-1 hover:bg-[#f4ece0] rounded text-[#5c4d3c]"
                              title="Increase Width"
                          >
                              <Plus className="w-4 h-4" />
                          </button>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="text-xs text-[#8c7b66]">
                <p>Drag the door to position it over any wall. The white background will automatically hide the wall behind it.</p>
              </div>
           </div>
        )}

        {selectedFurniture && appMode === 'interior' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right duration-200">
                 <div className="bg-white/50 p-4 rounded border border-[#d4c5a9]">
                    <h3 className="font-bold text-[#5c4d3c] mb-4">Furniture Settings</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-2">Rotation</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onUpdateFurniture(selectedFurniture.id, 'rotation', (selectedFurniture.rotation - 45 + 360) % 360)}
                                    className="flex-1 py-2 bg-white border border-[#d4c5a9] rounded hover:bg-[#5c4d3c] hover:text-white transition-colors"
                                >-45°</button>
                                <button
                                    onClick={() => onUpdateFurniture(selectedFurniture.id, 'rotation', (selectedFurniture.rotation + 45) % 360)}
                                    className="flex-1 py-2 bg-white border border-[#d4c5a9] rounded hover:bg-[#5c4d3c] hover:text-white transition-colors"
                                >+45°</button>
                            </div>
                        </div>
                        
                        <div>
                           <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-2">Size (ft)</label>
                           <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-xs text-[#8c7b66]">Width</span>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => onUpdateFurniture(selectedFurniture.id, 'width', Math.max(1, selectedFurniture.width - 0.5))} className="p-1 bg-white rounded border"><Minus className="w-3 h-3"/></button>
                                        <span className="flex-1 text-center text-sm font-bold">{selectedFurniture.width}</span>
                                        <button onClick={() => onUpdateFurniture(selectedFurniture.id, 'width', selectedFurniture.width + 0.5)} className="p-1 bg-white rounded border"><Plus className="w-3 h-3"/></button>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-[#8c7b66]">Depth</span>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => onUpdateFurniture(selectedFurniture.id, 'depth', Math.max(1, selectedFurniture.depth - 0.5))} className="p-1 bg-white rounded border"><Minus className="w-3 h-3"/></button>
                                        <span className="flex-1 text-center text-sm font-bold">{selectedFurniture.depth}</span>
                                        <button onClick={() => onUpdateFurniture(selectedFurniture.id, 'depth', selectedFurniture.depth + 0.5)} className="p-1 bg-white rounded border"><Plus className="w-3 h-3"/></button>
                                    </div>
                                </div>
                           </div>
                        </div>
                    </div>
                 </div>
             </div>
        )}

        {!selection && appMode === 'interior' && (
             <div className="space-y-4">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-[#8c7b66] mb-2">Library</h3>
                 <div className="grid grid-cols-2 gap-2">
                     {FURNITURE_LIBRARY.map(item => (
                         <button
                             key={item.type}
                             onClick={() => onAddFurniture(item.type)}
                             className="flex flex-col items-center justify-center p-3 bg-white border border-[#d4c5a9] rounded hover:bg-[#5c4d3c] hover:text-white transition-colors gap-2"
                         >
                             {item.icon}
                             <span className="text-xs font-medium">{item.label}</span>
                         </button>
                     ))}
                 </div>
             </div>
        )}

        {!selection && appMode === 'structure' && (
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