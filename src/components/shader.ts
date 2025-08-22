import { shaderMaterial } from "@react-three/drei";
import { Texture } from "three";

export const TransitionMaterial = shaderMaterial(
  {
    uProgression: 0,
    uTex1: null as Texture | null,
    uTex2: null as Texture | null,
  },
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4( position, 1.0 );
    }`,
  /*glsl*/ `
    varying vec2 vUv;
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform float uProgression;

    void main() {
      vec2 uv = vUv;

      vec4 _texture = texture2D(uTex1, uv);
      vec4 _texture2 = texture2D(uTex2, uv);

      vec4 finalTexture = mix(_texture2, _texture, step(uProgression, uv.y));

      gl_FragColor = finalTexture;
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
);
