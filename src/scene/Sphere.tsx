import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useStore } from '../state/store';
import { createMaterial, updateMaterialColor } from './materials';

export function Sphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { sphereRadius, sphereMaterial: preset, inversion } = useStore();

  const material = useMemo(() => {
    const brightness = 1 - inversion * 0.95;
    const color = new THREE.Color(brightness, brightness, brightness);
    return createMaterial(preset, color);
  }, [preset, inversion]);

  // Update color on inversion change without rebuilding material
  useEffect(() => {
    const brightness = 1 - inversion * 0.95;
    updateMaterialColor(material, new THREE.Color(brightness, brightness, brightness));
  }, [inversion, material]);

  // Dispose old material on change
  useEffect(() => {
    return () => { material.dispose(); };
  }, [material]);

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[sphereRadius, 128, 128]} />
    </mesh>
  );
}
