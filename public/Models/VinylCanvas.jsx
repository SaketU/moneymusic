// VinylCanvas.jsx (or wherever you're defining this)
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import Loader from "../Common/Loader";


const VinylPlayer = ({ isMobile }) => {
  const vinyl = useGLTF("/models/vinyl_player_pioneer/scene.gltf");

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
        scale={isMobile ? 0.3 : 0.5}
        position={isMobile ? [0, -3.5, -1.5] : [0, -3, -1.25]}
        rotation={[0, Math.PI, 0]} // flip 180° if it's facing backwards
      />
    </mesh>
  );
};

const VinylCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<Loader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <VinylPlayer isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default VinylCanvas;
