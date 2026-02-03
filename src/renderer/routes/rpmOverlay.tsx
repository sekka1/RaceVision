import { useEffect, useState } from 'react';
import { useDraggable, useOpacity, useTitle } from '../../hooks/document';
import { useTelemetry } from '../../hooks/iracing';
import { CarRpm } from '../../components/inputs/basic/carRpm';

export default function RpmOverlayApp() {
  useTitle('RPM Overlay');
  useDraggable();
  useOpacity();

  const telemetryInfo = useTelemetry();
  const [carRpm, setCarRpm] = useState(0);

  useEffect(() => {
    if (telemetryInfo) {
      setCarRpm(telemetryInfo.values.RPM);
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
        <CarRpm rpm={carRpm} />
      </div>
      <div id="draggableWrapper">RPM</div>
    </div>
  );
}
