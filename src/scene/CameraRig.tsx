import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useStore } from '../state/store';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const tiltRef = useRef(0);

  useFrame((_, delta) => {
    const { cameraSpeed, playing } = useStore.getState();
    const controls = controlsRef.current;
    if (!controls) return;

    // Auto-rotate is built into OrbitControls — user can still drag anytime
    controls.autoRotate = playing && cameraSpeed > 0;
    controls.autoRotateSpeed = cameraSpeed * 2;

    // Subtle tilt oscillation on the look-at target
    if (playing) {
      tiltRef.current += delta * cameraSpeed;
      controls.target.y = Math.sin(tiltRef.current * 0.3) * 0.15;
    }

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      enablePan={false}
      minDistance={0}
      maxDistance={100}
    />
  );
}
