import React, { ChangeEvent, useRef } from 'react';
import { Home, Download, Upload, DoorOpen, Plus, Ruler } from 'lucide-react';

interface ToolbarProps {
  showDimensions: boolean;
  setShowDimensions: (show: boolean) => void;
  onExport: () => void;
  onImport: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddDoor: () => void;
  onAddRoom: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  showDimensions,
  setShowDimensions,
  onExport,
  onImport,
  onAddDoor,
  onAddRoom,
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