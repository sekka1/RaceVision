import { useEffect, useState } from 'react';
import { IpcChannels } from '../../../../../constants/ipcChannels';
import { IUserSettings } from '../../../../../types/userSettings';
import styles from '../settings.module.css';

export function PerformanceSettings() {
  const [inputGraphFps, setInputGraphFps] = useState(144);
  const [telemetryUpdateInterval, setTelemetryUpdateInterval] = useState(10);
  const [sessionInfoUpdateInterval, setSessionInfoUpdateInterval] =
    useState(10);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke(IpcChannels.GET_USER_SETTINGS)
      .then((userSettings: IUserSettings) => {
        setInputGraphFps(userSettings.inputGraphFps ?? 144);
        setTelemetryUpdateInterval(userSettings.telemetryUpdateInterval ?? 10);
        setSessionInfoUpdateInterval(
          userSettings.sessionInfoUpdateInterval ?? 10,
        );
        return userSettings;
      })
      .catch(() => {});
  }, []);

  const handleInputGraphFpsChange = (value: number) => {
    setInputGraphFps(value);
    window.electron.ipcRenderer.sendMessage(
      IpcChannels.SET_INPUT_GRAPH_FPS,
      value,
    );
  };

  const handleTelemetryIntervalChange = (value: number) => {
    setTelemetryUpdateInterval(value);
    window.electron.ipcRenderer.sendMessage(
      IpcChannels.SET_TELEMETRY_UPDATE_INTERVAL,
      value,
    );
  };

  const handleSessionInfoIntervalChange = (value: number) => {
    setSessionInfoUpdateInterval(value);
    window.electron.ipcRenderer.sendMessage(
      IpcChannels.SET_SESSION_INFO_UPDATE_INTERVAL,
      value,
    );
  };

  return (
    <div>
      <div>
        <div className={styles.header}>Input Graph Frame Rate (FPS)</div>
        <input
          type="number"
          min={1}
          value={inputGraphFps}
          onChange={(e) => setInputGraphFps(Number(e.target.value))}
          onBlur={(e) => handleInputGraphFpsChange(Number(e.target.value))}
          style={{
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '4px',
            padding: '4px 8px',
            width: '80px',
            marginBottom: '8px',
          }}
        />
        <p className={styles.description}>
          Controls how many times per second the gas/brake input graph redraws.
          Higher values look smoother but use significantly more CPU since the
          chart is constantly animating.
          <br />
          <br />
          <strong>Recommendations:</strong>
          <br />
          &bull; <code>144</code> — Default, smoothest but most CPU intensive
          <br />
          &bull; <code>60</code> — Good balance, visually smooth, noticeably
          lower CPU usage
          <br />
          &bull; <code>30</code> — Lightweight, still very readable for
          monitoring inputs
          <br />
          <br />
          <em>
            Tip: If iRacing is losing FPS while this app is running, try setting
            this to 30 or 60 first — it&apos;s the biggest single win.
          </em>
        </p>
      </div>

      <div>
        <div className={styles.header}>Telemetry Update Interval (ms)</div>
        <input
          type="number"
          min={1}
          value={telemetryUpdateInterval}
          onChange={(e) => setTelemetryUpdateInterval(Number(e.target.value))}
          onBlur={(e) => handleTelemetryIntervalChange(Number(e.target.value))}
          style={{
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '4px',
            padding: '4px 8px',
            width: '80px',
            marginBottom: '8px',
          }}
        />
        <p className={styles.description}>
          Controls how often (in milliseconds) telemetry data is read from
          iRacing and sent to all overlay windows. Lower = more frequent updates
          = higher CPU usage.
          <br />
          <br />
          Every update sends a large data payload to every open overlay window,
          triggering a re-render in each one.
          <br />
          <br />
          <strong>Recommendations:</strong>
          <br />
          &bull; <code>10</code> ms — Default (100 updates/sec). Smoothest but
          most CPU intensive.
          <br />
          &bull; <code>33</code> ms — ~30 updates/sec. Good for most overlays,
          significantly less CPU.
          <br />
          &bull; <code>50</code> ms — ~20 updates/sec. Recommended if iRacing
          FPS is impacted. Most overlays (speed, RPM, gear) are perfectly
          readable at this rate.
          <br />
          &bull; <code>100</code> ms — ~10 updates/sec. Very low CPU, suitable
          if you only use slow-changing overlays.
        </p>
      </div>

      <div>
        <div className={styles.header}>Session Info Update Interval (ms)</div>
        <input
          type="number"
          min={1}
          value={sessionInfoUpdateInterval}
          onChange={(e) => setSessionInfoUpdateInterval(Number(e.target.value))}
          onBlur={(e) =>
            handleSessionInfoIntervalChange(Number(e.target.value))
          }
          style={{
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '4px',
            padding: '4px 8px',
            width: '80px',
            marginBottom: '8px',
          }}
        />
        <p className={styles.description}>
          Controls how often session data (standings, driver list, track info)
          is refreshed. Session info changes very rarely — only when drivers
          pit, swap, or the session state changes.
          <br />
          <br />
          <strong>Recommendations:</strong>
          <br />
          &bull; <code>10</code> ms — Default (unnecessary for session data
          which barely changes)
          <br />
          &bull; <code>1000</code> ms — <strong>Strongly recommended</strong>.
          Updates once per second, which is more than enough. Virtually no CPU
          cost and no noticeable difference.
          <br />
          &bull; <code>5000</code> ms — Updates every 5 seconds. Fine if you
          don&apos;t use standings/relative overlays heavily.
        </p>
      </div>
    </div>
  );
}
