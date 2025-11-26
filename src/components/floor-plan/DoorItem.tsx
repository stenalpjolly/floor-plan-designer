import React, { MouseEvent } from 'react';
import { CANVAS_WIDTH_FT, CANVAS_HEIGHT_FT } from '@/utils/dimensions';
import { Door, Selection } from '@/types';

interface DoorItemProps {
  door: Door;
  selection: Selection | null;
  onMouseDown: (e: MouseEvent, type: 'room' | 'door', id: string) => void;
}

const DoorItem: React.FC<DoorItemProps> = ({ door, selection, onMouseDown }) => {
  // Standard door width (3 ft) relative to canvas dimensions
  // Double doors are wider (6 ft)
  const DOOR_WIDTH_FT = door.width ?? (door.type === 'double' ? 6 : 3);
  const WALL_THICKNESS_FT = 0.5; // Approx 6 inches

  // Calculate percentage dimensions
  const widthPercent = (DOOR_WIDTH_FT / CANVAS_WIDTH_FT) * 100;
  const depthPercent = (WALL_THICKNESS_FT / CANVAS_HEIGHT_FT) * 100;
  const depthPercentHorizontal = (WALL_THICKNESS_FT / CANVAS_WIDTH_FT) * 100; // When vertical, depth is width relative to canvas width

  // Dynamic scaling for SVG to preserve aspect ratio
  // We want the SVG to cover the full swing area.
  // The container represents the wall opening (approx 0.5ft thick).
  // The swing extends out by DOOR_WIDTH_FT.
  const scalingFactor = (DOOR_WIDTH_FT / WALL_THICKNESS_FT) * 100;
  
  // SVG Coordinate System: 0-100 represents the DOOR_WIDTH_FT
  // Wall Thickness in SVG units
  const wallThicknessSvg = (WALL_THICKNESS_FT / DOOR_WIDTH_FT) * 100;
  // Center of the SVG (50) corresponds to the center of the wall
  const center = 50;
  // Wall boundaries relative to center
  const wallStart = center - wallThicknessSvg / 2;
  const wallEnd = center + wallThicknessSvg / 2;

  const renderDoorVisuals = () => {
    const isHorizontal = door.orientation === 'horizontal';
    const transform = isHorizontal
      ? (door.swing === 'left' ? 'scaleY(-1)' : '')
      : (door.swing === 'left' ? 'scaleX(-1)' : '');

    if (door.type === 'open') {
        return null; // Just the opening
    }

    if (door.type === 'sliding') {
       return (
         <div className="absolute inset-0 overflow-visible flex items-center justify-center">
            <div className={`bg-[#fff] border border-[#4a3b2a] absolute
                ${isHorizontal
                    ? 'h-[60%] w-[50%] top-[20%] left-0'
                    : 'w-[60%] h-[50%] left-[20%] top-0'
                }
            `}></div>
             <div className={`bg-[#fff] border border-[#4a3b2a] absolute
                ${isHorizontal
                    ? 'h-[60%] w-[50%] top-[20%] right-0 translate-y-[30%]'
                    : 'w-[60%] h-[50%] left-[20%] bottom-0 translate-x-[30%]'
                }
            `}></div>
         </div>
       );
    }

    if (door.type === 'double') {
        // Double door logic: 100 units = 6ft. Leaf size = 50 units (3ft).
        const leafSize = 50;
        const leafThickness = 3;

        return (
            <div className="absolute inset-0 overflow-visible pointer-events-none flex items-center justify-center">
            {isHorizontal ? (
                <svg width="100%" height={`${scalingFactor}%`} viewBox="0 0 100 100" className="overflow-visible" style={{ transform }}>
                    {/* Left Leaf (Left Hinge) - Swing Up */}
                    {/* Arc from Closed(50, wallStart) to Open(0, wallStart-50) */}
                    <path d={`M50,${wallStart} A${leafSize},${leafSize} 0 0,0 0,${wallStart - leafSize}`} fill="none" stroke="#4a3b2a" strokeWidth="2" strokeDasharray="5,3" />
                    <rect x={0} y={wallStart - leafSize} width={leafThickness} height={leafSize} fill="#fff" stroke="#4a3b2a" strokeWidth="2" />
                    
                    {/* Right Leaf (Right Hinge) - Swing Up */}
                    {/* Arc from Closed(50, wallStart) to Open(100, wallStart-50) */}
                    <path d={`M50,${wallStart} A${leafSize},${leafSize} 0 0,1 100,${wallStart - leafSize}`} fill="none" stroke="#4a3b2a" strokeWidth="2" strokeDasharray="5,3" />
                    <rect x={100 - leafThickness} y={wallStart - leafSize} width={leafThickness} height={leafSize} fill="#fff" stroke="#4a3b2a" strokeWidth="2" />
                </svg>
            ) : (
                <svg width={`${scalingFactor}%`} height="100%" viewBox="0 0 100 100" className="overflow-visible" style={{ transform }}>
                    {/* Top Leaf (Top Hinge) - Swing Right */}
                    {/* Arc from Closed(wallEnd, 50) to Open(wallEnd+50, 0) */}
                    <path d={`M${wallEnd},50 A${leafSize},${leafSize} 0 0,0 ${wallEnd + leafSize},0`} fill="none" stroke="#4a3b2a" strokeWidth="2" strokeDasharray="5,3" />
                    <rect x={wallEnd} y={0} width={leafSize} height={leafThickness} fill="#fff" stroke="#4a3b2a" strokeWidth="2" />

                    {/* Bottom Leaf (Bottom Hinge) - Swing Right */}
                    {/* Arc from Closed(wallEnd, 50) to Open(wallEnd+50, 100) */}
                    <path d={`M${wallEnd},50 A${leafSize},${leafSize} 0 0,1 ${wallEnd + leafSize},100`} fill="none" stroke="#4a3b2a" strokeWidth="2" strokeDasharray="5,3" />
                    <rect x={wallEnd} y={100 - leafThickness} width={leafSize} height={leafThickness} fill="#fff" stroke="#4a3b2a" strokeWidth="2" />
                </svg>
            )}
            </div>
        );
    }

    // Standard Door (Single)
    // 100 units = 3ft. Leaf size = 100 units.
    const leafSize = 100;
    const leafThickness = 5;

    return (
        <div className="absolute inset-0 overflow-visible pointer-events-none flex items-center justify-center">
            {isHorizontal ? (
                <svg width="100%" height={`${scalingFactor}%`} viewBox="0 0 100 100" className="overflow-visible" style={{ transform }}>
                    {/* Hinge Right, Swing Up */}
                    {/* Arc from Closed(0, wallStart) to Open(100, wallStart-100) */}
                    <path d={`M0,${wallStart} A${leafSize},${leafSize} 0 0,1 100,${wallStart - leafSize}`} fill="none" stroke="#4a3b2a" strokeWidth="2" strokeDasharray="5,3" />
                    <rect x={100 - leafThickness} y={wallStart - leafSize} width={leafThickness} height={leafSize} fill="#fff" stroke="#4a3b2a" strokeWidth="2" />
                </svg>
            ) : (
                <svg width={`${scalingFactor}%`} height="100%" viewBox="0 0 100 100" className="overflow-visible" style={{ transform }}>
                    {/* Hinge Bottom, Swing Right */}
                    {/* Arc from Closed(wallEnd, 0) to Open(wallEnd+100, 100) */}
                    <path d={`M${wallEnd},0 A${leafSize},${leafSize} 0 0,1 ${wallEnd + leafSize},100`} fill="none" stroke="#4a3b2a" strokeWidth="2" strokeDasharray="5,3" />
                    <rect x={wallEnd} y={100 - leafThickness} width={leafSize} height={leafThickness} fill="#fff" stroke="#4a3b2a" strokeWidth="2" />
                </svg>
            )}
        </div>
    );
  };

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, 'door', door.id)}
      onClick={(e) => e.stopPropagation()}
      className={`absolute z-20 cursor-move flex items-center justify-center
        ${selection?.id === door.id ? 'shadow-[0_0_0_2px_#3b82f6]' : ''}
      `}
      style={{
        left: `${door.x}%`,
        top: `${door.y}%`,
        width: door.orientation === 'horizontal' ? `${widthPercent}%` : `${depthPercentHorizontal}%`,
        height: door.orientation === 'horizontal' ? `${depthPercent}%` : `${widthPercent * (CANVAS_WIDTH_FT / CANVAS_HEIGHT_FT)}%`, // Adjust height for aspect ratio
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Background to cut the wall - using floor color */}
      <div className={`absolute inset-0 bg-[#f4ece0]
        ${door.orientation === 'horizontal' ? 'border-l-2 border-r-2' : 'border-t-2 border-b-2'}
        border-[#5c4d3c]`}
      ></div>
      
      {renderDoorVisuals()}
    </div>
  );
};

export default DoorItem;