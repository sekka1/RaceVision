import { useEffect, useState } from 'react';
import { MainHeader } from '../header';
import { DarkModeToggle } from './toggles/darkMode';
import { DragToggle } from './toggles/drag';
import styles from './settings.module.css';
import { OpacityRangeSlider } from './range/opacity';
import { ResetOverlayPositionButton } from '../../buttons/resetOverlay';
import { IpcChannels } from '../../../../constants/ipcChannels';
import { IRecordingStatus } from '../../../../types/recording';

export function SettingsContent() {
  const [recordingStatus, setRecordingStatus] = useState<IRecordingStatus>({
    isRecording: false,
  });

  useEffect(() => {
    // Poll recording status every second
    const interval = setInterval(() => {
      window.electron.ipcRenderer
        .invoke(IpcChannels.GET_RECORDING_STATUS)
        .then((status: IRecordingStatus) => setRecordingStatus(status))
        .catch(() => {});
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartRecording = async () => {
    await window.electron.ipcRenderer.invoke(IpcChannels.START_RECORDING);
    const status = await window.electron.ipcRenderer.invoke(
      IpcChannels.GET_RECORDING_STATUS,
    );
    setRecordingStatus(status);
  };

  const handleStopRecording = async () => {
    await window.electron.ipcRenderer.invoke(IpcChannels.STOP_RECORDING);
    const status = await window.electron.ipcRenderer.invoke(
      IpcChannels.GET_RECORDING_STATUS,
    );
    setRecordingStatus(status);
  };

  return (
    <div>
      <MainHeader text="Settings" />

      <h3>General</h3>
      <div className={styles.indentSubContent}>
        <DarkModeToggle />
      </div>

      <h3>Overlays</h3>
      <div className={styles.indentSubContent}>
        <div>
          <div className={styles.header}>Reset Overlay Positions</div>
          <ResetOverlayPositionButton />
        </div>

        <DragToggle />
        <OpacityRangeSlider />
      </div>

      <h3>Recording</h3>
      <div className={styles.indentSubContent}>
        <div>
          <div className={styles.header}>Record iRacing Data</div>
          <p className={styles.description}>
            Record session and telemetry data for testing overlays without
            iRacing.
          </p>
          {recordingStatus.isRecording ? (
            <div>
              <div className={styles.recordingStatus}>
                <span className={styles.recordingDot} />
                Recording... ({recordingStatus.frameCount} frames)
              </div>
              <button
                type="button"
                className="secondaryButton"
                onClick={handleStopRecording}
              >
                Stop Recording
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="secondaryButton"
              onClick={handleStartRecording}
            >
              Start Recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
