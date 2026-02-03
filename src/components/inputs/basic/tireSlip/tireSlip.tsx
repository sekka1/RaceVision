import styles from './tireSlip.module.css';

interface TireWearCellProps {
  wearL: number;
  wearM: number;
  wearR: number;
  label: string;
}

function getWearColor(wearPercent: number): string {
  // wearPercent: 100 = new tire, 0 = fully worn
  if (wearPercent >= 80) {
    return '#00cc00'; // Green - good condition
  }
  if (wearPercent >= 60) {
    return '#88cc00'; // Yellow-green
  }
  if (wearPercent >= 40) {
    return '#cccc00'; // Yellow
  }
  if (wearPercent >= 20) {
    return '#cc8800'; // Orange
  }
  return '#cc0000'; // Red - worn out
}

function TireWearCell({ wearL, wearM, wearR, label }: TireWearCellProps) {
  // Convert wear values to percentages (1 = 100%, 0 = 0%)
  const leftPercent = wearL * 100;
  const middlePercent = wearM * 100;
  const rightPercent = wearR * 100;
  const avgPercent = (leftPercent + middlePercent + rightPercent) / 3;

  return (
    <div className={styles.tireCell}>
      <div className={styles.tireLabel}>{label}</div>
      <div className={styles.wearBarsContainer}>
        <div className={styles.wearColumn}>
          <div className={styles.columnHeader}>L</div>
          <div className={styles.wearBarOuter}>
            <div
              className={styles.wearBar}
              style={{
                height: `${leftPercent}%`,
                backgroundColor: getWearColor(leftPercent),
              }}
            />
          </div>
        </div>
        <div className={styles.wearColumn}>
          <div className={styles.columnHeader}>M</div>
          <div className={styles.wearBarOuter}>
            <div
              className={styles.wearBar}
              style={{
                height: `${middlePercent}%`,
                backgroundColor: getWearColor(middlePercent),
              }}
            />
          </div>
        </div>
        <div className={styles.wearColumn}>
          <div className={styles.columnHeader}>R</div>
          <div className={styles.wearBarOuter}>
            <div
              className={styles.wearBar}
              style={{
                height: `${rightPercent}%`,
                backgroundColor: getWearColor(rightPercent),
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.wearValue}>{avgPercent.toFixed(0)}%</div>
    </div>
  );
}

export interface TireWearData {
  LFwearL: number;
  LFwearM: number;
  LFwearR: number;
  RFwearL: number;
  RFwearM: number;
  RFwearR: number;
  LRwearL: number;
  LRwearM: number;
  LRwearR: number;
  RRwearL: number;
  RRwearM: number;
  RRwearR: number;
}

export function TireWear({ wearData }: { wearData: TireWearData }) {
  return (
    <div className={styles.tireSlipGrid}>
      <TireWearCell
        label="FL"
        wearL={wearData.LFwearL}
        wearM={wearData.LFwearM}
        wearR={wearData.LFwearR}
      />
      <TireWearCell
        label="FR"
        wearL={wearData.RFwearL}
        wearM={wearData.RFwearM}
        wearR={wearData.RFwearR}
      />
      <TireWearCell
        label="RL"
        wearL={wearData.LRwearL}
        wearM={wearData.LRwearM}
        wearR={wearData.LRwearR}
      />
      <TireWearCell
        label="RR"
        wearL={wearData.RRwearL}
        wearM={wearData.RRwearM}
        wearR={wearData.RRwearR}
      />
    </div>
  );
}
