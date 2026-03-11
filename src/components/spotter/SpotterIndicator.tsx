import { CarLeftRight, isCarLeft, isCarRight } from '../../types/iracing';
import styles from './spotter.module.css';

interface SpotterIndicatorProps {
  side: 'left' | 'right';
  carLeftRight: CarLeftRight;
}

export function SpotterIndicator({
  side,
  carLeftRight,
}: SpotterIndicatorProps) {
  const isActive =
    side === 'left' ? isCarLeft(carLeftRight) : isCarRight(carLeftRight);

  return (
    <div className={`${styles.indicator} ${isActive ? styles.active : ''}`} />
  );
}
