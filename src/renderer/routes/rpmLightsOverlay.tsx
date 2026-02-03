import { useEffect, useState } from 'react';
import { useDraggable, useOpacity, useTitle } from '../../hooks/document';
import { useTelemetry } from '../../hooks/iracing';
import { ShiftLight } from '../../components/inputs/basic/shiftLight';

export default function RpmLightsOverlayApp() {
  useTitle('RPM Lights Overlay');
  useDraggable();
  useOpacity();

  const telemetryInfo = useTelemetry();
  const [carRpm, setCarRpm] = useState(0);
  const [blinkingShiftLightRpm, setBlinkingShiftLightRpm] = useState(
    Number.MAX_SAFE_INTEGER,
  );

  useEffect(() => {
    if (telemetryInfo) {
      setCarRpm(telemetryInfo.values.RPM);
      setBlinkingShiftLightRpm(telemetryInfo.values.PlayerCarSLBlinkRPM);
    }
  }, [telemetryInfo]);

  return (
    <div className="overlayWindow roundedOverlayWindow overlayDefaultBackgroundColor">
      <div
        style={{
          padding: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <ShiftLight
          currentRpm={carRpm}
          blinkingShiftLightRpm={blinkingShiftLightRpm}
        />
      </div>
      <div id="draggableWrapper">RPM LIGHTS</div>
    </div>
  );
}
