import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Sphere } from './Sphere';
import { Lighting } from './Lighting';
import { CameraRig } from './CameraRig';
import { TextBelt } from '../text/TextBelt';
import { FontLoader } from '../fonts/FontLoader';

export function Scene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.5, 6], fov: 45 }}
      gl={{ antialias: true, alpha: false, toneMapping: 4 }}
      style={{ background: '#808080' }}
    >
      <color attach="background" args={['#808080']} />
      <Lighting />
      <Environment preset="studio" resolution={2048} />
      <Sphere />
      <TextBelt />
      <CameraRig />
      <FontLoader />
    </Canvas>
  );
}
