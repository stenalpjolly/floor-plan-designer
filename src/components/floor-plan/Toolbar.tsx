import React, { ChangeEvent, useRef } from 'react';
import { Home, Download, Upload, DoorOpen, Plus, Ruler, Undo, Redo, Box, Image as ImageIcon, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface ToolbarProps {
  showDimensions: boolean;
  setShowDimensions: (show: boolean) => void;
  onExport: () => void;
  onImport: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddDoor: () => void;
  onAddRoom: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onGenerate3D: () => void;
  onDownloadImage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  scale: number;
}

const Toolbar: React.FC<ToolbarProps> = ({
  showDimensions,
  setShowDimensions,
  onExport,
  onImport,
  onAddDoor,
  onAddRoom,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onGenerate3D,
  onDownloadImage,
  onZoomIn,
  onZoomOut,
  onResetView,
  scale,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onImport} 
        accept=".json" 
        className="hidden" 
      />
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
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 text-[#5c4d3c] hover:bg-[#d4c5a9] disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 text-[#5c4d3c] hover:bg-[#d4c5a9] disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 mr-2 pr-2 border-r border-[#d4c5a9]">
            <button
              onClick={onZoomOut}
              className="p-2 text-[#5c4d3c] hover:bg-[#d4c5a9] rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="flex items-center text-xs font-mono text-[#5c4d3c] min-w-[3rem] justify-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={onZoomIn}
              className="p-2 text-[#5c4d3c] hover:bg-[#d4c5a9] rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={onResetView}
              className="p-2 text-[#5c4d3c] hover:bg-[#d4c5a9] rounded transition-colors"
              title="Reset View"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 mr-2 pr-2 border-r border-[#d4c5a9]">
             <button
                onClick={onDownloadImage}
                className="flex items-center gap-1 px-3 py-2 text-xs bg-white text-[#5c4d3c] border border-[#d4c5a9] rounded hover:bg-[#5c4d3c] hover:text-white transition-colors"
                title="Download as Image"
             >
               <ImageIcon className="w-3 h-3" /> Image
             </button>
             <button
                onClick={onExport}
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
            onClick={onGenerate3D}
            className="flex items-center gap-2 px-3 py-2 bg-[#5c4d3c] text-[#f4ece0] border border-[#5c4d3c] rounded shadow-sm hover:bg-[#4a3b2a] transition-colors font-bold"
            title="Generate 3D Isometric View"
          >
            <Box className="w-4 h-4" /> 3D View
          </button>

          <button
            onClick={onAddDoor}
            className="flex items-center gap-2 px-3 py-2 bg-white text-[#5c4d3c] border border-[#5c4d3c] rounded shadow-sm hover:bg-[#f9f5eb] transition-colors"
          >
            <DoorOpen className="w-4 h-4" /> Add Door
          </button>
          <button 
            onClick={onAddRoom}
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
    </>
  );
};

export default Toolbar;