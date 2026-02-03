import { StoreLocations } from '../../../../../constants/storeLocations';
import { MainHeader } from '../../header';

export function RpmOverlayContent() {
  return (
    <div>
      <MainHeader text="RPM" windowName={StoreLocations.RPM_OVERLAY} />
      <div>Display your current engine RPM as a standalone overlay.</div>
    </div>
  );
}
