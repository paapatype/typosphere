import { create } from 'zustand';
import type { Font } from 'opentype.js';

export interface FontDef {
  family: string;
  label: string;
  axes: { tag: string; min: number; max: number; default: number }[];
  cssUrl: string;
  fileUrl: string;
}

export const CURATED_FONTS: FontDef[] = [
  {
    family: 'Recursive',
    label: 'Recursive',
    axes: [
      { tag: 'wght', min: 300, max: 1000, default: 400 },
      { tag: 'CASL', min: 0, max: 1, default: 0 },
      { tag: 'CRSV', min: 0, max: 1, default: 0.5 },
      { tag: 'MONO', min: 0, max: 1, default: 0 },
    ],
    cssUrl:
      'https://fonts.googleapis.com/css2?family=Recursive:slnt,wght,CASL,CRSV,MONO@-15..0,300..1000,0..1,0..1,0..1&display=swap',
    fileUrl:
      'https://fonts.gstatic.com/s/recursive/v44/8vJN7wMr0mhh-RQChyHEH06TlXhq_gukbYrFMk1QuAIcyEwG_X-dpEfaE5YaERmK-CImKsvxvU-MXGX2fSqasNfUvz2xbXfn1uEQadCCk018.ttf',
  },
  {
    family: 'Fraunces',
    label: 'Fraunces',
    axes: [
      { tag: 'wght', min: 100, max: 900, default: 400 },
      { tag: 'SOFT', min: 0, max: 100, default: 0 },
      { tag: 'WONK', min: 0, max: 1, default: 0 },
      { tag: 'opsz', min: 9, max: 144, default: 14 },
    ],
    cssUrl:
      'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,100..900,0..100,0..1&display=swap',
    fileUrl:
      'https://fonts.gstatic.com/s/fraunces/v38/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIctxujDg.ttf',
  },
  {
    family: 'Anybody',
    label: 'Anybody',
    axes: [
      { tag: 'wght', min: 100, max: 900, default: 400 },
      { tag: 'wdth', min: 50, max: 150, default: 100 },
    ],
    cssUrl:
      'https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,100..900&display=swap',
    fileUrl:
      'https://fonts.gstatic.com/s/anybody/v13/VuJbdNvK2Ib2ppdWYq311GH32hxIv0sd5grncSUi2F_Wim4J12DPrg.ttf',
  },
  {
    family: 'Bricolage Grotesque',
    label: 'Bricolage Grotesque',
    axes: [
      { tag: 'wght', min: 200, max: 800, default: 400 },
      { tag: 'wdth', min: 75, max: 100, default: 100 },
      { tag: 'opsz', min: 12, max: 96, default: 14 },
    ],
    cssUrl:
      'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&display=swap',
    fileUrl:
      'https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvRviyM0.ttf',
  },
  {
    family: 'Instrument Serif',
    label: 'Instrument Serif',
    axes: [],
    cssUrl:
      'https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap',
    fileUrl:
      'https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-2zI.ttf',
  },
  {
    family: 'Syne',
    label: 'Syne',
    axes: [{ tag: 'wght', min: 400, max: 800, default: 400 }],
    cssUrl:
      'https://fonts.googleapis.com/css2?family=Syne:wght@400..800&display=swap',
    fileUrl:
      'https://fonts.gstatic.com/s/syne/v24/8vIS7w4qzmVxsWxjBZRjr0FKM_04uT6k.ttf',
  },
  {
    family: 'Space Grotesk',
    label: 'Space Grotesk',
    axes: [{ tag: 'wght', min: 300, max: 700, default: 400 }],
    cssUrl:
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap',
    fileUrl:
      'https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUUsj.ttf',
  },
];

export type MaterialPreset = 'matte' | 'metal' | 'glass' | 'plastic';

export const MATERIAL_PRESETS: { value: MaterialPreset; label: string }[] = [
  { value: 'matte', label: 'Matte' },
  { value: 'metal', label: 'Metal' },
  { value: 'glass', label: 'Glass' },
  { value: 'plastic', label: 'Plastic' },
];

export interface AppState {
  // Text
  text: string;
  fontIndex: number;
  axisValues: Record<string, number>;
  fontSize: number;
  letterSpacing: number;
  leading: number;
  lineCount: number;
  extrudeDepth: number;
  bevelSize: number;
  bevelEnabled: boolean;

  // Sphere
  sphereRadius: number;
  beltOffset: number;
  sphereMaterial: MaterialPreset;

  // Text material
  textMaterial: MaterialPreset;

  // Animation
  beltSpeed: number;
  cameraSpeed: number;
  playing: boolean;

  // Inversion
  inversion: number;
  lockContrast: boolean;

  // Font loading
  fontLoaded: boolean;
  fontObject: Font | null;

  // Actions
  setText: (t: string) => void;
  setFontIndex: (i: number) => void;
  setAxisValue: (tag: string, val: number) => void;
  setFontSize: (s: number) => void;
  setLetterSpacing: (s: number) => void;
  setLeading: (l: number) => void;
  setLineCount: (n: number) => void;
  setExtrudeDepth: (d: number) => void;
  setBevelSize: (s: number) => void;
  setBevelEnabled: (b: boolean) => void;
  setSphereRadius: (r: number) => void;
  setBeltOffset: (o: number) => void;
  setSphereMaterial: (m: MaterialPreset) => void;
  setTextMaterial: (m: MaterialPreset) => void;
  setBeltSpeed: (s: number) => void;
  setCameraSpeed: (s: number) => void;
  setPlaying: (p: boolean) => void;
  setInversion: (i: number) => void;
  setLockContrast: (b: boolean) => void;
  setFontLoaded: (b: boolean) => void;
  setFontObject: (f: Font | null) => void;

