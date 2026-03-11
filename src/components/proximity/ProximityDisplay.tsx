import styles from './proximity.module.css';

interface ProximityDisplayProps {
  label: string;
  distanceMeters: number;
}

function metersToFeet(meters: number): number {
  return meters * 3.28084;
}

/**
 * Color gradient: green (far, >=50ft) -> yellow (~25ft) -> red (close, <=5ft)
 */
function getProximityColor(distanceFeet: number): string {
  const maxDist = 50;
  const clamped = Math.min(Math.max(distanceFeet, 0), maxDist);
  const ratio = clamped / maxDist;

  if (ratio > 0.5) {
    const t = (ratio - 0.5) / 0.5;
    const r = Math.round(255 * (1 - t));
    return `rgb(${r}, 255, 0)`;
  }
  const t = ratio / 0.5;
  const g = Math.round(255 * t);
  return `rgb(255, ${g}, 0)`;
}

export function ProximityDisplay({
  label,
  distanceMeters,
}: ProximityDisplayProps) {
  const distanceFeet = metersToFeet(distanceMeters);
  const displayValue = distanceFeet.toFixed(1);
  const color = getProximityColor(distanceFeet);

  return (
    <div className={styles.proximityItem}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value} style={{ color }}>
        {displayValue} ft
      </div>
      <div className={styles.bar}>
        <div
          className={styles.barFill}
          style={{
            width: `${Math.max(0, Math.min(100, 100 - (distanceFeet / 50) * 100))}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
