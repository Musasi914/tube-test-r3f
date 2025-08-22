"use client";

import { Canvas, invalidate } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import Tube from "./Tube";
import Box from "./Box";
import About from "@/features/about/About";
import { Perf } from "r3f-perf";
import MainScene from "./MainScene";
import Scene1 from "./Scene1";
import Scene2 from "./Scene2";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// 3Dシーンのローディング状態
const SceneLoader = () => (
  <div className="fixed inset-0 -z-10 bg-black flex items-center justify-center">
    <div className="text-white text-lg">Initializing 3D Scene...</div>
  </div>
);

export default function Home() {
  return (
    <div>
      <div className="fixed inset-0 -z-10">
        <Suspense fallback={<SceneLoader />}>
          <Canvas
            camera={{ fov: 50, far: 70 }}
            eventSource={document.documentElement}
            eventPrefix="client"
            frameloop="demand"
            dpr={1}
          >
            {process.env.NODE_ENV === "development" && <Perf />}

            {/* {currentScene === "tube" && <Tube />} */}
            {/* <Tube /> */}
            {/* <Box /> */}
            <MainScene
              scene={[<Tube key="scene1" />, <Scene2 key="scene2" />]}
            />
          </Canvas>
        </Suspense>
      </div>
      <About />
    </div>
  );
}
