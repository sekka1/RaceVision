import { ISessionInfo, ITelemetry } from './iracing';

export interface ITelemetryFrame {
  timestamp: number; // Relative ms from recording start
  values: ITelemetry['values'];
}

export interface IRecording {
  version: string;
  appVersion: string;
  startTime: string;
  endTime: string;
  sessionInfo: ISessionInfo;
  telemetryFrames: ITelemetryFrame[];
}

export interface IRecordingStatus {
  isRecording: boolean;
  startTime?: string;
  frameCount?: number;
}
