import styles from './tireTemp.module.css';

interface TireTempsProps {
  leftTemp: number;
  middleTemp: number;
  rightTemp: number;
  label: string;
}

function TireCell({ leftTemp, middleTemp, rightTemp, label }: TireTempsProps) {
  const formatTemp = (temp: number) => Math.round(temp);

  return (
    <div className={styles.tireCell}>
      <div className={styles.tireLabel}>{label}</div>
      <div className={styles.tempRow}>
        <div className={styles.tempColumn}>
          <div className={styles.columnHeader}>L</div>
          <div className={styles.tempValue}>{formatTemp(leftTemp)}°</div>
        </div>
        <div className={styles.tempColumn}>
          <div className={styles.columnHeader}>M</div>
          <div className={styles.tempValue}>{formatTemp(middleTemp)}°</div>
        </div>
        <div className={styles.tempColumn}>
          <div className={styles.columnHeader}>R</div>
          <div className={styles.tempValue}>{formatTemp(rightTemp)}°</div>
        </div>
      </div>
    </div>
  );
}

export interface TireTempData {
  LFtempCL: number;
  LFtempCM: number;
  LFtempCR: number;
  RFtempCL: number;
  RFtempCM: number;
  RFtempCR: number;
  LRtempCL: number;
  LRtempCM: number;
  LRtempCR: number;
  RRtempCL: number;
  RRtempCM: number;
  RRtempCR: number;
}

export function TireTemp({ temps }: { temps: TireTempData }) {
  return (
    <div className={styles.tireTempGrid}>
      <TireCell
        label="FL"
        leftTemp={temps.LFtempCL}
        middleTemp={temps.LFtempCM}
        rightTemp={temps.LFtempCR}
      />
      <TireCell
        label="FR"
        leftTemp={temps.RFtempCL}
        middleTemp={temps.RFtempCM}
        rightTemp={temps.RFtempCR}
      />
      <TireCell
        label="RL"
        leftTemp={temps.LRtempCL}
        middleTemp={temps.LRtempCM}
        rightTemp={temps.LRtempCR}
      />
      <TireCell
        label="RR"
        leftTemp={temps.RRtempCL}
        middleTemp={temps.RRtempCM}
        rightTemp={temps.RRtempCR}
      />
    </div>
  );
}
