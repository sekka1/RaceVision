import { useEffect, useState } from 'react';
import { useDraggable, useOpacity, useTitle } from '../../hooks/document';
import { useTelemetry } from '../../hooks/iracing';
import { TireTemp, TireTempData } from '../../components/inputs/basic/tireTemp';

export default function TireTempOverlayApp() {
  useTitle('Tire Temp Overlay');
  useDraggable();
  useOpacity();

  const telemetryInfo = useTelemetry();
  const [temps, setTemps] = useState<TireTempData>({
    LFtempCL: 0,
    LFtempCM: 0,
    LFtempCR: 0,
    RFtempCL: 0,
    RFtempCM: 0,
    RFtempCR: 0,
    LRtempCL: 0,
    LRtempCM: 0,
    LRtempCR: 0,
    RRtempCL: 0,
    RRtempCM: 0,
    RRtempCR: 0,
  });

  useEffect(() => {
    if (telemetryInfo) {
      setTemps({
        LFtempCL: telemetryInfo.values.LFtempCL ?? 0,
        LFtempCM: telemetryInfo.values.LFtempCM ?? 0,
        LFtempCR: telemetryInfo.values.LFtempCR ?? 0,
        RFtempCL: telemetryInfo.values.RFtempCL ?? 0,
        RFtempCM: telemetryInfo.values.RFtempCM ?? 0,
        RFtempCR: telemetryInfo.values.RFtempCR ?? 0,
        LRtempCL: telemetryInfo.values.LRtempCL ?? 0,
        LRtempCM: telemetryInfo.values.LRtempCM ?? 0,
        LRtempCR: telemetryInfo.values.LRtempCR ?? 0,
        RRtempCL: telemetryInfo.values.RRtempCL ?? 0,
        RRtempCM: telemetryInfo.values.RRtempCM ?? 0,
        RRtempCR: telemetryInfo.values.RRtempCR ?? 0,
      });
    }
  }, [telemetryInfo]);

  return (
    <div className="overlayWindow roundedOverlayWindow overlayDefaultBackgroundColor">
      <TireTemp temps={temps} />
      <div id="draggableWrapper">TIRE TEMPS</div>
    </div>
  );
}
