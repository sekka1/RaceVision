import { useEffect, useState } from 'react';
import { useDraggable, useOpacity, useTitle } from '../../hooks/document';
import { useTelemetry } from '../../hooks/iracing';
import { AbsLight } from '../../components/inputs/basic/absLight';

export default function AbsOverlayApp() {
  useTitle('ABS Overlay');
  useDraggable();
  useOpacity();

  const telemetryInfo = useTelemetry();
  const [isCarAbs, setIsCarAbs] = useState(false);

  useEffect(() => {
    if (telemetryInfo) {
      setIsCarAbs(telemetryInfo.values.BrakeABSactive);
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
        <AbsLight isAbsActive={isCarAbs} />
      </div>
      <div id="draggableWrapper">ABS</div>
    </div>
  );
}
