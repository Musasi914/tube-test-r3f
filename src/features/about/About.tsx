"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// アニメーション定数
const ANIMATION_DURATION = 1.2;
const ANIMATION_EASE = "power3.out";
const SCROLL_SCRUB = 1.5;

export default function About() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // アニメーション設定を最適化
  const setupAnimations = useCallback(() => {
    if (!wrapperRef.current || !titleRef.current || !textRef.current) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: SCROLL_SCRUB,
        // パフォーマンス向上のための設定
        fastScrollEnd: true,
        preventOverlaps: true,
      },
    });

    // より魅力的なアニメーション
    timeline
      .from(titleRef.current, {
        skewX: 25,
        y: 100,
        opacity: 0,
        duration: ANIMATION_DURATION,
        ease: ANIMATION_EASE,
      })
      .from(
        textRef.current,
        {
          skewY: 15,
          y: 50,
          opacity: 0,
          duration: ANIMATION_DURATION,
          ease: ANIMATION_EASE,
        },
        "-=0.8"
      ); // アニメーションの重複を調整

    return timeline;
  }, []);

  useGSAP(() => {
    const timeline = setupAnimations();

    // クリーンアップ関数を返す
    return () => {
      timeline?.kill();
    };
  }, [setupAnimations]);

  return (
    <main className="text-white" role="main">
      <section
        ref={wrapperRef}
        className="h-[500vh] w-full relative"
        id="about"
        aria-labelledby="about-title"
      >
        <div className="fixed grid justify-center content-center w-full h-screen px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1
              ref={titleRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
              id="about-title"
            >
              About
            </h1>
            <p
              ref={textRef}
              className="text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-gray-200"
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
              esse sed illum veniam ipsa! Labore enim repellendus mollitia eum
              voluptates necessitatibus non! Distinctio suscipit iste,
              consequatur dignissimos debitis officia ab.
            </p>

            {/* スクロールインジケーター */}
            <div className="mt-8 sm:mt-12 opacity-60">
              <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/60 rounded-full mx-auto relative">
                <div className="w-0.5 h-2 sm:w-1 sm:h-3 bg-white/80 rounded-full mx-auto mt-1.5 sm:mt-2 animate-bounce"></div>
              </div>
              <p className="text-xs sm:text-sm mt-2 text-gray-300">
                Scroll to explore
              </p>
            </div>
          </div>
        </div>

        {/* 背景装飾要素 - レスポンシブ対応 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 sm:w-32 sm:h-32 border border-white/10 rounded-full opacity-30"></div>
          <div className="absolute bottom-1/4 right-1/4 w-16 h-16 sm:w-24 sm:h-24 border border-white/5 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 border border-white/5 rounded-full opacity-10"></div>
        </div>

        {/* 追加の装飾要素 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </section>
    </main>
  );
}
