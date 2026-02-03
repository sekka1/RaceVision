/* eslint global-require: off, no-console: off */

import { BrowserWindow } from 'electron';
import { IpcChannels } from '../../constants/ipcChannels';
import { ISessionInfo, ITelemetry } from '../../types/iracing';
import { StoreLocations } from '../../constants/storeLocations';
import { recordingService } from './recordingService';
import { getUserSettings } from '../storeUtils';

const getAllOverlayWindows = () => {
  return BrowserWindow.getAllWindows().filter(
    (win) => win.getTitle() !== StoreLocations.MAIN,
  );
};

const sendToAllWindows = (channel: string, data: ISessionInfo | ITelemetry) => {
  // Send to ALL windows including main window (for connection status display)
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(channel, data);
  });
};

const reloadAllOverlayWindows = () => {
  getAllOverlayWindows().forEach((window) => {
    window.reload();
    window.minimize();
  });
};

const restoreAllOverlayWindows = () => {
  getAllOverlayWindows().forEach((window) => {
    // restore if running when iracing launched
    window.restore();

    // restore if app launching and window starts minimized
    window.on('ready-to-show', () => {
      window.restore();
      console.log('restoring window');
    });
  });
};

// Track the previous IsOnTrack state to avoid repeated show/hide calls
let wasOnTrack: boolean | null = null;

const updateOverlayVisibility = (isOnTrack: boolean) => {
  const { autoHideWhenNotInCar } = getUserSettings();

  if (!autoHideWhenNotInCar) {
    // If auto-hide is disabled and overlays were previously hidden, restore them
    if (wasOnTrack === false) {
      getAllOverlayWindows().forEach((window) => {
        window.restore();
      });
    }
    wasOnTrack = null;
    return;
  }

  // Only update if state changed to avoid flickering
  if (wasOnTrack !== isOnTrack) {
    wasOnTrack = isOnTrack;
    getAllOverlayWindows().forEach((window) => {
      if (isOnTrack) {
        window.restore();
      } else {
        window.minimize();
      }
    });
  }
};

export const initializeIRacing = () => {
  let irsdk;
  try {
    irsdk = require('iracing-sdk-js');
  } catch (error) {
    console.error('[iRacing] Could not load iracing-sdk-js module:', error);
    throw error;
  }

  irsdk.init({
    telemetryUpdateInterval: 10,
    sessionInfoUpdateInterval: 10,
  });

  const iracing = irsdk.getInstance();

  console.info('\nWaiting for iRacing...');

  iracing.on('Connected', () => {
    console.info('[iRacing] Connected to iRacing');
    restoreAllOverlayWindows();

    iracing.on('Disconnected', () => {
      console.info('[iRacing] Disconnected from iRacing');

      reloadAllOverlayWindows();
    });

    iracing.on('SessionInfo', (sessionInfo: ISessionInfo) => {
      console.debug('[iRacing] SessionInfo event received', {
        trackName: sessionInfo?.data?.WeekendInfo?.TrackName,
        trackDisplayName: sessionInfo?.data?.WeekendInfo?.TrackDisplayName,
      });
      // Capture for recording if active
      recordingService.captureSessionInfo(sessionInfo);

      // Send to all windows including main (for connection status display)
      sendToAllWindows(IpcChannels.IRACING_SESSION_INFO, sessionInfo);
    });

    iracing.on('Telemetry', (telemetryInfo: ITelemetry) => {
      // Log every 100 telemetry events to avoid console spam
      const frameNum = telemetryInfo?.values?.FrameNum ?? 0;
      if (frameNum % 100 === 0) {
        console.debug('[iRacing] Telemetry event received at frame', frameNum);
      }

      // Update overlay visibility based on IsOnTrack status
      const isOnTrack = telemetryInfo?.values?.IsOnTrack ?? false;
      updateOverlayVisibility(isOnTrack);

      // Capture for recording if active
      recordingService.captureTelemetry(telemetryInfo);

      // Send to all windows including main (for connection status display)
      sendToAllWindows(IpcChannels.IRACING_TELEMETRY_INFO, telemetryInfo);
    });
  });
};
