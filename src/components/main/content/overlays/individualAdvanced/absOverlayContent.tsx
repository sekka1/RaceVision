import { StoreLocations } from '../../../../../constants/storeLocations';
import { MainHeader } from '../../header';

export function AbsOverlayContent() {
  return (
    <div>
      <MainHeader text="ABS" windowName={StoreLocations.ABS_OVERLAY} />
      <div>Display an ABS indicator that lights up red when ABS is active.</div>
    </div>
  );
}
