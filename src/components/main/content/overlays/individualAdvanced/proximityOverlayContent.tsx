import { StoreLocations } from '../../../../../constants/storeLocations';
import { MainHeader } from '../../header';

export function ProximityOverlayContent() {
  return (
    <div>
      <MainHeader
        text="Proximity"
        windowName={StoreLocations.PROXIMITY_OVERLAY}
      />
      <div>
        Displays the distance in feet to the car directly ahead and behind you.
        Color changes from green (far) to yellow (medium) to red (close).
      </div>
    </div>
  );
}
