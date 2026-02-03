import { StoreLocations } from '../../../../../constants/storeLocations';
import { MainHeader } from '../../header';

export function TireSlipOverlayContent() {
  return (
    <div>
      <MainHeader
        text="Telemetry Debug"
        windowName={StoreLocations.TIRE_SLIP_OVERLAY}
      />
      <div>
        Interactive telemetry explorer. Use the search box to filter through all
        available iRacing telemetry values. Try searching for &quot;tire&quot;,
        &quot;slip&quot;, &quot;wheel&quot;, &quot;lat&quot;, &quot;accel&quot;,
        etc.
      </div>
    </div>
  );
}
