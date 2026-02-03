import { BrowserWindowConstructorOptions } from 'electron';
import { StoreLocations } from './storeLocations';

export const DEFAULT_OPTIONS: {
  [key: string]: BrowserWindowConstructorOptions;
} = {
  [StoreLocations.INPUT_GRAPH_WINDOW]: {
    width: 600,
    height: 200,
  },
  [StoreLocations.INPUTS_WINDOW]: {
    width: 435,
    height: 130,
    minWidth: 435,
    minHeight: 130,
  },
  [StoreLocations.SPEED_OVERLAY]: {
    width: 120,
    height: 80,
    minWidth: 80,
    minHeight: 60,
  },
  [StoreLocations.RPM_OVERLAY]: {
    width: 120,
    height: 80,
    minWidth: 80,
    minHeight: 60,
  },
  [StoreLocations.RPM_LIGHTS_OVERLAY]: {
    width: 300,
    height: 60,
    minWidth: 200,
    minHeight: 40,
  },
  [StoreLocations.GEAR_OVERLAY]: {
    width: 130,
    height: 130,
    minWidth: 100,
    minHeight: 100,
  },
  [StoreLocations.ABS_OVERLAY]: {
    width: 100,
    height: 100,
    minWidth: 80,
    minHeight: 80,
  },
  default: {
    width: 600,
    height: 400,
    minHeight: 100,
  },
};
