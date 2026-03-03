import { useStore } from '../state/store';

export function InversionScrubber() {
  const setInversion = useStore((s) => s.setInversion);
  const inversion = useStore((s) => s.inversion);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        zIndex: 50,
      }}
    >
      <span
        style={{
          fontSize: 9,
          color: '#666',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontFamily: 'system-ui',
        }}
      >
        Inversion
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={inversion}
        onChange={(e) => setInversion(parseFloat(e.target.value))}
        style={{
          width: 120,
          height: 3,
          accentColor: '#888',
        }}
      />
      <span
        style={{
          fontSize: 9,
          color: '#888',
          fontVariantNumeric: 'tabular-nums',
          fontFamily: 'system-ui',
          minWidth: 28,
        }}
      >
        {(inversion * 100).toFixed(0)}%
      </span>
    </div>
  );
}
