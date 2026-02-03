import { useState } from 'react';
import { useDraggable, useOpacity, useTitle } from '../../hooks/document';
import { useTelemetry } from '../../hooks/iracing';

interface TireSlipValues {
  LF: number;
  RF: number;
  LR: number;
  RR: number;
}

function getSlipColor(slip: number): string {
  const absSlip = Math.abs(slip);
  if (absSlip < 2) return '#00cc00'; // Green - minimal slip
  if (absSlip < 5) return '#88cc00'; // Yellow-green
  if (absSlip < 10) return '#cccc00'; // Yellow
  if (absSlip < 20) return '#ff8800'; // Orange
  return '#ff0000'; // Red - heavy slip
}

function TireCell({ label, slip }: { label: string; slip: number }) {
  const color = getSlipColor(slip);
  const barHeight = Math.min(Math.abs(slip) * 2, 100);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5px',
        minWidth: '60px',
      }}
    >
      <div style={{ color: '#aaa', fontSize: '10px', marginBottom: '3px' }}>
        {label}
      </div>
      <div
        style={{
          width: '40px',
          height: '50px',
          backgroundColor: '#222',
          borderRadius: '3px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${barHeight}%`,
            backgroundColor: color,
            transition: 'height 0.1s, background-color 0.1s',
          }}
        />
      </div>
      <div
        style={{
          color,
          fontSize: '11px',
          fontWeight: 'bold',
          marginTop: '3px',
        }}
      >
        {slip.toFixed(1)}%
      </div>
    </div>
  );
}

