import { useAppContext } from '../../contextProvider';
import { AdvancedPanelOverlayContent } from './advancedPanel';
import { FuelCalculatorOverlayContent } from './fuelCalculator';
import { InputGraphOverlayContent } from './inputGraph';
import { RelativesOverlayContent } from './relatives';
import { StandingsOverlayContent } from './standings';
import { TrackMapOverlayContent } from './trackMap';
import { TestOverlayContent } from './testOverlay';
import {
  SpeedOverlayContent,
  RpmOverlayContent,
  RpmLightsOverlayContent,
  GearOverlayContent,
  AbsOverlayContent,
  TireTempOverlayContent,
  TireWearOverlayContent,
  TireSlipOverlayContent,
} from './individualAdvanced';

// TODO: change to list, remove hardcoded indexes
export function OverlaysContent() {
  const { openOverlayNavIndex } = useAppContext();

  if (openOverlayNavIndex === 0) {
    return <RelativesOverlayContent />;
  }
  if (openOverlayNavIndex === 1) {
    return <StandingsOverlayContent />;
  }
  if (openOverlayNavIndex === 2) {
    return <InputGraphOverlayContent />;
  }
  if (openOverlayNavIndex === 3) {
    return <AdvancedPanelOverlayContent />;
  }
  if (openOverlayNavIndex === 4) {
    return <FuelCalculatorOverlayContent />;
  }
  if (openOverlayNavIndex === 5) {
    return <TrackMapOverlayContent />;
  }
  if (openOverlayNavIndex === 6) {
    return <TestOverlayContent />;
  }
  // Individual Advanced Panel Overlays
  if (openOverlayNavIndex === 7) {
    return <SpeedOverlayContent />;
  }
  if (openOverlayNavIndex === 8) {
    return <RpmOverlayContent />;
  }
  if (openOverlayNavIndex === 9) {
    return <RpmLightsOverlayContent />;
  }
  if (openOverlayNavIndex === 10) {
    return <GearOverlayContent />;
  }
  if (openOverlayNavIndex === 11) {
    return <AbsOverlayContent />;
  }
  if (openOverlayNavIndex === 12) {
    return <TireTempOverlayContent />;
  }
  if (openOverlayNavIndex === 13) {
    return <TireWearOverlayContent />;
  }
  if (openOverlayNavIndex === 14) {
    return <TireSlipOverlayContent />;
  }
  return null;
}
