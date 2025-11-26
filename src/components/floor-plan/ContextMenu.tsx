import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  options: { label: string; action: () => void }[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, options }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[150px]"
      style={{ left: x, top: y }}
    >
      {options.map((option, index) => (
        <button
          key={index}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          onClick={() => {
            option.action();
            onClose();
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;