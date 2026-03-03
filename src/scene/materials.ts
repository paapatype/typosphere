import * as THREE from 'three';
import type { MaterialPreset } from '../state/store';

/**
 * Create a Three.js material from a preset name and base color.
 * Metal and glass use MeshPhysicalMaterial for high-quality reflections.
 */
export function createMaterial(
  preset: MaterialPreset,
  color: THREE.Color,
): THREE.Material {
  switch (preset) {
    case 'metal':
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.03,
        metalness: 1.0,
        reflectivity: 1.0,
        envMapIntensity: 1.5,
      });

    case 'glass':
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.0,
        metalness: 0.0,
        transmission: 0.95,
        thickness: 0.5,
        ior: 1.5,
        reflectivity: 0.5,
        envMapIntensity: 1.2,
        transparent: true,
      });

    case 'plastic':
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.25,
        metalness: 0.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.5,
        envMapIntensity: 0.8,
      });

    case 'matte':
    default:
      return new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.05,
      });
  }
}

/**
 * Update a material's color in place (avoids full rebuild).
 */
export function updateMaterialColor(
  material: THREE.Material,
  color: THREE.Color,
): void {
  if ('color' in material) {
    (material as THREE.MeshStandardMaterial).color.copy(color);
  }
}
