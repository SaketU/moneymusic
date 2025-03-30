import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model(props) {
   const { scene } = useGLTF("/scene.gltf"); // Ensure your model is in the 'public' folder
   return <primitive object={scene} {...props} />;
}

function ThreeDModel() {
   return (
      <div
         className="threeD-container"
         style={{ width: "100%", height: "500px" }}
      >
         <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 5, 5]} />
            <Suspense fallback={null}>
               <Model scale={0.5} position={[0, 0, 0]} />
            </Suspense>
            <OrbitControls enableZoom={true} />
         </Canvas>
      </div>
   );
}

export default ThreeDModel;
