import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import Loader from "../Common/Loader";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { CircleGeometry } from "three";

extend({ CircleGeometry });

const VinylPlayer = () => {
  const vinyl = useGLTF("/Models/vinyl_player_pioneer/scene.gltf");

  return (
    <mesh>
      <hemisphereLight intensity={1.5} groundColor="black" />
      <pointLight intensity={1} />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <primitive
        object={vinyl.scene}
        scale={2.5} // ⬅️ Big
        position={[0, -.5, 0]} // ⬅️ Centered nicely
        rotation={[0, Math.PI, 0]}
      />
    </mesh>
  );
};

const VinylCanvas = () => {
  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{ position: [0, 2, 6], fov: 20 }} // ⬅️ Zoomed in
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<Loader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <VinylPlayer />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default VinylCanvas;
