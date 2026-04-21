import { TrackDirection } from '../types/trackMap';

/**
 * Calculates a point on an SVG path based on lap distance percentage and track direction.
 * 
 * @param lapDistancePercent - Lap distance as percentage (0-1)
 * @param svgPath - SVG path element to measure
 * @param direction - Track direction (clockwise or anticlockwise)
 * @param startFinishLength - Length offset of the start/finish line on the path
 * @returns Position object with x and y coordinates
 */
export function calculateCarPositionOnTrack(
  lapDistancePercent: number,
  svgPath: SVGPathElement,
  direction: TrackDirection,
  startFinishLength: number,
): { x: number; y: number } {
  const totalLength = svgPath.getTotalLength() || 0;
  if (totalLength === 0) {
    return { x: 0, y: 0 };
  }

  const adjustedLength = (totalLength * lapDistancePercent) % totalLength;
  
  // Calculate the actual path length based on direction
  // Clockwise (normal): Move forward from start/finish
  // Anticlockwise: Move backward from start/finish
  const length =
    direction !== TrackDirection.ANTICLOCKWISE
      ? (startFinishLength + adjustedLength) % totalLength
      : (startFinishLength - adjustedLength + totalLength) % totalLength;

  const point = svgPath.getPointAtLength(length);
  return { x: point?.x || 0, y: point?.y || 0 };
}

/**
 * Validates that a direction value is a valid TrackDirection.
 * Returns a default if invalid.
 */
export function getValidTrackDirection(
  direction: unknown,
  defaultDirection: TrackDirection = TrackDirection.CLOCKWISE,
): TrackDirection {
  if (
    direction === TrackDirection.CLOCKWISE ||
    direction === TrackDirection.ANTICLOCKWISE
  ) {
    return direction as TrackDirection;
  }
  return defaultDirection;
}
