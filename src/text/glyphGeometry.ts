import * as THREE from 'three';
import type { Font, Path } from 'opentype.js';

interface GlyphGeoResult {
  geometry: THREE.ExtrudeGeometry;
  advanceWidth: number;
}

const geoCache = new Map<string, GlyphGeoResult>();

interface ContourInfo {
  shape: THREE.Shape;
  absArea: number;
  points: THREE.Vector2[];
}

function pathToShapes(path: Path): THREE.Shape[] {
  // 1. Split path commands into individual contours
  const contours: THREE.Shape[] = [];
  let current: THREE.Shape | null = null;

  for (const cmd of path.commands) {
    switch (cmd.type) {
      case 'M':
        current = new THREE.Shape();
        current.moveTo(cmd.x, cmd.y);
        contours.push(current);
        break;
      case 'L':
        current?.lineTo(cmd.x, cmd.y);
        break;
      case 'Q':
        current?.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
        break;
      case 'C':
        current?.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        break;
      case 'Z':
        current?.closePath();
        break;
    }
  }

  if (contours.length === 0) return [];
  if (contours.length === 1) return contours;

  // 2. Compute area and sample points for each contour
  const infos: ContourInfo[] = contours.map((shape) => {
    const points = shape.getPoints(20);
    const area = THREE.ShapeUtils.area(points);
    return { shape, absArea: Math.abs(area), points };
  });

  // 3. Sort by area descending — largest contours are outer shapes
  infos.sort((a, b) => b.absArea - a.absArea);

  // 4. Use containment to assign holes: smaller contours inside larger ones are holes
  const assigned = new Set<number>();
  const result: THREE.Shape[] = [];

  for (let i = 0; i < infos.length; i++) {
    if (assigned.has(i)) continue;

    // This is an outer shape (largest unassigned)
    const outer = infos[i];
    result.push(outer.shape);
    // Clear any pre-existing holes
    outer.shape.holes = [];

    // Check all smaller contours for containment
    for (let j = i + 1; j < infos.length; j++) {
      if (assigned.has(j)) continue;

      const inner = infos[j];
      // Test if inner's first point is inside outer
      const testPt = inner.points[0];
      if (testPt && isPointInPolygon(testPt, outer.points)) {
        outer.shape.holes.push(inner.shape);
        assigned.add(j);
      }
    }
  }

  return result;
}

function isPointInPolygon(
  point: THREE.Vector2,
  polygon: THREE.Vector2[],
): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x,
      yi = polygon[i].y;
    const xj = polygon[j].x,
      yj = polygon[j].y;
    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// WeakMap to assign unique IDs to font instances
let nextFontId = 0;
const fontIdMap = new WeakMap<Font, number>();
function getFontId(font: Font): number {
  let id = fontIdMap.get(font);
  if (id === undefined) {
    id = nextFontId++;
    fontIdMap.set(font, id);
  }
  return id;
}

export function getGlyphGeometry(
  font: Font,
  char: string,
  fontSize: number,
  extrudeDepth: number,
  bevelSize: number,
  bevelEnabled: boolean,
): GlyphGeoResult | null {
  const cacheKey = `f${getFontId(font)}-${char}-${fontSize}-${extrudeDepth}-${bevelSize}-${bevelEnabled}`;

  if (geoCache.has(cacheKey)) return geoCache.get(cacheKey)!;

  const scale = fontSize / font.unitsPerEm;
  const path = font.getPath(char, 0, 0, font.unitsPerEm);

  if (!path.commands || path.commands.length === 0) return null;

  const shapes = pathToShapes(path);
  if (shapes.length === 0) return null;

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: extrudeDepth / scale,
    bevelEnabled,
    bevelThickness: bevelEnabled ? bevelSize / scale : 0,
    bevelSize: bevelEnabled ? bevelSize / scale : 0,
    bevelSegments: bevelEnabled ? 2 : 0,
    curveSegments: 6,
  };

  try {
    const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
    geometry.scale(scale, scale, scale);
    geometry.computeVertexNormals();

    const advanceWidth = font.getAdvanceWidth(char, font.unitsPerEm) * scale;

    const result: GlyphGeoResult = { geometry, advanceWidth };
    geoCache.set(cacheKey, result);
    return result;
  } catch {
    return null;
  }
}

export function clearGeoCache(): void {
  for (const [, v] of geoCache) {
    v.geometry.dispose();
  }
  geoCache.clear();
}
