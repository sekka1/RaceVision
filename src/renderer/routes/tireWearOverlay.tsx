import { useEffect, useState } from 'react';
import { useDraggable, useOpacity, useTitle } from '../../hooks/document';
import { useTelemetry } from '../../hooks/iracing';
import { TireWear, TireWearData } from '../../components/inputs/basic/tireSlip';

export default function TireWearOverlayApp() {
  useTitle('Tire Wear Overlay');
  useDraggable();
  useOpacity();

  const telemetryInfo = useTelemetry();
  const [wearData, setWearData] = useState<TireWearData>({
    LFwearL: 1,
    LFwearM: 1,
    LFwearR: 1,
    RFwearL: 1,
    RFwearM: 1,
    RFwearR: 1,
    LRwearL: 1,
    LRwearM: 1,
    LRwearR: 1,
    RRwearL: 1,
    RRwearM: 1,
    RRwearR: 1,
  });

  useEffect(() => {
    if (telemetryInfo) {
      setWearData({
        LFwearL: telemetryInfo.values.LFwearL ?? 1,
        LFwearM: telemetryInfo.values.LFwearM ?? 1,
        LFwearR: telemetryInfo.values.LFwearR ?? 1,
        RFwearL: telemetryInfo.values.RFwearL ?? 1,
        RFwearM: telemetryInfo.values.RFwearM ?? 1,
        RFwearR: telemetryInfo.values.RFwearR ?? 1,
        LRwearL: telemetryInfo.values.LRwearL ?? 1,
        LRwearM: telemetryInfo.values.LRwearM ?? 1,
        LRwearR: telemetryInfo.values.LRwearR ?? 1,
        RRwearL: telemetryInfo.values.RRwearL ?? 1,
        RRwearM: telemetryInfo.values.RRwearM ?? 1,
        RRwearR: telemetryInfo.values.RRwearR ?? 1,
      });
    }
  }, [telemetryInfo]);

  return (
    <div className="overlayWindow roundedOverlayWindow overlayDefaultBackgroundColor">
      <TireWear wearData={wearData} />
      <div id="draggableWrapper">TIRE WEAR</div>
    </div>
  );
}
