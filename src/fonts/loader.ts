import { parse, type Font } from 'opentype.js';
import { CURATED_FONTS } from '../state/store';

const fontCache = new Map<string, Font>();

export async function loadFont(fontIndex: number): Promise<Font> {
  const def = CURATED_FONTS[fontIndex];
  if (!def) throw new Error(`Font index ${fontIndex} out of range`);

  const key = def.family;
  if (fontCache.has(key)) return fontCache.get(key)!;

  const response = await fetch(def.fileUrl);
  if (!response.ok) throw new Error(`Failed to fetch font: ${response.status}`);
  const buffer = await response.arrayBuffer();
  const font = parse(buffer);
  fontCache.set(key, font);
  return font;
}
