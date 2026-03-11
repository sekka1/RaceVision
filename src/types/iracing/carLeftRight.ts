/**
 * CarLeftRight — iRacing Spotter Proximity Indicator
 *
 * This telemetry variable is provided by the iRacing SDK and indicates
 * whether there are cars alongside the player's car (left, right, or both).
 * It corresponds to the spotter audio callouts ("car left", "car right", "clear").
 *
 * The iRacing SDK defines this as the `irsdk_CarLeftRight` enum in irsdk_defines.h.
 * The iracing-sdk-js wrapper converts the numeric enum to string values via
 * the `CAR_BESIDE` mapping in IrSdkBindingHelpers.h.
 *
 * ## Available States
 *
 * | Value              | Description                                        |
 * |--------------------|----------------------------------------------------|
 * | `LROff`            | Spotter is disabled or unavailable                 |
 * | `LRClear`          | No cars around us — we are clear on both sides     |
 * | `LRCarLeft`        | There is a car to our left                         |
 * | `LRCarRight`       | There is a car to our right                        |
 * | `LRCarLeftRight`   | There are cars on BOTH sides simultaneously        |
 * | `LR2CarsLeft`      | There are TWO cars to our left                     |
 * | `LR2CarsRight`     | There are TWO cars to our right                    |
 *
 * ## Usage Notes
 *
 * - This value updates at the telemetry tick rate (every ~10ms).
 * - `LR2CarsLeft` and `LR2CarsRight` indicate multiple cars on one side.
 *   For basic spotter overlays these can be treated the same as single-car
 *   states (`LRCarLeft` / `LRCarRight`), but a future enhancement could
 *   use stronger visual cues (brighter glow, double indicator, etc.).
 * - `LRCarLeftRight` means cars on BOTH sides — both left and right
 *   indicators should activate.
 * - `LROff` typically means the spotter system is disabled in iRacing
 *   settings. The overlay should remain inactive (same as `LRClear`).
 *
 * ## Related Telemetry Variables (not yet typed in RaceVision)
 *
 * - `CarDistAhead` (number) — Distance in meters to the car directly ahead.
 * - `CarDistBehind` (number) — Distance in meters to the car directly behind.
 *
 * These could be used in the future to scale indicator intensity based on
 * proximity, or to add front/rear proximity warnings.
 *
 * ## References
 *
 * - iRacing SDK: irsdk_defines.h — `enum irsdk_CarLeftRight`
 * - iracing-sdk-js: IrSdkBindingHelpers.h — `CAR_BESIDE` string mapping
 * - iracing-sdk-js types: index.d.ts — `CarLeftRight` type
 */

/**
 * Union type representing all possible values of the iRacing `CarLeftRight`
 * telemetry variable.
 */
export type CarLeftRight =
  | 'LROff'
  | 'LRClear'
  | 'LRCarLeft'
  | 'LRCarRight'
  | 'LRCarLeftRight'
  | 'LR2CarsLeft'
  | 'LR2CarsRight';

/**
 * Helper: returns true if a car is present on the LEFT side.
 * Treats multi-car states (LR2CarsLeft) the same as single-car.
 */
export function isCarLeft(value: CarLeftRight): boolean {
  return (
    value === 'LRCarLeft' ||
    value === 'LRCarLeftRight' ||
    value === 'LR2CarsLeft'
  );
}

/**
 * Helper: returns true if a car is present on the RIGHT side.
 * Treats multi-car states (LR2CarsRight) the same as single-car.
 */
export function isCarRight(value: CarLeftRight): boolean {
  return (
    value === 'LRCarRight' ||
    value === 'LRCarLeftRight' ||
    value === 'LR2CarsRight'
  );
}
