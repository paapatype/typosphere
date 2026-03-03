export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow={false}
      />
      <directionalLight
        position={[-3, 4, -5]}
        intensity={0.5}
        color="#e8e8ff"
      />
      <directionalLight
        position={[0, -3, 5]}
        intensity={0.25}
        color="#fff5e8"
      />
    </>
  );
}
