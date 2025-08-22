import { PerspectiveCamera } from "@react-three/drei";

export default function Scene2() {
  return (
    <group>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      <mesh position={[2, 0, -3]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="blue" />
      </mesh>
      <mesh position={[-2, 0, -3]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="green" />
      </mesh>
    </group>
  );
}