  // Presets
  exportPreset: () => string;
  importPreset: (json: string) => boolean;
}

const DEFAULT_TEXT = 'TYPOSPHERE — THE FUTURE OF TYPE IN SPACE — ';

export const useStore = create<AppState>((set, get) => ({
  text: DEFAULT_TEXT,
  fontIndex: 0,
  axisValues: {},
  fontSize: 0.35,
  letterSpacing: 0.02,
  leading: 0.5,
  lineCount: 3,
  extrudeDepth: 0.08,
  bevelSize: 0.008,
  bevelEnabled: true,

  sphereRadius: 2.0,
  beltOffset: 0.12,
  sphereMaterial: 'matte' as MaterialPreset,

  textMaterial: 'matte' as MaterialPreset,

  beltSpeed: 0.15,
  cameraSpeed: 0.2,
  playing: true,

  inversion: 0,
  lockContrast: true,

  fontLoaded: false,
  fontObject: null,

  setText: (t) => set({ text: t }),
  setFontIndex: (i) => set({ fontIndex: i, fontLoaded: false, fontObject: null, axisValues: {} }),
  setAxisValue: (tag, val) =>
    set((s) => ({ axisValues: { ...s.axisValues, [tag]: val } })),
  setFontSize: (s) => set({ fontSize: s }),
  setLetterSpacing: (s) => set({ letterSpacing: s }),
  setLeading: (l) => set({ leading: l }),
  setLineCount: (n) => set({ lineCount: n }),
  setExtrudeDepth: (d) => set({ extrudeDepth: d }),
  setBevelSize: (s) => set({ bevelSize: s }),
  setBevelEnabled: (b) => set({ bevelEnabled: b }),
  setSphereRadius: (r) => set({ sphereRadius: r }),
  setBeltOffset: (o) => set({ beltOffset: o }),
  setSphereMaterial: (m) => set({ sphereMaterial: m }),
  setTextMaterial: (m) => set({ textMaterial: m }),
  setBeltSpeed: (s) => set({ beltSpeed: s }),
  setCameraSpeed: (s) => set({ cameraSpeed: s }),
  setPlaying: (p) => set({ playing: p }),
  setInversion: (i) => set({ inversion: Math.max(0, Math.min(1, i)) }),
  setLockContrast: (b) => set({ lockContrast: b }),
  setFontLoaded: (b) => set({ fontLoaded: b }),
  setFontObject: (f) => set({ fontObject: f, fontLoaded: !!f }),

  exportPreset: () => {
    const s = get();
    const preset = {
      text: s.text,
      fontIndex: s.fontIndex,
      axisValues: s.axisValues,
      fontSize: s.fontSize,
      letterSpacing: s.letterSpacing,
      leading: s.leading,
      lineCount: s.lineCount,
      extrudeDepth: s.extrudeDepth,
      bevelSize: s.bevelSize,
      bevelEnabled: s.bevelEnabled,
      sphereRadius: s.sphereRadius,
      beltOffset: s.beltOffset,
      sphereMaterial: s.sphereMaterial,
      textMaterial: s.textMaterial,
      beltSpeed: s.beltSpeed,
      cameraSpeed: s.cameraSpeed,
      lockContrast: s.lockContrast,
    };
    const json = JSON.stringify(preset, null, 2);
    localStorage.setItem('typosphere-preset', json);
    return json;
  },

  importPreset: (json: string) => {
    try {
      const p = JSON.parse(json);
      set({
        text: p.text ?? DEFAULT_TEXT,
        fontIndex: p.fontIndex ?? 0,
        axisValues: p.axisValues ?? {},
        fontSize: p.fontSize ?? 0.35,
        letterSpacing: p.letterSpacing ?? 0.02,
        leading: p.leading ?? 0.5,
        lineCount: p.lineCount ?? 3,
        extrudeDepth: p.extrudeDepth ?? 0.08,
        bevelSize: p.bevelSize ?? 0.008,
        bevelEnabled: p.bevelEnabled ?? true,
        sphereRadius: p.sphereRadius ?? 2.0,
        beltOffset: p.beltOffset ?? 0.12,
        sphereMaterial: p.sphereMaterial ?? 'matte',
        textMaterial: p.textMaterial ?? 'matte',
        beltSpeed: p.beltSpeed ?? 0.15,
        cameraSpeed: p.cameraSpeed ?? 0.2,
        lockContrast: p.lockContrast ?? true,
        fontLoaded: false,
        fontObject: null,
      });
      localStorage.setItem('typosphere-preset', json);
      return true;
    } catch {
      return false;
    }
  },
}));

// Load preset from localStorage on init
try {
  const saved = localStorage.getItem('typosphere-preset');
  if (saved) {
    useStore.getState().importPreset(saved);
  }
} catch {
  // ignore
}
