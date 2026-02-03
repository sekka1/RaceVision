import { HashRouter, Route, Routes } from 'react-router-dom';
import RelativeApp from './routes/relative';
import StandingsApp from './routes/standings';
import MainApp from './routes/main';
import InputGraphApp from './routes/inputGraph';
import InputsApp from './routes/inputs';
import FuelCalculatorApp from './routes/fuelCalculator';
import TrackMapApp from './routes/trackMap';
import TestOverlayApp from './routes/testOverlay';
import SpeedOverlayApp from './routes/speedOverlay';
import RpmOverlayApp from './routes/rpmOverlay';
import RpmLightsOverlayApp from './routes/rpmLightsOverlay';
import GearOverlayApp from './routes/gearOverlay';
import AbsOverlayApp from './routes/absOverlay';
import TireTempOverlayApp from './routes/tireTempOverlay';
import TireWearOverlayApp from './routes/tireWearOverlay';
import TireSlipOverlayApp from './routes/tireSlipOverlay';

export function MainRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/relative" element={<RelativeApp />} />
        <Route path="/standings" element={<StandingsApp />} />
        <Route path="/inputGraph" element={<InputGraphApp />} />
        <Route path="/inputs" element={<InputsApp />} />
        <Route path="/fuelCalculator" element={<FuelCalculatorApp />} />
        <Route path="/trackMap" element={<TrackMapApp />} />
        <Route path="/testOverlay" element={<TestOverlayApp />} />
        <Route path="/speedOverlay" element={<SpeedOverlayApp />} />
        <Route path="/rpmOverlay" element={<RpmOverlayApp />} />
        <Route path="/rpmLightsOverlay" element={<RpmLightsOverlayApp />} />
        <Route path="/gearOverlay" element={<GearOverlayApp />} />
        <Route path="/absOverlay" element={<AbsOverlayApp />} />
        <Route path="/tireTempOverlay" element={<TireTempOverlayApp />} />
        <Route path="/tireWearOverlay" element={<TireWearOverlayApp />} />
        <Route path="/tireSlipOverlay" element={<TireSlipOverlayApp />} />
      </Routes>
    </HashRouter>
  );
}
