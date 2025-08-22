import { extend, invalidate, useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import {
  Group,
  ShaderMaterial,
  WebGLRenderer,
  Scene,
  WebGLRenderTarget,
} from "three";
import { useFBO, PerspectiveCamera, CameraControls } from "@react-three/drei";
import { DEG2RAD } from "three/src/math/MathUtils.js";
import { TransitionMaterial } from "@/components/shader";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const TransitionMaterialComponent = extend(TransitionMaterial);

// パフォーマンス定数
const ANIMATION_DURATION = 3;

export default function Box() {
  const scene1 = useRef<Group>(null!);
  const scene2 = useRef<Group>(null!);

  // レンダーターゲットを最適化
  const renderTarget = useFBO(window.innerWidth, window.innerHeight);
  const renderTarget2 = useFBO(window.innerWidth, window.innerHeight);

  const renderMaterial = useRef<ShaderMaterial>(null!);
  const controls = useRef<CameraControls>(null!);
  const renderCamera = useRef(null!);

  const progressionTarget = useRef(0);

  const [renderingScene, setRenderingScene] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // カメラ制御の初期化を最適化
  useEffect(() => {
    controls.current.camera = renderCamera.current;
  }, []);

  // レンダリング処理を最適化
  const renderScene = useCallback(
    (
      gl: WebGLRenderer,
      scene: Scene,
      target: WebGLRenderTarget,
      sceneRef: React.RefObject<Group>
    ) => {
      gl.setRenderTarget(target);
      sceneRef.current.visible = true;
      gl.clear();
      gl.render(scene, renderCamera.current);
      sceneRef.current.visible = false;
      gl.setRenderTarget(null);
    },
    []
  );

  // フレーム更新を最適化
  useFrame(({ gl, scene }) => {
    invalidate();

    // プログレッション値を更新
    if (renderMaterial.current.uniforms.uProgression) {
      renderMaterial.current.uniforms.uProgression.value =
        progressionTarget.current;
    }

    if (isTransitioning) {
      // シーン1をレンダリング
      renderScene(gl, scene, renderTarget, scene1);

      // シーン2をレンダリング
      renderScene(gl, scene, renderTarget2, scene2);
    } else if (renderingScene === 0) {
      // シーン1をレンダリング
      renderScene(gl, scene, renderTarget, scene1);
    } else if (renderingScene === 1) {
      // シーン2をレンダリング
      renderScene(gl, scene, renderTarget2, scene2);
    }

    // レンダーターゲットをリセット
    gl.setRenderTarget(null);

    renderMaterial.current.uniforms.uTex1.value = renderTarget.texture;
    renderMaterial.current.uniforms.uTex2.value = renderTarget2.texture;
    renderMaterial.current.uniforms.uProgression.value =
      progressionTarget.current;
  });

  // アニメーションを最適化
  useGSAP(() => {
    const animation = gsap.to(progressionTarget, {
      current: 1,
      duration: ANIMATION_DURATION,
      ease: "power1.inOut",
      onStart: () => {
        setIsTransitioning(true);
      },
      onComplete: () => {
        // アニメーション完了後の処理
        console.log("Animation completed");
        setIsTransitioning(false);
        setRenderingScene(1);
      },
    });

    return () => {
      animation.kill(); // クリーンアップ
    };
  }, []);

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={1.5} />

      <PerspectiveCamera near={0.5} ref={renderCamera} />
      <CameraControls
        minPolarAngle={DEG2RAD * 70}
        maxPolarAngle={DEG2RAD * 85}
        minAzimuthAngle={DEG2RAD * -30}
        maxAzimuthAngle={DEG2RAD * 30}
        minDistance={5}
        maxDistance={9}
        ref={controls}
      />

      <mesh>
        <planeGeometry args={[2, 2]} />
        <TransitionMaterialComponent
          ref={renderMaterial}
          uTex={renderTarget.texture}
          uTex2={renderTarget2.texture}
          uProgression={progressionTarget.current}
        />
      </mesh>

      <scene ref={scene1}>
        <mesh position={[0, 0, -2]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial
            color="#4a90e2"
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>
      </scene>

      <scene ref={scene2}>
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
      </scene>
    </>
  );
}
