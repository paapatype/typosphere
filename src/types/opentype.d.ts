declare module 'opentype.js' {
  interface PathCommand {
    type: 'M' | 'L' | 'Q' | 'C' | 'Z';
    x: number;
    y: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  interface Path {
    commands: PathCommand[];
  }

  interface Glyph {
    index: number;
    advanceWidth: number;
    getPath(x: number, y: number, fontSize: number): Path;
  }

  interface FontNames {
    fontFamily?: { en?: string };
  }

  interface Font {
    unitsPerEm: number;
    names: FontNames;
    charToGlyph(char: string): Glyph;
    getPath(
      text: string,
      x: number,
      y: number,
      fontSize: number,
      options?: Record<string, unknown>,
    ): Path;
    getAdvanceWidth(
      text: string,
      fontSize: number,
      options?: Record<string, unknown>,
    ): number;
  }

  export function load(url: string): Promise<Font>;
  export function parse(buffer: ArrayBuffer): Font;

  export type { Font, Glyph, Path, PathCommand, FontNames };
}
