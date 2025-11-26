'use client';

import React, { useState, useRef, useEffect, MouseEvent, ChangeEvent } from 'react';
import { Home, Ruler, Plus, Trash2, Move, MousePointer2, DoorOpen, Copy, Download, Upload } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  dimensions: string;
  details: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  borders: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
}

interface Door {
  id: string;
  x: number;
  y: number;
  orientation: 'horizontal' | 'vertical';
  swing: 'left' | 'right';
}

interface Selection {
  type: 'room' | 'door';
  id: string;
}

interface DragState {
  type: 'room' | 'door';
  id: string;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

const FloorPlanApp = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selection, setSelection] = useState<Selection | null>(null); // { type: 'room' | 'door', id: string }
  const [showDimensions, setShowDimensions] = useState(true);
  const [dragState, setDragState] = useState<DragState | null>(null); // { type, id, startX, startY, initialX, initialY }

  // Initial Room Data with Wall Visibility
  const initialRooms: Room[] = [
    { id: 'ms1', name: 'Master Suite 1 (SW)', dimensions: "18' x 17'", details: 'Spacious master bedroom.', x: 5, y: 10, w: 20, h: 25, type: 'bedroom', borders: { top: true, bottom: true, left: true, right: true } },
    { id: 'mb1', name: 'Master Bath 1', dimensions: "12' x 10'", details: 'En-suite bathroom.', x: 25, y: 10, w: 10, h: 12, type: 'bathroom', borders: { top: true, bottom: true, left: true, right: true } },
    { id: 'walkin', name: 'Walk-In', dimensions: "8' x 10'", details: 'Walk-in closet.', x: 5, y: 35, w: 8, h: 10, type: 'utility', borders: { top: true, bottom: true, left: true, right: true } },
    { id: 'bed1_upper', name: 'Standard Bedroom 1', dimensions: "16' x 13'", details: 'Standard bedroom.', x: 5, y: 45, w: 16, h: 20, type: 'bedroom', borders: { top: true, bottom: true, left: true, right: true } },
    { id: 'bed1_lower', name: 'Standard Bedroom 1', dimensions: "16' x 13'", details: 'Standard bedroom layout.', x: 5, y: 65, w: 20, h: 20, type: 'bedroom', borders: { top: true, bottom: true, left: true, right: true } },
    { id: 'living', name: 'Formal Living Room', dimensions: "20' x 18'", details: 'Formal living area.', x: 21, y: 45, w: 20, h: 40, type: 'living', borders: { top: true, bottom: true, left: true, right: false } }, // Open to right
    { id: 'family_hall', name: 'Massive Family Hall', dimensions: "Gallery", details: 'Central spine.', x: 35, y: 10, w: 30, h: 28, type: 'living', borders: { top: true, bottom: false, left: true, right: true } },
    { id: 'courtyard', name: 'Central Courtyard', dimensions: "14' x 14'", details: 'Light/air well.', x: 43, y: 38, w: 14, h: 24, type: 'outdoor', borders: { top: true, bottom: true, left: true, right: true } },
    { id: 'dining', name: 'Dining Area', dimensions: "16' x 14'", details: 'Dining space.', x: 57, y: 40, w: 13, h: 20, type: 'living', borders: { top: true, bottom: true, left: false, right: true } }, // Open to left
    { id: 'foyer', name: 'Grand Foyer', dimensions: "12' x 10'", details: 'Entrance hall.', x: 45, y: 65, w: 12, h: 15, type: 'living', borders: { top: false, bottom: true, left: true, right: true } },
    { id: 'powder', name: 'Powder Room', dimensions: "6' x 5'", details: 'Guest restroom.', x: 41, y: 70, w: 4, h: 8, type: 'bathroom', borders: { top: true, bottom: true, left: true, right: true } },
    { id: 'porch', name: 'Car Porch', dimensions: "25' x 22'", details: 'Shelter for 2 cars.', x: 57, y: 62, w: 15, h: 23, type: 'outdoor', borders: { top: true, bottom: true, left: true, right: true } },
    { id: 'ms2', name: 'Master Suite 2 (SE)', dimensions: "18' x 16'", details: 'Second master suite.', x: 75, y: 10, w: 20, h: 25, type: 'bedroom', borders: { top: true, bottom: true, left: true, right: true } },
    { id: 'mb2', name: 'Master Bath 2', dimensions: "12' x 9'", details: 'Private bathroom.', x: 65, y: 10, w: 10, h: 12, type: 'bathroom', borders: { top: true, bottom: true, left: true, right: true } },
    { id: 'dry_kitchen', name: 'Dry Kitchen', dimensions: "12' x 10'", details: 'Pantry area.', x: 72, y: 38, w: 10, h: 15, type: 'utility', borders: { top: true, bottom: true, left: true, right: true } },
    { id: 'wet_kitchen', name: 'Wet Kitchen', dimensions: "14' x 12'", details: 'Heavy-duty kitchen.', x: 82, y: 38, w: 13, h: 18, type: 'utility', borders: { top: true, bottom: true, left: true, right: true } },
    { id: 'bed2', name: 'Standard Bedroom 2', dimensions: "16' x 13'", details: 'Standard bedroom.', x: 74, y: 60, w: 21, h: 25, type: 'bedroom', borders: { top: true, bottom: true, left: true, right: true } }
  ];

  // Initial Door Data
  const initialDoors: Door[] = [
    { id: 'd1', x: 23, y: 35, orientation: 'horizontal', swing: 'left' },
    { id: 'd2', x: 75, y: 35, orientation: 'horizontal', swing: 'right' },
    { id: 'd3', x: 45, y: 65, orientation: 'horizontal', swing: 'left' }, // Foyer main
    { id: 'd4', x: 25, y: 55, orientation: 'vertical', swing: 'left' },
  ];

  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [doors, setDoors] = useState<Door[]>(initialDoors);

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

  // --- Dragging Logic ---
  const handleMouseDown = (e: MouseEvent, type: 'room' | 'door', id: string) => {
    e.stopPropagation();
    setSelection({ type, id });
    
    const item = type === 'room' ? rooms.find(r => r.id === id) : doors.find(d => d.id === id);
    if (!item || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseYPercent = ((e.clientY - rect.top) / rect.height) * 100;

    setDragState({
      type,
      id,
      startX: mouseXPercent,
      startY: mouseYPercent,
      initialX: item.x,
      initialY: item.y
    });
  };

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!dragState || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const currentMouseXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const currentMouseYPercent = ((e.clientY - rect.top) / rect.height) * 100;

    const deltaX = currentMouseXPercent - dragState.startX;
    const deltaY = currentMouseYPercent - dragState.startY;

    // Basic snap logic (0.5% grid)
    let newX = Math.round((dragState.initialX + deltaX) * 2) / 2;
    let newY = Math.round((dragState.initialY + deltaY) * 2) / 2;

    // --- Intelligent Wall Snapping Logic ---
    if (dragState.type === 'room') {
        const SNAP_THRESHOLD = 1.0; // 1% range for magnetic snap
        const activeRoom = rooms.find(r => r.id === dragState.id);
        if (!activeRoom) return;
        const activeW = activeRoom.w;
        const activeH = activeRoom.h;

        // Iterate through other rooms to find snap candidates
        rooms.forEach(other => {
            if (other.id === dragState.id) return;

            // X-Axis Snapping
            // Snap Left edge to other's Left or Right
            if (Math.abs(newX - other.x) < SNAP_THRESHOLD) newX = other.x;
            else if (Math.abs(newX - (other.x + other.w)) < SNAP_THRESHOLD) newX = other.x + other.w;
            
            // Snap Right edge to other's Left or Right
            else if (Math.abs((newX + activeW) - other.x) < SNAP_THRESHOLD) newX = other.x - activeW;
            else if (Math.abs((newX + activeW) - (other.x + other.w)) < SNAP_THRESHOLD) newX = (other.x + other.w) - activeW;

            // Y-Axis Snapping
            // Snap Top edge to other's Top or Bottom
            if (Math.abs(newY - other.y) < SNAP_THRESHOLD) newY = other.y;
            else if (Math.abs(newY - (other.y + other.h)) < SNAP_THRESHOLD) newY = other.y + other.h;

            // Snap Bottom edge to other's Top or Bottom
            else if (Math.abs((newY + activeH) - other.y) < SNAP_THRESHOLD) newY = other.y - activeH;
            else if (Math.abs((newY + activeH) - (other.y + other.h)) < SNAP_THRESHOLD) newY = (other.y + other.h) - activeH;
        });

        setRooms(prev => prev.map(r => r.id === dragState.id ? { ...r, x: newX, y: newY } : r));
    } else {
        setDoors(prev => prev.map(d => d.id === dragState.id ? { ...d, x: newX, y: newY } : d));
    }
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  // --- CRUD Operations ---
  const addRoom = () => {
    const newId = `room_${Date.now()}`;
    const newRoom: Room = {
      id: newId,
      name: 'New Room',
      dimensions: '10\' x 10\'',
      details: 'Description here',
      x: 40, y: 40, w: 15, h: 15,
      type: 'bedroom',
      borders: { top: true, bottom: true, left: true, right: true }
    };
    setRooms([...rooms, newRoom]);
    setSelection({ type: 'room', id: newId });
  };

  const duplicateRoom = (roomId: string) => {
    const roomToCopy = rooms.find(r => r.id === roomId);
    if (!roomToCopy) return;

    const newId = `room_${Date.now()}`;
    const newRoom = {
        ...roomToCopy,
        id: newId,
        name: `${roomToCopy.name} (Copy)`,
        x: roomToCopy.x + 2,
        y: roomToCopy.y + 2
    };
    setRooms([...rooms, newRoom]);
    setSelection({ type: 'room', id: newId });
  };

  const addDoor = () => {
    const newId = `door_${Date.now()}`;
    const newDoor: Door = {
      id: newId,
      x: 50, y: 50,
      orientation: 'horizontal',
      swing: 'left'
    };
    setDoors([...doors, newDoor]);
    setSelection({ type: 'door', id: newId });
  };

  const deleteItem = () => {
    if (!selection) return;
    if (selection.type === 'room') {
      setRooms(rooms.filter(r => r.id !== selection.id));
    } else {
      setDoors(doors.filter(d => d.id !== selection.id));
    }
    setSelection(null);
  };

  const updateRoom = (id: string, field: keyof Room, value: any) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
  };
  
  const toggleWall = (roomId: string, wall: keyof Room['borders']) => {
    setRooms(rooms.map(r => {
      if (r.id === roomId) {
        return { ...r, borders: { ...r.borders, [wall]: !r.borders[wall] } };
      }
      return r;
    }));
  };

  const updateDoor = (id: string, field: keyof Door, value: any) => {
    setDoors(doors.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  // --- Export / Import Operations ---
  const downloadConfig = () => {
    const config = { 
        version: "1.0",
        timestamp: Date.now(),
        rooms, 
        doors 
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `floor_plan_config_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const triggerUpload = () => {
      fileInputRef.current?.click();
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target?.result as string);
        if (config.rooms && Array.isArray(config.rooms)) {
            setRooms(config.rooms);
            setSelection(null);
        }
        if (config.doors && Array.isArray(config.doors)) {
            setDoors(config.doors);
        }
      } catch (error) {
        alert("Error parsing JSON configuration file.");
        console.error("Invalid JSON", error);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again if needed
    e.target.value = ''; 
  };

  // Global mouse up
  useEffect(() => {
    if (dragState) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dragState]);

  // Derived state for selected item
  const selectedRoom = selection?.type === 'room' ? rooms.find(r => r.id === selection.id) : null;
  const selectedDoor = selection?.type === 'door' ? doors.find(d => d.id === selection.id) : null;

  return (
    <div className="min-h-screen bg-[#e8dfce] p-4 font-serif text-[#3d3124] flex flex-col items-center select-none">
      
      {/* Hidden File Input for Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        accept=".json" 
        className="hidden" 
      />

      {/* Header */}
      <header className="w-full max-w-7xl mb-4 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#f4ece0] p-4 rounded-lg shadow-sm border border-[#d4c5a9]">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Home className="w-6 h-6" />
            Floor Plan Architect
          </h1>
          <p className="text-[#8c7b66] text-xs uppercase tracking-widest">Interactive Editor Mode</p>
        </div>
        
        {/* Top Controls */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          <div className="flex gap-2 mr-2 pr-2 border-r border-[#d4c5a9]">
             <button 
                onClick={downloadConfig}
                className="flex items-center gap-1 px-3 py-2 text-xs bg-white text-[#5c4d3c] border border-[#d4c5a9] rounded hover:bg-[#5c4d3c] hover:text-white transition-colors"
                title="Save Layout to JSON"
             >
               <Download className="w-3 h-3" /> Export
             </button>
             <button 
                onClick={triggerUpload}
                className="flex items-center gap-1 px-3 py-2 text-xs bg-white text-[#5c4d3c] border border-[#d4c5a9] rounded hover:bg-[#5c4d3c] hover:text-white transition-colors"
                title="Load Layout from JSON"
             >
               <Upload className="w-3 h-3" /> Import
             </button>
          </div>

          <button 
            onClick={addDoor}
            className="flex items-center gap-2 px-3 py-2 bg-white text-[#5c4d3c] border border-[#5c4d3c] rounded shadow-sm hover:bg-[#f9f5eb] transition-colors"
          >
            <DoorOpen className="w-4 h-4" /> Add Door
          </button>
          <button 
            onClick={addRoom}
            className="flex items-center gap-2 px-3 py-2 bg-[#5c4d3c] text-[#f4ece0] rounded shadow hover:bg-[#4a3b2a] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Room
          </button>
          <button 
            onClick={() => setShowDimensions(!showDimensions)}
            className={`flex items-center gap-2 px-3 py-2 rounded border border-[#5c4d3c] transition-colors ${showDimensions ? 'bg-[#d4c5a9]' : 'bg-transparent'}`}
          >
            <Ruler className="w-4 h-4" />
            {showDimensions ? 'Hide Labels' : 'Labels'}
          </button>
        </div>
      </header>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 h-[80vh]">
        
        {/* Canvas Area */}
        <div 
          className="flex-grow relative bg-[#f9f5eb] rounded shadow-inner border-[6px] border-[#5c4d3c] overflow-hidden cursor-crosshair"
          ref={containerRef}
          onClick={() => setSelection(null)}
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
              <div
                key={room.id}
                onMouseDown={(e) => handleMouseDown(e, 'room', room.id)}
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
            ))}

            {/* Doors */}
            {doors.map((door) => (
              <div
                key={door.id}
                onMouseDown={(e) => handleMouseDown(e, 'door', door.id)}
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
            ))}
            
            {/* Courtyard Visual Helper */}
            <div className="absolute top-[38%] left-[43%] text-[#4a3b2a] opacity-10 font-bold text-4xl pointer-events-none z-0 rotate-45">
               COURTYARD
            </div>

        </div>

        {/* Editor Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-[#f4ece0] border-l-4 border-[#d4c5a9] lg:border-l-0 lg:border border-[#d4c5a9] shadow-xl flex flex-col">
          <div className="p-4 bg-[#5c4d3c] text-[#f4ece0] flex justify-between items-center">
            <h2 className="font-bold text-lg">
              {selectedRoom ? 'Room Properties' : selectedDoor ? 'Door Properties' : 'Editor'}
            </h2>
            {selection && (
              <div className="flex gap-2">
                 {selectedRoom && (
                   <button 
                      onClick={() => duplicateRoom(selectedRoom.id)}
                      className="text-[#f4ece0] hover:text-white p-1 rounded hover:bg-white/10"
                      title="Duplicate Room"
                   >
                     <Copy className="w-5 h-5" />
                   </button>
                 )}
                 <button 
                    onClick={deleteItem}
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
                    onChange={(e) => updateRoom(selectedRoom.id, 'name', e.target.value)}
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
                          onClick={() => toggleWall(selectedRoom.id, wall)}
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-1">Dimensions Label</label>
                  <input 
                    type="text" 
                    value={selectedRoom.dimensions}
                    onChange={(e) => updateRoom(selectedRoom.id, 'dimensions', e.target.value)}
                    className="w-full bg-white border border-[#d4c5a9] p-2 rounded text-[#4a3b2a] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#5c4d3c]"
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
                      onChange={(e) => updateRoom(selectedRoom.id, 'w', parseInt(e.target.value))}
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
                      onChange={(e) => updateRoom(selectedRoom.id, 'h', parseInt(e.target.value))}
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
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-2">Orientation</label>
                          <div className="flex gap-2">
                            <button
                               onClick={() => updateDoor(selectedDoor.id, 'orientation', 'horizontal')}
                               className={`flex-1 py-2 text-xs rounded border ${selectedDoor.orientation === 'horizontal' ? 'bg-[#5c4d3c] text-white' : 'bg-white text-[#5c4d3c]'}`}
                            >Horizontal</button>
                            <button
                               onClick={() => updateDoor(selectedDoor.id, 'orientation', 'vertical')}
                               className={`flex-1 py-2 text-xs rounded border ${selectedDoor.orientation === 'vertical' ? 'bg-[#5c4d3c] text-white' : 'bg-white text-[#5c4d3c]'}`}
                            >Vertical</button>
                          </div>
                       </div>

                       <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#8c7b66] mb-2">Swing Direction</label>
                          <div className="flex gap-2">
                            <button
                               onClick={() => updateDoor(selectedDoor.id, 'swing', 'left')}
                               className={`flex-1 py-2 text-xs rounded border ${selectedDoor.swing === 'left' ? 'bg-[#5c4d3c] text-white' : 'bg-white text-[#5c4d3c]'}`}
                            >Normal</button>
                            <button
                               onClick={() => updateDoor(selectedDoor.id, 'swing', 'right')}
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
      </div>
    </div>
  );
};

export default FloorPlanApp;