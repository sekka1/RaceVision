import styles from './tireSlipDebug.module.css';

export interface TireSlipData {
  TireLF_RumblePitch: number;
  TireRF_RumblePitch: number;
  TireLR_RumblePitch: number;
  TireRR_RumblePitch: number;
}

interface TireSlipCellProps {
  slipValue: number;
  label: string;
}

function getSlipColor(slipValue: number): string {
  // Dynamically scale color based on slip value
  if (slipValue === 0) {
    return '#444444'; // Gray when no data
  }
  if (slipValue < 0.1) {
    return '#00cc00'; // Green - minimal slip
  }
  if (slipValue < 0.5) {
    return '#88cc00'; // Yellow-green
  }
  if (slipValue < 1.0) {
    return '#cccc00'; // Yellow
  }
  if (slipValue < 2.0) {
    return '#cc8800'; // Orange
  }
  return '#cc0000'; // Red - heavy slip
}

function TireSlipCell({ slipValue, label }: TireSlipCellProps) {
  // Scale the bar height - handle a wide range of values
  const barHeight = Math.min(Math.abs(slipValue) * 10, 100);
  const color = getSlipColor(Math.abs(slipValue));

  return (
    <div className={styles.tireCell}>
      <div className={styles.tireLabel}>{label}</div>
      <div className={styles.slipBarContainer}>
        <div
          className={styles.slipBar}
          style={{
            height: `${barHeight}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <div className={styles.slipValue}>{slipValue.toFixed(4)}</div>
    </div>
  );
}

export function TireSlipDebug({ slipData }: { slipData: TireSlipData }) {
  // Calculate some stats for debugging
  const allValues = [
    slipData.TireLF_RumblePitch,
    slipData.TireRF_RumblePitch,
    slipData.TireLR_RumblePitch,
    slipData.TireRR_RumblePitch,
  ];
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const hasAnyData = allValues.some((v) => v !== 0);

  return (
    <div className={styles.container}>
      <div className={styles.debugHeader}>
        <span className={styles.debugTitle}>Tire Slip Debug (RumblePitch)</span>
        <span
          className={styles.dataStatus}
          style={{ color: hasAnyData ? '#00cc00' : '#cc0000' }}
        >
          {hasAnyData ? '● DATA' : '○ NO DATA'}
        </span>
      </div>

      <div className={styles.tireSlipGrid}>
        <TireSlipCell label="FL" slipValue={slipData.TireLF_RumblePitch} />
        <TireSlipCell label="FR" slipValue={slipData.TireRF_RumblePitch} />
        <TireSlipCell label="RL" slipValue={slipData.TireLR_RumblePitch} />
        <TireSlipCell label="RR" slipValue={slipData.TireRR_RumblePitch} />
      </div>

      <div className={styles.debugInfo}>
        <div className={styles.debugRow}>
          <span>Min:</span>
          <span className={styles.debugValue}>{minValue.toFixed(4)}</span>
        </div>
        <div className={styles.debugRow}>
          <span>Max:</span>
          <span className={styles.debugValue}>{maxValue.toFixed(4)}</span>
        </div>
        <div className={styles.debugRow}>
          <span>Range:</span>
          <span className={styles.debugValue}>
            {(maxValue - minValue).toFixed(4)}
          </span>
        </div>
      </div>

      <div className={styles.rawValues}>
        <div className={styles.rawTitle}>Raw Values:</div>
        <div className={styles.rawRow}>
          LF: {slipData.TireLF_RumblePitch.toFixed(6)}
        </div>
        <div className={styles.rawRow}>
          RF: {slipData.TireRF_RumblePitch.toFixed(6)}
        </div>
        <div className={styles.rawRow}>
          LR: {slipData.TireLR_RumblePitch.toFixed(6)}
        </div>
        <div className={styles.rawRow}>
          RR: {slipData.TireRR_RumblePitch.toFixed(6)}
        </div>
      </div>
    </div>
  );
}
