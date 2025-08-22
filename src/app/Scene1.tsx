import { PerspectiveCamera } from "@react-three/drei";

export default function Scene1() {
  return (
    <group>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      <mesh position={[0, 0, -2]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
}
