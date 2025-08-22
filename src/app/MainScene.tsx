import { extend, invalidate, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { TransitionMaterial } from "@/components/shader";
import { ShaderMaterial } from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RenderTexture } from "@react-three/drei";
import useStore from "@/store";

// TransitionMaterial を extend してコンポーネント化
const TransitionMaterialComponent = extend(TransitionMaterial);

export default function MainScene({ scene }: { scene: React.ReactNode[] }) {
  const materialRef = useRef<ShaderMaterial>(null!);
  const progress = useStore((state) => state.progress);

  useFrame(() => {
    invalidate();
    materialRef.current.uniforms.uProgression.value = progress;
  });

  return (
    <>
      <mesh>
        <planeGeometry args={[2, 2]} />
        <TransitionMaterialComponent ref={materialRef} uProgression={progress}>
          {scene.map((scene, index) => (
            <RenderTexture attach={`uTex${index + 1}`} key={index}>
              {scene}
            </RenderTexture>
          ))}
        </TransitionMaterialComponent>
      </mesh>
    </>
  );
}
