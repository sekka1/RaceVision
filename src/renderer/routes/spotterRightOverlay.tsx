import { useEffect, useState } from 'react';
import { useDraggable, useOpacity, useTitle } from '../../hooks/document';
import { useTelemetry } from '../../hooks/iracing';
import { CarLeftRight } from '../../types/iracing';
import { SpotterIndicator } from '../../components/spotter';

export default function SpotterRightOverlayApp() {
  useTitle('Spotter Right');
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
      <SpotterIndicator side="right" carLeftRight={carLeftRight} />
      <div id="draggableWrapper">SPOTTER RIGHT</div>
    </div>
  );
}
