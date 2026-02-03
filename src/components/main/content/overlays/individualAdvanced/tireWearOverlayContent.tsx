import { StoreLocations } from '../../../../../constants/storeLocations';
import { MainHeader } from '../../header';

export function TireWearOverlayContent() {
  return (
    <div>
      <MainHeader
        text="Tire Wear"
        windowName={StoreLocations.TIRE_WEAR_OVERLAY}
      />
      <div>
        Display real-time tire wear in a 2x2 grid. Each tire shows Left, Middle,
        and Right tread wear with color-coded bars (green = new, yellow =
        moderate, red = worn).
      </div>
    </div>
  );
}
