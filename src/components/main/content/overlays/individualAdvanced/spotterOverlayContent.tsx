import { StoreLocations } from '../../../../../constants/storeLocations';
import { MainHeader } from '../../header';

export function SpotterOverlayContent() {
  return (
    <div>
      <MainHeader
        text="Spotter — Left Side"
        windowName={StoreLocations.SPOTTER_LEFT_OVERLAY}
      />
      <div style={{ marginBottom: '2rem' }}>
        Displays a red glow indicator when a car is on your left side. Position
        this overlay at the left edge of your screen for peripheral visibility.
      </div>

      <MainHeader
        text="Spotter — Right Side"
        windowName={StoreLocations.SPOTTER_RIGHT_OVERLAY}
      />
      <div>
        Displays a red glow indicator when a car is on your right side. Position
        this overlay at the right edge of your screen for peripheral visibility.
      </div>
    </div>
  );
}
