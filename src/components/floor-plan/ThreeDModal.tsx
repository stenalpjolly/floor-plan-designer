import React from 'react';
import { X, Download, Loader2, Image as ImageIcon } from 'lucide-react';

interface ThreeDModalProps {
  isOpen: boolean;
  isLoading: boolean;
  imageUrl: string | null;
  error: string | null;
  onClose: () => void;
}

const ThreeDModal: React.FC<ThreeDModalProps> = ({
  isOpen,
  isLoading,
  imageUrl,
  error,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageUrl}`;
    link.download = `isometric-view-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#f4ece0] w-full max-w-4xl rounded-lg shadow-2xl border border-[#d4c5a9] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#d4c5a9] bg-[#e8dfce] rounded-t-lg">
          <h2 className="text-xl font-bold text-[#5c4d3c] flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            3D Isometric View
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#d4c5a9]/50 rounded-full transition-colors text-[#5c4d3c]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex items-center justify-center bg-[#3d3124] overflow-hidden relative min-h-[400px]">
          
          {isLoading && (
            <div className="flex flex-col items-center text-[#f4ece0] animate-pulse">
              <Loader2 className="w-12 h-12 mb-4 animate-spin" />
              <p className="text-lg font-medium">Generating 3D Visualization...</p>
              <p className="text-sm opacity-70 mt-2">This uses advanced AI and may take 10-20 seconds.</p>
            </div>
          )}

          {!isLoading && error && (
             <div className="text-center text-red-300 max-w-md p-6 bg-white/5 rounded border border-red-500/30">
                <p className="font-bold mb-2">Generation Failed</p>
                <p className="text-sm">{error}</p>
             </div>
          )}

          {!isLoading && !error && imageUrl && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={`data:image/png;base64,${imageUrl}`} 
                alt="Generated 3D Isometric View" 
                className="max-w-full max-h-full object-contain shadow-2xl rounded"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#d4c5a9] bg-[#f4ece0] flex justify-end gap-3 rounded-b-lg">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#5c4d3c] hover:bg-[#e8dfce] rounded transition-colors font-medium"
            >
              Close
            </button>
            
            {!isLoading && imageUrl && (
                <button
                onClick={handleDownload}
                className="px-4 py-2 bg-[#5c4d3c] text-white rounded hover:bg-[#4a3b2a] transition-colors font-bold flex items-center gap-2"
                >
                <Download className="w-4 h-4" />
                Download Image
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ThreeDModal;