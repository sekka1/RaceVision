/**
 * @jest-environment node
 */
import {
  calculateCarPositionOnTrack,
  getValidTrackDirection,
} from '../trackPositionCalculator';
import { TrackDirection } from '../../types/trackMap';

// Mock SVGPathElement
class MockSVGPathElement {
  getTotalLength: jest.Mock;

  getPointAtLength: jest.Mock;

  constructor(totalLength: number) {
    this.getTotalLength = jest.fn(() => totalLength);
    this.getPointAtLength = jest.fn((length: number) => ({
      x: length,
      y: 100,
    }));
  }
}

describe('trackPositionCalculator', () => {
  describe('getValidTrackDirection', () => {
    it('should return CLOCKWISE when passed valid clockwise string', () => {
      const result = getValidTrackDirection('clockwise');
      expect(result).toBe(TrackDirection.CLOCKWISE);
    });

    it('should return ANTICLOCKWISE when passed valid anticlockwise string', () => {
      const result = getValidTrackDirection('anticlockwise');
      expect(result).toBe(TrackDirection.ANTICLOCKWISE);
    });

    it('should return default direction when passed invalid value', () => {
      const result = getValidTrackDirection('invalid');
      expect(result).toBe(TrackDirection.CLOCKWISE);
    });

    it('should return custom default when specified', () => {
      const result = getValidTrackDirection(
        'invalid',
        TrackDirection.ANTICLOCKWISE,
      );
      expect(result).toBe(TrackDirection.ANTICLOCKWISE);
    });

    it('should return default for null', () => {
      const result = getValidTrackDirection(null);
      expect(result).toBe(TrackDirection.CLOCKWISE);
    });

    it('should return default for undefined', () => {
      const result = getValidTrackDirection(undefined);
      expect(result).toBe(TrackDirection.CLOCKWISE);
    });
  });

  describe('calculateCarPositionOnTrack', () => {
    it('should calculate position at start (0%) with clockwise direction', () => {
      const mockPath = new MockSVGPathElement(1000) as any;
      const startFinishLength = 500;

      const result = calculateCarPositionOnTrack(
        0,
        mockPath,
        TrackDirection.CLOCKWISE,
        startFinishLength,
      );

      // At 0% with clockwise: length = (500 + 0) % 1000 = 500
      expect(result).toEqual({ x: 500, y: 100 });
    });

    it('should calculate position at halfway (0.5%) with clockwise direction', () => {
      const mockPath = new MockSVGPathElement(1000) as any;
      const startFinishLength = 500;

      const result = calculateCarPositionOnTrack(
        0.5,
        mockPath,
        TrackDirection.CLOCKWISE,
        startFinishLength,
      );

      // At 50% with clockwise: length = (500 + 500) % 1000 = 0
      expect(result).toEqual({ x: 0, y: 100 });
    });

    it('should calculate different position with anticlockwise direction', () => {
      const mockPath = new MockSVGPathElement(1000) as any;
      const startFinishLength = 500;

      const result = calculateCarPositionOnTrack(
        0.5,
        mockPath,
        TrackDirection.ANTICLOCKWISE,
        startFinishLength,
      );

      // At 50% with anticlockwise: length = (500 - 500 + 1000) % 1000 = 1000 % 1000 = 0
      expect(result).toEqual({ x: 0, y: 100 });
    });

    it('should wrap around path when progress exceeds 1.0', () => {
      const mockPath = new MockSVGPathElement(1000) as any;
      const startFinishLength = 300;

      const result = calculateCarPositionOnTrack(
        1.5, // 150%
        mockPath,
        TrackDirection.CLOCKWISE,
        startFinishLength,
      );

      // At 150% with clockwise: length = (300 + 500) % 1000 = 800
      expect(result).toEqual({ x: 800, y: 100 });
    });

    it('should return 0,0 when path has no length', () => {
      const mockPath = new MockSVGPathElement(0) as any;

      const result = calculateCarPositionOnTrack(
        0.5,
        mockPath,
        TrackDirection.CLOCKWISE,
        500,
      );

      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should handle negative progress values', () => {
      const mockPath = new MockSVGPathElement(1000) as any;
      const startFinishLength = 500;

      const result = calculateCarPositionOnTrack(
        -0.2,
        mockPath,
        TrackDirection.CLOCKWISE,
        startFinishLength,
      );

      // At -20% with clockwise: length = (500 + (-200)) % 1000 = 300
      expect(result).toEqual({ x: 300, y: 100 });
    });

    it('should invert direction correctly - clockwise vs anticlockwise produce different results', () => {
      const mockPath = new MockSVGPathElement(1000) as any;
      const startFinishLength = 250;

      const clockwiseResult = calculateCarPositionOnTrack(
        0.25,
        mockPath,
        TrackDirection.CLOCKWISE,
        startFinishLength,
      );

      const anticlockwiseResult = calculateCarPositionOnTrack(
        0.25,
        mockPath,
        TrackDirection.ANTICLOCKWISE,
        startFinishLength,
      );

      // They should be different positions on the track
      // Clockwise: (250 + 250) % 1000 = 500
      // Anticlockwise: (250 - 250 + 1000) % 1000 = 1000 % 1000 = 0
      expect(clockwiseResult.x).not.toBe(anticlockwiseResult.x);
      expect(clockwiseResult.x).toBe(500);
      expect(anticlockwiseResult.x).toBe(0);
    });
  });
});
