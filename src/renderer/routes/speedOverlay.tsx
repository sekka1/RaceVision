import { useEffect, useState } from 'react';
import { useDraggable, useOpacity, useTitle } from '../../hooks/document';
import { useTelemetry } from '../../hooks/iracing';
import { CarSpeed } from '../../components/inputs/basic/carSpeed';
import { DisplayUnits } from '../../types/displayUnits';

export default function SpeedOverlayApp() {
  useTitle('Speed Overlay');
  useDraggable();
  useOpacity();

  const telemetryInfo = useTelemetry();
  const [carSpeed, setCarSpeed] = useState(0);

  useEffect(() => {
    if (telemetryInfo) {
      setCarSpeed(telemetryInfo.values.Speed);
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
        <CarSpeed speed={carSpeed} units={DisplayUnits.MPH} />
      </div>
      <div id="draggableWrapper">SPEED</div>
    </div>
  );
}
