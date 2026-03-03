import { useState, useCallback } from 'react';
import { useStore, CURATED_FONTS, MATERIAL_PRESETS, type MaterialPreset } from '../state/store';
import './Panel.css';

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="control-row">
      <label>
        <span className="label-text">{label}</span>
        <span className="label-value">{typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

export function Panel() {
  const store = useStore();
  const [presetJson, setPresetJson] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const currentFont = CURATED_FONTS[store.fontIndex];

  const handleCopyPreset = useCallback(() => {
    const json = store.exportPreset();
    navigator.clipboard.writeText(json).catch(() => {});
    setPresetJson(json);
  }, [store]);

  const handlePastePreset = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const success = store.importPreset(text);
      if (!success) alert('Invalid preset JSON');
    } catch {
      // Fallback: use textarea
      const text = prompt('Paste preset JSON:');
      if (text) {
        const success = store.importPreset(text);
        if (!success) alert('Invalid preset JSON');
      }
    }
  }, [store]);

  return (
    <div className={`panel ${collapsed ? 'collapsed' : ''}`}>
      <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '◂' : '▸'}
      </button>

      {!collapsed && (
        <div className="panel-inner">
          <h2>Typosphere</h2>

          <section>
            <h3>Text</h3>
            <textarea
              className="text-input"
              value={store.text}
              onChange={(e) => store.setText(e.target.value)}
              rows={2}
            />
          </section>

          <section>
            <h3>Typography</h3>
            <div className="control-row">
              <label>
                <span className="label-text">Font</span>
              </label>
              <select
                value={store.fontIndex}
                onChange={(e) => store.setFontIndex(parseInt(e.target.value))}
              >
                {CURATED_FONTS.map((f, i) => (
                  <option key={f.family} value={i}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <Slider
              label="Size"
              value={store.fontSize}
              min={0.1}
              max={1.0}
              step={0.01}
              onChange={store.setFontSize}
            />
            <Slider
              label="Letter Spacing"
              value={store.letterSpacing}
              min={-0.05}
              max={0.2}
              step={0.005}
              onChange={store.setLetterSpacing}
            />
            <Slider
              label="Leading"
              value={store.leading}
              min={0.2}
              max={1.5}
              step={0.01}
              onChange={store.setLeading}
            />
            <Slider
              label="Lines"
              value={store.lineCount}
              min={1}
              max={24}
              step={1}
              onChange={store.setLineCount}
            />
          </section>

          <section>
            <h3>Extrusion</h3>
            <Slider
              label="Depth"
              value={store.extrudeDepth}
              min={0.01}
              max={0.3}
              step={0.005}
              onChange={store.setExtrudeDepth}
            />
            <Slider
              label="Bevel"
              value={store.bevelSize}
              min={0}
              max={0.03}
              step={0.001}
              onChange={store.setBevelSize}
            />
            <div className="control-row checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={store.bevelEnabled}
                  onChange={(e) => store.setBevelEnabled(e.target.checked)}
                />
                <span className="label-text">Bevel</span>
              </label>
            </div>
          </section>

          <section>
            <h3>Materials</h3>
            <div className="control-row">
              <label>
                <span className="label-text">Sphere</span>
              </label>
              <select
                value={store.sphereMaterial}
                onChange={(e) => store.setSphereMaterial(e.target.value as MaterialPreset)}
              >
                {MATERIAL_PRESETS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-row">
              <label>
                <span className="label-text">Text</span>
              </label>
              <select
                value={store.textMaterial}
                onChange={(e) => store.setTextMaterial(e.target.value as MaterialPreset)}
              >
                {MATERIAL_PRESETS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section>
            <h3>Sphere</h3>
            <Slider
              label="Radius"
              value={store.sphereRadius}
              min={1}
              max={4}
              step={0.05}
              onChange={store.setSphereRadius}
            />
            <Slider
              label="Belt Offset"
              value={store.beltOffset}
              min={0.02}
              max={0.5}
              step={0.01}
              onChange={store.setBeltOffset}
            />
          </section>

          <section>
            <h3>Animation</h3>
            <div className="control-row">
              <button
                className="play-btn"
                onClick={() => store.setPlaying(!store.playing)}
              >
                {store.playing ? '⏸ Pause' : '▶ Play'}
              </button>
            </div>
            <Slider
              label="Belt Speed"
              value={store.beltSpeed}
              min={0}
              max={1}
              step={0.01}
              onChange={store.setBeltSpeed}
            />
            <Slider
              label="Camera Speed"
              value={store.cameraSpeed}
              min={0}
              max={1}
              step={0.01}
              onChange={store.setCameraSpeed}
            />
          </section>

          <section>
            <h3>Inversion</h3>
            <Slider
              label="Amount"
              value={store.inversion}
              min={0}
              max={1}
              step={0.01}
              onChange={store.setInversion}
            />
            <div className="control-row checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={store.lockContrast}
                  onChange={(e) => store.setLockContrast(e.target.checked)}
                />
                <span className="label-text">Lock Contrast</span>
              </label>
            </div>
            <p className="hint">Scroll anywhere on the page to control inversion</p>
          </section>

          <section>
            <h3>Presets</h3>
            <div className="preset-btns">
              <button onClick={handleCopyPreset}>Copy JSON</button>
              <button onClick={handlePastePreset}>Paste JSON</button>
            </div>
            {presetJson && (
              <textarea
                className="preset-display"
                value={presetJson}
                readOnly
                rows={4}
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
