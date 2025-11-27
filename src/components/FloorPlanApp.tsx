'use client';

import React, { useState, useRef, useEffect, MouseEvent, ChangeEvent, WheelEvent } from 'react';
import { Room, Door, Furniture, Selection, DragState } from '@/types';
import { useHistory } from '@/hooks/useHistory';
import Toolbar from './floor-plan/Toolbar';
import Canvas from './floor-plan/Canvas';
import Sidebar from './floor-plan/Sidebar';
import PromptModal from './floor-plan/PromptModal';
import ThreeDModal from './floor-plan/ThreeDModal';
import html2canvas from 'html2canvas';
import { generateFloorPlan } from '@/app/actions/generate-plan';
import { generate3DView } from '@/app/actions/generate-3d-view';
import { buildFloorPlanPrompt } from '@/utils/prompt-builder';
import { calculateDimensions, calculateArea } from '@/utils/dimensions';
import { INTERIOR_ELEMENTS } from '@/data/interior-elements';

const FloorPlanApp = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [appMode, setAppMode] = useState<'structure' | 'interior'>('structure');
  const [selection, setSelection] = useState<Selection | null>(null); // { type: 'room' | 'door' | 'furniture', id: string }
  const [showDimensions, setShowDimensions] = useState(true);
  const [dragState, setDragState] = useState<DragState | null>(null); // { type, id, startX, startY, initialX, initialY }
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(true);
  
  // View State for Zoom/Pan
  const [viewState, setViewState] = useState({ scale: 1, panX: 0, panY: 0 });

  // 3D Generation State
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [isGenerating3D, setIsGenerating3D] = useState(false);
  const [generated3DImage, setGenerated3DImage] = useState<string | null>(null);
  const [generationError3D, setGenerationError3D] = useState<string | null>(null);

  const {
    state: floorPlan,
    setState,
    updateStateWithoutHistory,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory<{ rooms: Room[], doors: Door[], furniture: Furniture[] }>({ rooms: [], doors: [], furniture: [] });
  
  const { rooms, doors, furniture } = floorPlan;
  
  const [clipboard, setClipboard] = useState<{ type: 'room' | 'door' | 'furniture', data: Room | Door | Furniture } | null>(null);

  const handleGeneratePlan = async (prompt: string) => {
    if (process.env.NEXT_PUBLIC_ENABLE_AI !== 'true') {
      alert("AI features are disabled in this static demo. To use AI generation, please clone the repository and run it locally or deploy to a platform supporting Next.js Server Actions (like Vercel or Cloud Run).");
      return;
    }

    try {
      setIsGenerating(true);
      const plan = await generateFloorPlan(prompt);
      // Sanitize Generated Plans: Re-calculate dimensions for all rooms
      const sanitizedRooms = plan.rooms.map(room => ({
        ...room,
        dimensions: calculateDimensions(room.w, room.h)
      }));
      
      setState({
        rooms: sanitizedRooms,
        doors: plan.doors.map(door => ({ ...door, type: 'standard' })),
        furniture: []
      });
      
      setIsPromptModalOpen(false);
    } catch (error) {
      console.error("Failed to generate floor plan:", error);
      alert("Failed to generate floor plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate3D = async () => {
      if (process.env.NEXT_PUBLIC_ENABLE_AI !== 'true') {
        alert("AI features are disabled in this static demo. To use AI generation, please clone the repository and run it locally or deploy to a platform supporting Next.js Server Actions (like Vercel or Cloud Run).");
        return;
      }

      setIs3DModalOpen(true);
      setIsGenerating3D(true);
      setGenerated3DImage(null);
      setGenerationError3D(null);

      try {
          let imageBase64 = undefined;
          
          // Capture Canvas Screenshot
          if (containerRef.current) {
            try {
                const canvas = await html2canvas(containerRef.current, {
                    backgroundColor: '#e8dfce', // Match background
                    scale: 1, // Don't make it too huge
                });
                imageBase64 = canvas.toDataURL('image/png').split(',')[1];
            } catch (e) {
                console.warn("Failed to capture canvas screenshot:", e);
            }
          }

          const contextPrompt = buildFloorPlanPrompt(rooms, doors);
          // Pass both text context AND image (although backend currently prioritizes text for Imagen 3)
          const result = await generate3DView(contextPrompt, imageBase64);
          
          if (result.image) {
              setGenerated3DImage(result.image);
          } else if (result.error) {
              setGenerationError3D(result.error);
          }
      } catch (err) {
          setGenerationError3D("An unexpected error occurred.");
      } finally {
          setIsGenerating3D(false);
      }
  };

  // --- Zoom / Pan Handlers ---
  const handleZoomIn = () => {
    setViewState(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 5) }));
  };

  const handleZoomOut = () => {
    setViewState(prev => ({ ...prev, scale: Math.max(prev.scale / 1.2, 0.1) }));
  };

  const handleResetView = () => {
    setViewState({ scale: 1, panX: 0, panY: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setViewState(prev => ({
        ...prev,
        scale: Math.min(Math.max(prev.scale * scaleFactor, 0.1), 5)
      }));
    } else {
        // Optional: Panning with wheel? Standard is vertical scroll usually.
        // For now, let's support Zoom with Wheel (without Ctrl sometimes preferred in design tools, but standard web is Ctrl+Wheel)
        // Design tools usually: Wheel = Pan Vertical, Shift+Wheel = Pan Horizontal, Ctrl+Wheel = Zoom.
        // Let's stick to Ctrl+Wheel for Zoom.
        // Or, implement simple Zoom on Wheel without modifier if we preventDefault?
        // Given user instructions "zoon and pan", often implies easy zooming.
        // Let's try Zoom on Wheel always for this "Canvas" area.
        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
        setViewState(prev => ({
            ...prev,
            scale: Math.min(Math.max(prev.scale * scaleFactor, 0.1), 5)
        }));
    }
  };

  // --- Dragging Logic ---
  const handleMouseDown = (e: MouseEvent, type: 'room' | 'door' | 'canvas' | 'furniture', id: string) => {
    e.stopPropagation(); // Prevent bubbling

    // If panning (canvas click), we don't set selection to 'canvas', we just track drag
    if (type !== 'canvas') {
        // Prevent selecting wrong items based on mode
        if (appMode === 'structure' && type === 'furniture') return;
        if (appMode === 'interior' && (type === 'room' || type === 'door')) return;

        setSelection({ type: type as 'room' | 'door' | 'furniture', id });
    }

    if (!containerRef.current) return;

    if (type === 'canvas') {
        setDragState({
            type: 'canvas',
            id: 'canvas',
            startX: e.clientX,
            startY: e.clientY,
            initialX: viewState.panX,
            initialY: viewState.panY
        });
        return;
    }

    let item;
    if (type === 'room') item = rooms.find(r => r.id === id);
    else if (type === 'door') item = doors.find(d => d.id === id);
    else if (type === 'furniture') item = furniture.find(f => f.id === id);

    if (!item) return;

    const rect = containerRef.current.getBoundingClientRect();
    // Calculate mouse position in "Canvas Percentage Coordinates"
    // x% = ((ScreenX - RectLeft - PanX) / (RectWidth * Scale)) * 100
    const mouseXPercent = ((e.clientX - rect.left - viewState.panX) / (rect.width * viewState.scale)) * 100;
    const mouseYPercent = ((e.clientY - rect.top - viewState.panY) / (rect.width * viewState.scale)) * 100;

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

    // --- Panning Logic ---
    if (dragState.type === 'canvas') {
        const deltaX = e.clientX - dragState.startX;
        const deltaY = e.clientY - dragState.startY;
        
        setViewState(prev => ({
            ...prev,
            panX: dragState.initialX + deltaX,
            panY: dragState.initialY + deltaY
        }));
        return;
    }

    // --- Item Dragging Logic ---
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate current mouse position in "Canvas Percentage Coordinates"
    const currentMouseXPercent = ((e.clientX - rect.left - viewState.panX) / (rect.width * viewState.scale)) * 100;
    const currentMouseYPercent = ((e.clientY - rect.top - viewState.panY) / (rect.width * viewState.scale)) * 100;

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

        updateStateWithoutHistory(prev => ({
            ...prev,
            rooms: prev.rooms.map(r => r.id === dragState.id ? { ...r, x: newX, y: newY } : r)
        }));
    } else if (dragState.type === 'door') {
        updateStateWithoutHistory(prev => ({
            ...prev,
            doors: prev.doors.map(d => d.id === dragState.id ? { ...d, x: newX, y: newY } : d)
        }));
    } else if (dragState.type === 'furniture') {
         updateStateWithoutHistory(prev => ({
            ...prev,
            furniture: prev.furniture.map(f => f.id === dragState.id ? { ...f, x: newX, y: newY } : f)
        }));
    }
  };

  const handleMouseUp = () => {
    if (dragState) {
        // Commit the changes made during drag (only if not panning)
        if (dragState.type !== 'canvas') {
            setState(prev => prev);
        }
    }
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
    setState(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
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
    setState(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
    setSelection({ type: 'room', id: newId });
  };

  const duplicateRoomDirectional = (roomId: string, direction: 'top' | 'bottom' | 'left' | 'right') => {
    const roomToCopy = rooms.find(r => r.id === roomId);
    if (!roomToCopy) return;

    let newX = roomToCopy.x;
    let newY = roomToCopy.y;

    switch (direction) {
        case 'top': newY -= roomToCopy.h; break;
        case 'bottom': newY += roomToCopy.h; break;
        case 'left': newX -= roomToCopy.w; break;
        case 'right': newX += roomToCopy.w; break;
    }

    const newId = `room_${Date.now()}`;
    const newRoom = {
        ...roomToCopy,
        id: newId,
        name: `${roomToCopy.name} (Copy)`,
        x: newX,
        y: newY
    };
    setState(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
    setSelection({ type: 'room', id: newId });
  };

  const addDoor = () => {
    const newId = `door_${Date.now()}`;
    const newDoor: Door = {
      id: newId,
      x: 50, y: 50,
      orientation: 'horizontal',
      swing: 'left',
      type: 'standard'
    };
    setState(prev => ({ ...prev, doors: [...prev.doors, newDoor] }));
    setSelection({ type: 'door', id: newId });
  };

  const deleteItem = () => {
    if (!selection) return;
    if (selection.type === 'room') {
      setState(prev => ({ ...prev, rooms: prev.rooms.filter(r => r.id !== selection.id) }));
    } else if (selection.type === 'door') {
      setState(prev => ({ ...prev, doors: prev.doors.filter(d => d.id !== selection.id) }));
    } else if (selection.type === 'furniture') {
      setState(prev => ({ ...prev, furniture: prev.furniture.filter(f => f.id !== selection.id) }));
    }
    setSelection(null);
  };

  const updateRoom = (id: string, field: keyof Room, value: any) => {
    setState(prev => ({
        ...prev,
        rooms: prev.rooms.map(r => {
            if (r.id === id) {
              const updatedRoom = { ...r, [field]: value };
              // Auto-update dimensions if w or h changes
              if (field === 'w' || field === 'h') {
                updatedRoom.dimensions = calculateDimensions(updatedRoom.w, updatedRoom.h);
              }
              return updatedRoom;
            }
            return r;
        })
    }));
  };

  const updateRoomType = (roomId: string, type: string, name: string) => {
    setState(prev => ({
        ...prev,
        rooms: prev.rooms.map(r => r.id === roomId ? { ...r, type, name } : r)
    }));
  };
  
  const toggleWall = (roomId: string, wall: keyof Room['borders']) => {
    setState(prev => ({
        ...prev,
        rooms: prev.rooms.map(r => {
            if (r.id === roomId) {
              return { ...r, borders: { ...r.borders, [wall]: !r.borders[wall] } };
            }
            return r;
        })
    }));
  };

  const updateDoor = (id: string, field: keyof Door, value: any) => {
    setState(prev => ({
        ...prev,
        doors: prev.doors.map(d => d.id === id ? { ...d, [field]: value } : d)
    }));
  };

  // --- Export / Import Operations ---
  const downloadConfig = () => {
    const config = {
        version: "1.0",
        timestamp: Date.now(),
        rooms,
        doors,
        furniture
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
        const newRooms = (config.rooms && Array.isArray(config.rooms)) ? config.rooms : rooms;
        const newDoors = (config.doors && Array.isArray(config.doors)) ? config.doors : doors;
        const newFurniture = (config.furniture && Array.isArray(config.furniture)) ? config.furniture : furniture;
        
        if (config.rooms || config.doors || config.furniture) {
            setState({ rooms: newRooms, doors: newDoors, furniture: newFurniture });
            setSelection(null);
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

  const handleDownloadImage = async () => {
    if (containerRef.current) {
      try {
        const canvas = await html2canvas(containerRef.current, {
            backgroundColor: '#e8dfce',
            scale: 2, // Higher resolution for download
        });
        const link = document.createElement('a');
        link.download = `floor-plan-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (e) {
          console.error("Failed to download image:", e);
          alert("Failed to generate image. Please try again.");
      }
    }
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
  }, [dragState, viewState]); // Added viewState dependency for accurate dragging calculations

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selection) {
          deleteItem();
        }
      }

      // Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selection) {
          let item;
          if (selection.type === 'room') item = rooms.find(r => r.id === selection.id);
          else if (selection.type === 'door') item = doors.find(d => d.id === selection.id);
          else if (selection.type === 'furniture') item = furniture.find(f => f.id === selection.id);
          
          if (item) {
            setClipboard({ type: selection.type, data: item });
          }
        }
      }

      // Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (clipboard) {
          if (clipboard.type === 'room') {
            const roomData = clipboard.data as Room;
            const newId = `room_${Date.now()}`;
            const newRoom = {
              ...roomData,
              id: newId,
              name: `${roomData.name} (Copy)`,
              x: roomData.x + 2,
              y: roomData.y + 2
            };
            setState(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
            setSelection({ type: 'room', id: newId });
          } else if (clipboard.type === 'door') {
            const doorData = clipboard.data as Door;
            const newId = `door_${Date.now()}`;
            const newDoor = {
              ...doorData,
              id: newId,
              x: doorData.x + 2,
              y: doorData.y + 2
            };
            setState(prev => ({ ...prev, doors: [...prev.doors, newDoor] }));
            setSelection({ type: 'door', id: newId });
          } else if (clipboard.type === 'furniture') {
             const furnitureData = clipboard.data as Furniture;
             const newId = `furniture_${Date.now()}`;
             const newFurniture = {
                 ...furnitureData,
                 id: newId,
                 x: furnitureData.x + 2,
                 y: furnitureData.y + 2
             };
             setState(prev => ({ ...prev, furniture: [...prev.furniture, newFurniture] }));
             setSelection({ type: 'furniture', id: newId });
          }
        }
      }

      // Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, clipboard, rooms, doors, undo, redo]);

  // Derived state for selected item
  const selectedRoom = selection?.type === 'room' ? rooms.find(r => r.id === selection.id) || null : null;
  const selectedDoor = selection?.type === 'door' ? doors.find(d => d.id === selection.id) || null : null;
  const selectedFurniture = selection?.type === 'furniture' ? furniture.find(f => f.id === selection.id) || null : null;

  const totalArea = rooms.reduce((acc, room) => acc + calculateArea(room.w, room.h), 0);

  const addFurniture = (type: string) => {
      const newId = `furniture_${Date.now()}`;
      // Default dimensions based on type (approximate feet)
      let width = 3;
      let depth = 2;
      
      const interiorElement = INTERIOR_ELEMENTS.find(item => item.type === type);
      
      if (interiorElement) {
          width = interiorElement.defaultWidth;
          depth = interiorElement.defaultDepth;
      } else if (type.includes('bed_queen')) { width = 5; depth = 6.5; }
      else if (type.includes('bed_single')) { width = 3.5; depth = 6.5; }
      else if (type.includes('sofa_3')) { width = 7; depth = 3; }
      else if (type.includes('sofa_2')) { width = 5; depth = 3; }
      else if (type.includes('table_dining')) { width = 6; depth = 3.5; }
      else if (type.includes('table_round')) { width = 4; depth = 4; }
      else if (type.includes('desk')) { width = 4; depth = 2; }
      else if (type.includes('wardrobe')) { width = 4; depth = 2; }
      else if (type.includes('tv_unit')) { width = 5; depth = 1.5; }
      else if (type.includes('toilet')) { width = 1.5; depth = 2.5; }
      else if (type.includes('sink')) { width = 2; depth = 1.5; }
      else if (type.includes('shower')) { width = 3; depth = 3; }
      else if (type.includes('plant')) { width = 1.5; depth = 1.5; }

      const newFurniture: Furniture = {
          id: newId,
          type,
          x: 50,
          y: 50,
          rotation: 0,
          width,
          depth
      };
      setState(prev => ({ ...prev, furniture: [...prev.furniture, newFurniture] }));
      setSelection({ type: 'furniture', id: newId });
  };

  const updateFurniture = (id: string, field: keyof Furniture, value: any) => {
      setState(prev => ({
          ...prev,
          furniture: prev.furniture.map(f => f.id === id ? { ...f, [field]: value } : f)
      }));
  };

  return (
    <div className="h-screen bg-[#e8dfce] font-serif text-[#3d3124] flex flex-col select-none w-full overflow-hidden">
      
      <PromptModal
        isOpen={rooms.length === 0 && isPromptModalOpen}
        onGenerate={handleGeneratePlan}
        onClose={() => setIsPromptModalOpen(false)}
        isLoading={isGenerating}
      />

      <ThreeDModal
        isOpen={is3DModalOpen}
        isLoading={isGenerating3D}
        imageUrl={generated3DImage}
        error={generationError3D}
        onClose={() => setIs3DModalOpen(false)}
      />

      <Toolbar
        showDimensions={showDimensions}
        setShowDimensions={setShowDimensions}
        onExport={downloadConfig}
        onImport={handleUpload}
        onGenerate3D={handleGenerate3D}
        onDownloadImage={handleDownloadImage}
        onAddDoor={addDoor}
        onAddRoom={addRoom}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        scale={viewState.scale}
        totalArea={totalArea}
        appMode={appMode}
        setAppMode={setAppMode}
      />

      <div className="flex-grow w-full flex flex-col lg:flex-row overflow-hidden">
        
        <Canvas
           containerRef={containerRef}
           rooms={rooms}
           doors={doors}
           furniture={furniture}
           selection={selection}
           dragState={dragState}
           showDimensions={showDimensions}
           viewState={viewState}
           appMode={appMode}
           onMouseDown={handleMouseDown}
           onSelectionClear={() => setSelection(null)}
           onUpdateRoomType={updateRoomType}
           onWheel={handleWheel}
        />

        <Sidebar
          appMode={appMode}
          selection={selection}
          selectedRoom={selectedRoom}
          selectedDoor={selectedDoor}
          selectedFurniture={selectedFurniture}
          onDuplicateRoom={duplicateRoom}
          onDeleteItem={deleteItem}
          onUpdateRoom={updateRoom}
          onToggleWall={toggleWall}
          onUpdateDoor={updateDoor}
          onDuplicateRoomDirectional={duplicateRoomDirectional}
          onAddFurniture={addFurniture}
          onUpdateFurniture={updateFurniture}
        />
      </div>
    </div>
  );
};

export default FloorPlanApp;