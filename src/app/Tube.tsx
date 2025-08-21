"use client";

import spline from "@/constants/spline";
import { Wireframe } from "@react-three/drei";
import { invalidate, useFrame, useThree } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import {
  BackSide,
  Vector3,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";
import { useMemo, useCallback, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

// GSAPプラグインを一度だけ登録
gsap.registerPlugin(ScrollTrigger);

// パフォーマンス定数
const POINT_COUNT = 500;
const TUBE_SEGMENTS = 130;
const TUBE_RADIUS = 0.65;
const TUBE_RADIAL_SEGMENTS = 16;
const CAMERA_SMOOTHING = 0.08;
const CAMERA_LOOK_AHEAD = 0.02;

export default function Tube() {
  const tubePath = useMemo(() => spline, []);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const progressRef = useRef(0);
  const goalProgressRef = useRef(0);
  const isInitializedRef = useRef(false);

  const pointPositions = useMemo(() => {
    return Array.from({ length: POINT_COUNT }, (_, index) => {
      const position = tubePath.getPointAt((index / POINT_COUNT) % 1);
      const offset = new Vector3(
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8
      );
      return position.clone().add(offset);
    });
  }, [tubePath]);

  const customGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(POINT_COUNT * 3);

    for (let i = 0; i < POINT_COUNT; i++) {
      const position = pointPositions[i];
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
    }

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geometry;
  }, [pointPositions]);

  // カメラの位置と向きを更新する関数を最適化
  const updateCamera = useCallback(
    (
      camera: { position: Vector3; lookAt: (target: Vector3) => void },
      progress: number
    ) => {
      try {
        const position = tubePath.getPointAt(progress);
        const nextT = (progress + CAMERA_LOOK_AHEAD) % 1;
        const lookAt = tubePath.getPointAt(nextT);

        camera.position.copy(position);
        camera.lookAt(lookAt);
      } catch (error) {
        console.warn("Camera update error:", error);
      }
    },
    [tubePath]
  );

  // 初期カメラ位置を設定
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    if (!isInitializedRef.current && camera) {
      updateCamera(camera, 0);
      isInitializedRef.current = true;
    }
  }, [camera, updateCamera]);

  // スクロールでgoalProgressを更新
  useGSAP(() => {
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: "#about",
      start: "top top",
      end: "bottom bottom",
      scrub: 2,
      onUpdate: (self) => {
        goalProgressRef.current = self.progress;
      },
      fastScrollEnd: true,
      preventOverlaps: true,
    });

    return () => {
      scrollTriggerRef.current?.kill();
    };
  }, []);

  // フレーム更新でprogressを更新,カメラ位置を更新
  useFrame(({ camera }) => {
    // カメラ位置の更新
    const goalProgress = goalProgressRef.current;
    let progress = progressRef.current;
    progress += (goalProgress - progress) * CAMERA_SMOOTHING;
    progressRef.current = progress;

    updateCamera(camera, progress);

    // レンダリング
    invalidate();
  });

  return (
    <>
      <color attach="background" args={["#000"]} />
      {/* 開発時のみパフォーマンスモニターを表示 */}
      {process.env.NODE_ENV === "development" && <Perf />}
      <ambientLight intensity={2.5} />
      <fog attach="fog" args={["#262626", 1, 6]} />

      <mesh>
        <tubeGeometry
          args={[tubePath, TUBE_SEGMENTS, TUBE_RADIUS, TUBE_RADIAL_SEGMENTS]}
        />
        <meshBasicMaterial
          color="#ffffff"
          side={BackSide}
          wireframe
          transparent
          opacity={0.8}
        />
        {/* <Wireframe
          simplify={false} // Remove some edges from wireframes
          stroke={"#ffffff"} // Color of the stroke
          strokeOpacity={1} // Opacity of the stroke
          thickness={0.001} // Thinkness of the lines
          colorBackfaces={true}
          backfaceStroke={"#ffffff"} // Color of the lines that are facing away from the camera
          squeeze={false} // Narrow the centers of each line segment
          squeezeMin={0.2} // Smallest width to squueze to
          squeezeMax={1} // Largest width to squeeze from
        /> */}
      </mesh>

      <points geometry={customGeometry}>
        <pointsMaterial
          size={0.04}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </>
  );
}
