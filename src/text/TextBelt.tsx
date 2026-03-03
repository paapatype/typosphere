import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../state/store';
import { getGlyphGeometry } from './glyphGeometry';
import { createMaterial, updateMaterialColor } from '../scene/materials';

export function TextBelt() {
  const groupRef = useRef<THREE.Group>(null);

  const {
    text,
    fontObject,
    fontSize,
    letterSpacing,
    leading,
    lineCount,
    extrudeDepth,
    bevelSize,
    bevelEnabled,
    sphereRadius,
    beltOffset,
    beltSpeed,
    playing,
    inversion,
    lockContrast,
    textMaterial: preset,
  } = useStore();

  // Compute glyph data for the text
  const glyphData = useMemo(() => {
    if (!fontObject || !text) return null;

    const chars = text.split('');
    const glyphs: {
      char: string;
      geometry: THREE.ExtrudeGeometry | null;
      advanceWidth: number;
    }[] = [];

    for (const char of chars) {
      if (char === ' ') {
        const spaceWidth = fontSize * 0.3;
        glyphs.push({
          char,
          geometry: null,
          advanceWidth: spaceWidth + letterSpacing,
        });
      } else {
        const result = getGlyphGeometry(
          fontObject,
          char,
          fontSize,
          extrudeDepth,
          bevelSize,
          bevelEnabled,
        );
        if (result) {
          glyphs.push({
            char,
            geometry: result.geometry,
            advanceWidth: result.advanceWidth + letterSpacing,
          });
        }
      }
    }

    return glyphs;
  }, [fontObject, text, fontSize, letterSpacing, extrudeDepth, bevelSize, bevelEnabled]);

  // Build ring layout — each line follows the sphere surface at its latitude
  const rings = useMemo(() => {
    if (!glyphData || glyphData.length === 0) return [];

    const totalTextWidth = glyphData.reduce((sum, g) => sum + g.advanceWidth, 0);
    if (totalTextWidth <= 0) return [];

    const ringsArray: THREE.Group[] = [];
    const R = sphereRadius + beltOffset;

    for (let lineIdx = 0; lineIdx < lineCount; lineIdx++) {
      const t = (lineIdx - (lineCount - 1) / 2) * leading;
      const latitude = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, t / R));

      const y = Math.sin(latitude) * R;
      const ringR = Math.cos(latitude) * R;

      if (ringR < 0.1) continue;

      const circumference = 2 * Math.PI * ringR;
      const copies = Math.max(1, Math.ceil(circumference / totalTextWidth));

      const ring = new THREE.Group();
      ring.position.y = y;

      let angle = 0;
      if (lineIdx % 2 === 1) {
        angle = Math.PI / copies;
      }

      for (let copy = 0; copy < copies; copy++) {
        for (const glyph of glyphData) {
          const arcLength = glyph.advanceWidth;
          const dAngle = arcLength / ringR;

          if (glyph.char !== ' ' && glyph.geometry) {
            const glyphGroup = new THREE.Group();
            const midAngle = angle + dAngle / 2;

            const x = Math.sin(midAngle) * ringR;
            const z = Math.cos(midAngle) * ringR;
            glyphGroup.position.set(x, 0, z);
            glyphGroup.rotation.y = midAngle;

            const mesh = new THREE.Mesh(glyph.geometry);
            mesh.scale.set(1, -1, 1);
            mesh.position.z = -extrudeDepth / 2;

            glyphGroup.add(mesh);
            ring.add(glyphGroup);
          }

          angle += dAngle;
        }
      }

      ringsArray.push(ring);
    }

    return ringsArray;
  }, [glyphData, sphereRadius, beltOffset, lineCount, leading, extrudeDepth]);

  // Material — rebuild when preset changes, update color on inversion
  const material = useMemo(() => {
    const brightness = lockContrast
      ? inversion * 0.95 + 0.05
      : 0.1;
    return createMaterial(preset, new THREE.Color(brightness, brightness, brightness));
  }, [preset, inversion, lockContrast]);

  useEffect(() => {
    const brightness = lockContrast
      ? inversion * 0.95 + 0.05
      : 0.1;
    updateMaterialColor(material, new THREE.Color(brightness, brightness, brightness));
  }, [inversion, lockContrast, material]);

  useEffect(() => {
    return () => { material.dispose(); };
  }, [material]);

  // Apply material to all meshes in rings
  useEffect(() => {
    for (const ring of rings) {
      ring.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
    }
  }, [rings, material]);

  // Add rings to group
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    for (const ring of rings) {
      group.add(ring);
    }

    return () => {
      while (group.children.length > 0) {
        group.remove(group.children[0]);
      }
    };
  }, [rings]);

  // Belt rotation animation
  useFrame((_, delta) => {
    if (!groupRef.current || !playing) return;
    groupRef.current.rotation.y += delta * beltSpeed;
  });

  return <group ref={groupRef} />;
}
