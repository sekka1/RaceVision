/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { IpcChannels } from '../../../../../../constants/ipcChannels';
import { IUserSettings } from '../../../../../../types/userSettings';
import { ToggleSwitch } from '../../../../../common/toggle';
import { useAppContext } from '../../../../contextProvider';

export function AutoHideToggle() {
  const { autoHideWhenNotInCar, setAutoHideWhenNotInCar } = useAppContext();

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke(IpcChannels.GET_USER_SETTINGS)
      .then((userSettings: IUserSettings) =>
        setAutoHideWhenNotInCar(userSettings.autoHideWhenNotInCar ?? false),
      )
      .catch(() => setAutoHideWhenNotInCar(false));
  }, []);

  const toggleAutoHide = () => {
    const newValue = !autoHideWhenNotInCar;
    window.electron.ipcRenderer.sendMessage(
      IpcChannels.SET_AUTO_HIDE_WHEN_NOT_IN_CAR,
      newValue,
    );
    setAutoHideWhenNotInCar(newValue);
  };

  return (
    <ToggleSwitch
      handleToggle={toggleAutoHide}
      isOn={autoHideWhenNotInCar}
      headerText="Auto-hide Overlays When Not In Car"
    />
  );
}
