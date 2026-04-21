import { ISessionInfo } from '../../types/iracing';
import { TrackCanvas } from './canvas';
import { TrackDirection } from '../../types/trackMap';

export function TrackMap(props: {
  trackId?: number;
  trackDirection?: TrackDirection;
  drivers?: {
    progress: number;
    isPlayer: boolean;
    driver: ISessionInfo['data']['DriverInfo']['Drivers'][0];
  }[];
}) {
  if (!props.trackId || !props.drivers) {
    return null;
  }

  return (
    <TrackCanvas
      trackId={props.trackId}
      drivers={props.drivers}
      trackDirection={props.trackDirection}
    />
  );
}
