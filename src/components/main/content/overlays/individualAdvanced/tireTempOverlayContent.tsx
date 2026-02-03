import { StoreLocations } from '../../../../../constants/storeLocations';
import { MainHeader } from '../../header';

export function TireTempOverlayContent() {
  return (
    <div>
      <MainHeader
        text="Tire Temps"
        windowName={StoreLocations.TIRE_TEMP_OVERLAY}
      />
      <div>
        Display real-time tire temperatures in a 2x2 grid. Each tire shows Left,
        Middle, and Right surface temperatures.
      </div>
    </div>
  );
}
