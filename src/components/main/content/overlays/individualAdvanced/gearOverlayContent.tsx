import { StoreLocations } from '../../../../../constants/storeLocations';
import { MainHeader } from '../../header';

export function GearOverlayContent() {
  return (
    <div>
      <MainHeader text="Gear" windowName={StoreLocations.GEAR_OVERLAY} />
      <div>
        Display your current gear selection (R, N, 1, 2, 3...) as a standalone
        overlay.
      </div>
    </div>
  );
}
