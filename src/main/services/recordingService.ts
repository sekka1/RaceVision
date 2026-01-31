/* eslint-disable no-console */
import { app, dialog } from 'electron';
import * as fs from 'fs';
import { ISessionInfo, ITelemetry } from '../../types/iracing';
import {
  IRecording,
  IRecordingStatus,
  ITelemetryFrame,
} from '../../types/recording';

class RecordingService {
  private isRecording = false;

  private startTime: number = 0;

  private sessionInfo: ISessionInfo | null = null;

  private telemetryFrames: ITelemetryFrame[] = [];

  getStatus(): IRecordingStatus {
    return {
      isRecording: this.isRecording,
      startTime: this.isRecording
        ? new Date(this.startTime).toISOString()
        : undefined,
      frameCount: this.telemetryFrames.length,
    };
  }

  start(): boolean {
    if (this.isRecording) {
      return false;
    }

    this.isRecording = true;
    this.startTime = Date.now();
    this.sessionInfo = null;
    this.telemetryFrames = [];

    console.info('Recording started');
    return true;
  }

  async stop(): Promise<{ filePath: string | null; error?: string }> {
    if (!this.isRecording) {
      return { filePath: null, error: 'Not recording' };
    }

    this.isRecording = false;

    if (!this.sessionInfo || this.telemetryFrames.length === 0) {
      console.warn('[RecordingService] Recording stopped with no data', {
        hasSessionInfo: !!this.sessionInfo,
        frameCount: this.telemetryFrames.length,
      });
      return {
        filePath: null,
        error:
          'No data was recorded. Make sure iRacing is running before starting a recording.',
      };
    }

    const result = await dialog.showSaveDialog({
      title: 'Save iRacing Recording',
      defaultPath: `iracing-recording-${new Date(this.startTime).toISOString().replace(/[:.]/g, '-')}.json`,
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
    });

    if (result.canceled || !result.filePath) {
      console.info('Recording save cancelled');
      return { filePath: null };
    }

    const recording: IRecording = {
      version: '1.0',
      appVersion: app.getVersion(),
      startTime: new Date(this.startTime).toISOString(),
      endTime: new Date().toISOString(),
      sessionInfo: this.sessionInfo,
      telemetryFrames: this.telemetryFrames,
    };

    try {
      fs.writeFileSync(result.filePath, JSON.stringify(recording, null, 2));
      console.info(`Recording saved to: ${result.filePath}`);
      return { filePath: result.filePath };
    } catch (error) {
      console.error('Failed to save recording:', error);
      return { filePath: null, error: 'Failed to save recording file' };
    }
  }

  captureSessionInfo(sessionInfo: ISessionInfo): void {
    if (!this.isRecording) return;

    // Always capture the latest session info
    if (!this.sessionInfo) {
      console.info('[RecordingService] First sessionInfo captured:', {
        trackName: sessionInfo?.data?.TrackName,
        sessionType: sessionInfo?.data?.SessionType,
      });
    }
    this.sessionInfo = sessionInfo;
  }

  captureTelemetry(telemetry: ITelemetry): void {
    if (!this.isRecording) return;

    // Log every 100 frames to avoid console spam
    if (this.telemetryFrames.length % 100 === 0) {
      console.debug(
        `[RecordingService] Captured ${this.telemetryFrames.length} telemetry frames`,
      );
    }

    const frame: ITelemetryFrame = {
      timestamp: Date.now() - this.startTime,
      values: telemetry.values,
    };

    this.telemetryFrames.push(frame);
  }
}

export const recordingService = new RecordingService();
