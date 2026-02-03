import { useEffect, useState } from 'react';
import { useDraggable, useOpacity, useTitle } from '../../hooks/document';
import { useTelemetry } from '../../hooks/iracing';
import { CarGear } from '../../components/inputs/basic/carGear/carGear';

export default function GearOverlayApp() {
  useTitle('Gear Overlay');
  useDraggable();
  useOpacity();

  const telemetryInfo = useTelemetry();
  const [carGear, setCarGear] = useState(0);

  useEffect(() => {
    if (telemetryInfo) {
      setCarGear(telemetryInfo.values.Gear);
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
        <CarGear gear={carGear} />
      </div>
      <div id="draggableWrapper">GEAR</div>
    </div>
  );
}
