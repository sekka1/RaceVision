import { StoreLocations } from '../../../../../constants/storeLocations';
import { MainHeader } from '../../header';

export function SpeedOverlayContent() {
  return (
    <div>
      <MainHeader text="Speed" windowName={StoreLocations.SPEED_OVERLAY} />
      <div>Display your current speed in MPH as a standalone overlay.</div>
    </div>
  );
}
