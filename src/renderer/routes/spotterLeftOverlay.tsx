import { useEffect, useState } from 'react';
import { useDraggable, useOpacity, useTitle } from '../../hooks/document';
import { useTelemetry } from '../../hooks/iracing';
import { CarLeftRight } from '../../types/iracing';
import { SpotterIndicator } from '../../components/spotter';

export default function SpotterLeftOverlayApp() {
  useTitle('Spotter Left');
  useDraggable();
  useOpacity();

  const telemetryInfo = useTelemetry();
  const [carLeftRight, setCarLeftRight] = useState<CarLeftRight>('LROff');

  useEffect(() => {
    if (telemetryInfo) {
      setCarLeftRight(telemetryInfo.values.CarLeftRight);
    }
  }, [telemetryInfo]);

  return (
    <div className="overlayWindow roundedOverlayWindow overlayDefaultBackgroundColor">
      <SpotterIndicator side="left" carLeftRight={carLeftRight} />
      <div id="draggableWrapper">SPOTTER LEFT</div>
    </div>
  );
}
