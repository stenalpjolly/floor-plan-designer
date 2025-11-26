export const CANVAS_WIDTH_FT = 60;
export const CANVAS_HEIGHT_FT = 40;

/**
 * Calculates the dimensions string based on percentage width and height relative to the canvas scale.
 * @param widthPercent Width in percentage (0-100)
 * @param heightPercent Height in percentage (0-100)
 * @returns Formatted dimension string (e.g., "12.5' x 10'")
 */
export const calculateDimensions = (widthPercent: number, heightPercent: number): string => {
  const widthFt = (widthPercent / 100) * CANVAS_WIDTH_FT;
  const heightFt = (heightPercent / 100) * CANVAS_HEIGHT_FT;

  // Remove trailing zeros using parseFloat
  const w = parseFloat(widthFt.toFixed(1));
  const h = parseFloat(heightFt.toFixed(1));

  return `${w}' x ${h}'`;
};