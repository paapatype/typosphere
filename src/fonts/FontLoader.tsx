import { useEffect, useRef } from 'react';
import { useStore, CURATED_FONTS } from '../state/store';
import { loadFont } from './loader';

export function FontLoader() {
  const fontIndex = useStore((s) => s.fontIndex);
  const setFontObject = useStore((s) => s.setFontObject);
  const loadIdRef = useRef(0);

  useEffect(() => {
    const id = ++loadIdRef.current;
    const def = CURATED_FONTS[fontIndex];
    if (!def) return;

    console.log('[Typosphere] Loading font:', def.family);
    loadFont(fontIndex)
      .then((font) => {
        if (loadIdRef.current === id) {
          console.log('[Typosphere] Font loaded:', def.family);
          setFontObject(font);
        }
      })
      .catch((err) => {
        console.error('[Typosphere] Failed to load font:', err);
      });
  }, [fontIndex, setFontObject]);

  return null;
}
