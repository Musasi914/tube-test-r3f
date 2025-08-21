import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Mesh, Vector3, Color } from "three";
import { Points, Point } from "@react-three/drei";

export default function Box() {
  const boxRef = useRef<Mesh>(null);
  const groupRef = useRef<Mesh>(null);

  // パーティクルの位置を生成
  const particlePositions = useMemo(() => {
    return Array.from({ length: 200 }, () => {
      return new Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
    });
  }, []);

  const { camera } = useThree();
  camera.position.set(0, 0, 10);

  useFrame(({ camera }, delta) => {
    if (boxRef.current) {
      // ボックスの回転アニメーション
      boxRef.current.rotation.x += delta * 0.5;
      boxRef.current.rotation.y += delta * 0.8;
      boxRef.current.rotation.z += delta * 0.3;
    }

    if (groupRef.current) {
      // グループ全体の回転
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <>
      {/* 背景色を変更 */}
      <color attach="background" args={["#1a1a2e"]} />

      {/* 環境光を調整 */}
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#4a90e2" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#e24a90" />

      {/* フォグを調整 */}
      <fog attach="fog" args={["#1a1a2e", 5, 15]} />

      {/* メインのボックス */}
      <group ref={groupRef}>
        <mesh ref={boxRef} position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial
            color="#4a90e2"
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* 追加の装飾ボックス */}
        <mesh position={[4, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#e24a90"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>

        <mesh position={[-4, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#90e24a"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* パーティクルシステム */}
      <Points limit={200} range={200}>
        <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
        {particlePositions.map((position, index) => (
          <Point key={index} position={position} />
        ))}
      </Points>
    </>
  );
}
