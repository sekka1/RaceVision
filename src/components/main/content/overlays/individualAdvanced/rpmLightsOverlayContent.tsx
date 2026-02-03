import { StoreLocations } from '../../../../../constants/storeLocations';
import { MainHeader } from '../../header';

export function RpmLightsOverlayContent() {
  return (
    <div>
      <MainHeader
        text="RPM Lights"
        windowName={StoreLocations.RPM_LIGHTS_OVERLAY}
      />
      <div>
        Display shift indicator lights that illuminate based on your RPM and
        flash when it&apos;s time to shift.
      </div>
    </div>
  );
}