export default function TireSlipOverlayApp() {
  useTitle('Tire Slip');
  useDraggable();
  useOpacity();

  const telemetryInfo = useTelemetry();
  const [mode, setMode] = useState<'slip' | 'debug'>('slip');

  // Get telemetry values
  const values = (telemetryInfo?.values ?? {}) as Record<string, unknown>;

  // Calculate slip from wheel speeds vs car speed
  // Wheel speeds are in rad/s, need to convert based on tire radius
  // Speed is in m/s
  const speed = (values.Speed as number) ?? 0;
  const speedMph = speed * 2.237;

  // Get wheel speeds (rad/s) - these exist in iRacing telemetry
  const lfSpeed = (values.LFspd as number) ?? 0;
  const rfSpeed = (values.RFspd as number) ?? 0;
  const lrSpeed = (values.LRspd as number) ?? 0;
  const rrSpeed = (values.RRspd as number) ?? 0;

  // Tire radius approximately 0.33m for most cars
  // Wheel linear speed = angular speed * radius
  const tireRadius = 0.33;
  const lfLinear = lfSpeed * tireRadius;
  const rfLinear = rfSpeed * tireRadius;
  const lrLinear = lrSpeed * tireRadius;
  const rrLinear = rrSpeed * tireRadius;

  // Calculate slip percentage: (wheel speed - car speed) / car speed * 100
  // Positive = wheel spinning faster (wheelspin), Negative = wheel slower (lockup)
  const minSpeed = 2; // Minimum speed threshold (m/s) to avoid division issues
  const calcSlip = (wheelSpeed: number) => {
    if (speed < minSpeed) return 0;
    return ((wheelSpeed - speed) / speed) * 100;
  };

  const slipValues: TireSlipValues = {
    LF: calcSlip(lfLinear),
    RF: calcSlip(rfLinear),
    LR: calcSlip(lrLinear),
    RR: calcSlip(rrLinear),
  };

  // Also get lateral acceleration for context
  const latAccel = (values.LatAccel as number) ?? 0;
  const longAccel = (values.LongAccel as number) ?? 0;
  const yawRate = (values.YawRate as number) ?? 0;

  const hasData = Object.keys(values).length > 0;
  const isOnTrack = values.IsOnTrack as boolean;

  if (mode === 'debug') {
    return (
      <div
        className="overlayWindow roundedOverlayWindow overlayDefaultBackgroundColor"
        style={{ padding: '10px', fontSize: '10px', minWidth: '280px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <span style={{ fontWeight: 'bold', color: '#fff' }}>Debug Mode</span>
          <button
            type="button"
            onClick={() => setMode('slip')}
            style={{
              background: '#444',
              border: 'none',
              color: '#fff',
              padding: '2px 8px',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            Slip View
          </button>
        </div>
        <div style={{ fontFamily: 'monospace', lineHeight: '1.4' }}>
          <div>Speed: {speedMph.toFixed(1)} mph</div>
          <div>OnTrack: {isOnTrack ? 'YES' : 'NO'}</div>
          <div
            style={{
              marginTop: '5px',
              borderTop: '1px solid #444',
              paddingTop: '5px',
            }}
          >
            <div>
              LFspd: {lfSpeed.toFixed(2)} rad/s →{' '}
              {(lfLinear * 2.237).toFixed(1)} mph
            </div>
            <div>
              RFspd: {rfSpeed.toFixed(2)} rad/s →{' '}
              {(rfLinear * 2.237).toFixed(1)} mph
            </div>
            <div>
              LRspd: {lrSpeed.toFixed(2)} rad/s →{' '}
              {(lrLinear * 2.237).toFixed(1)} mph
            </div>
            <div>
              RRspd: {rrSpeed.toFixed(2)} rad/s →{' '}
              {(rrLinear * 2.237).toFixed(1)} mph
            </div>
          </div>
          <div
            style={{
              marginTop: '5px',
              borderTop: '1px solid #444',
              paddingTop: '5px',
            }}
          >
            <div>LatAccel: {latAccel.toFixed(2)} m/s²</div>
            <div>LongAccel: {longAccel.toFixed(2)} m/s²</div>
            <div>YawRate: {(yawRate * 57.3).toFixed(1)} °/s</div>
          </div>
        </div>
        <div id="draggableWrapper" style={{ marginTop: '5px', color: '#666' }}>
          drag to move
        </div>
      </div>
    );
  }

  return (
    <div
      className="overlayWindow roundedOverlayWindow overlayDefaultBackgroundColor"
      style={{ padding: '8px', minWidth: '200px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '5px',
        }}
      >
        <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '12px' }}>
          Tire Slip
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#888', fontSize: '10px' }}>
            {speedMph.toFixed(0)} mph
          </span>
          <button
            type="button"
            onClick={() => setMode('debug')}
            style={{
              background: '#333',
              border: 'none',
              color: '#888',
              padding: '2px 6px',
              cursor: 'pointer',
              borderRadius: '3px',
              fontSize: '9px',
            }}
          >
            DBG
          </button>
        </div>
      </div>

      {!hasData || !isOnTrack ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
          {hasData ? 'Not on track' : 'No telemetry'}
        </div>
      ) : (
        <div>
          {/* 2x2 grid of tires */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TireCell label="FL" slip={slipValues.LF} />
            <TireCell label="FR" slip={slipValues.RF} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TireCell label="RL" slip={slipValues.LR} />
            <TireCell label="RR" slip={slipValues.RR} />
          </div>

          {/* G-force indicator */}
          <div
            style={{
              marginTop: '8px',
              padding: '5px',
              backgroundColor: '#1a1a1a',
              borderRadius: '3px',
              fontSize: '10px',
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <span>
              Lat:{' '}
              <span style={{ color: Math.abs(latAccel) > 5 ? '#ff0' : '#0f0' }}>
                {(latAccel / 9.81).toFixed(2)}G
              </span>
            </span>
            <span>
              Long:{' '}
              <span
                style={{ color: Math.abs(longAccel) > 5 ? '#ff0' : '#0f0' }}
              >
                {(longAccel / 9.81).toFixed(2)}G
              </span>
            </span>
          </div>
        </div>
      )}

      <div
        id="draggableWrapper"
        style={{
          marginTop: '5px',
          color: '#444',
          fontSize: '9px',
          textAlign: 'center',
        }}
      >
        + spin / − lock
      </div>
    </div>
  );
}
