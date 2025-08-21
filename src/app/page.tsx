"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import Tube from "./Tube";
import Box from "./Box";
import About from "@/features/about/About";

// 3Dシーンのローディング状態
const SceneLoader = () => (
  <div className="fixed inset-0 -z-10 bg-black flex items-center justify-center">
    <div className="text-white text-lg">Initializing 3D Scene...</div>
  </div>
);

export default function Home() {
  // const [currentScene, setCurrentScene] = useState<"tube" | "box">("tube");

  // // スクロール完了時の3Dシーン切り替え
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const aboutSection = document.getElementById("about");
  //     if (aboutSection) {
  //       const rect = aboutSection.getBoundingClientRect();
  //       const scrollProgress =
  //         (window.innerHeight - rect.top) / (rect.height - window.innerHeight);

  //       // スクロールが90%以上完了したらシーン切り替え
  //       if (scrollProgress >= 0.9 && currentScene === "tube") {
  //         setCurrentScene("box");
  //       }
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [currentScene]);

  return (
    <div>
      <div className="fixed inset-0 -z-10">
        <Suspense fallback={<SceneLoader />}>
          <Canvas
            camera={{ fov: 50, far: 70 }}
            eventSource={document.documentElement}
            eventPrefix="client"
            frameloop="demand"
          >
            {/* {currentScene === "tube" && <Tube />} */}
            <Tube />
          </Canvas>
        </Suspense>
      </div>
      <About />
    </div>
  );
}
