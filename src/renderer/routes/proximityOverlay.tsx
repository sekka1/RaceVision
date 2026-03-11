import { useEffect, useState } from 'react';
import { useDraggable, useOpacity, useTitle } from '../../hooks/document';
import { useTelemetry } from '../../hooks/iracing';
import { ProximityDisplay } from '../../components/proximity';
import styles from '../../components/proximity/proximity.module.css';

export default function ProximityOverlayApp() {
  useTitle('Proximity');
  useDraggable();
  useOpacity();

  const telemetryInfo = useTelemetry();
  const [distAhead, setDistAhead] = useState(0);
  const [distBehind, setDistBehind] = useState(0);

  useEffect(() => {
    if (telemetryInfo) {
      setDistAhead(telemetryInfo.values.CarDistAhead);
      setDistBehind(telemetryInfo.values.CarDistBehind);
    }
  }, [telemetryInfo]);

  return (
    <div className="overlayWindow roundedOverlayWindow overlayDefaultBackgroundColor">
      <div className={styles.proximityWrapper}>
        <ProximityDisplay label="Ahead" distanceMeters={distAhead} />
        <ProximityDisplay label="Behind" distanceMeters={distBehind} />
      </div>
      <div id="draggableWrapper">PROXIMITY</div>
    </div>
  );
}
