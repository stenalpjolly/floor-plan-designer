'use client';

import React, { useState, useRef, useEffect, MouseEvent, ChangeEvent } from 'react';
import { Room, Door, Selection, DragState } from '@/types';
import Toolbar from './floor-plan/Toolbar';
import Canvas from './floor-plan/Canvas';
import Sidebar from './floor-plan/Sidebar';
import PromptModal from './floor-plan/PromptModal';
import { generateFloorPlan } from '@/app/actions/generate-plan';
import { calculateDimensions } from '@/utils/dimensions';

const FloorPlanApp = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<Selection | null>(null); // { type: 'room' | 'door', id: string }
  const [showDimensions, setShowDimensions] = useState(true);
  const [dragState, setDragState] = useState<DragState | null>(null); // { type, id, startX, startY, initialX, initialY }
  const [isGenerating, setIsGenerating] = useState(false);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [doors, setDoors] = useState<Door[]>([]);

  const handleGeneratePlan = async (prompt: string) => {
    try {
      setIsGenerating(true);
      const plan = await generateFloorPlan(prompt);
      // Sanitize Generated Plans: Re-calculate dimensions for all rooms
      const sanitizedRooms = plan.rooms.map(room => ({
        ...room,
        dimensions: calculateDimensions(room.w, room.h)
      }));
      setRooms(sanitizedRooms);
      setDoors(plan.doors);
    } catch (error) {
      console.error("Failed to generate floor plan:", error);
      alert("Failed to generate floor plan. Please try again.");
    } finally {
      setIsGenerating(false);
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
      dimensions: calculateDimensions(15, 15),
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
    setRooms(rooms.map(r => {
      if (r.id === id) {
        const updatedRoom = { ...r, [field]: value };
        // Auto-update dimensions if w or h changes
        if (field === 'w' || field === 'h') {
          updatedRoom.dimensions = calculateDimensions(updatedRoom.w, updatedRoom.h);
        }
        return updatedRoom;
      }
      return r;
    }));
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
  const selectedRoom = selection?.type === 'room' ? rooms.find(r => r.id === selection.id) || null : null;
  const selectedDoor = selection?.type === 'door' ? doors.find(d => d.id === selection.id) || null : null;

  return (
    <div className="min-h-screen bg-[#e8dfce] p-4 font-serif text-[#3d3124] flex flex-col items-center select-none">
      
      <PromptModal
        isOpen={rooms.length === 0}
        onGenerate={handleGeneratePlan}
        isLoading={isGenerating}
      />

      <Toolbar
        showDimensions={showDimensions}
        setShowDimensions={setShowDimensions}
        onExport={downloadConfig}
        onImport={handleUpload}
        onAddDoor={addDoor}
        onAddRoom={addRoom}
      />

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 h-[80vh]">
        
        <Canvas 
           containerRef={containerRef}
           rooms={rooms}
           doors={doors}
           selection={selection}
           dragState={dragState}
           showDimensions={showDimensions}
           onMouseDown={handleMouseDown}
           onSelectionClear={() => setSelection(null)}
        />

        <Sidebar 
          selection={selection}
          selectedRoom={selectedRoom}
          selectedDoor={selectedDoor}
          onDuplicateRoom={duplicateRoom}
          onDeleteItem={deleteItem}
          onUpdateRoom={updateRoom}
          onToggleWall={toggleWall}
          onUpdateDoor={updateDoor}
        />
      </div>
    </div>
  );
};

export default FloorPlanApp;