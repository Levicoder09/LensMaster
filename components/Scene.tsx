
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Environment, ContactShadows, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { SceneState } from '../types';
import { ThreeElements } from '@react-three/fiber';

// Fix for JSX intrinsic element errors in Three.js/R3F
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

interface SubjectProps {
  action: 'idle' | 'pose1' | 'pose2';
  distance: number;
  showLabel?: boolean;
}

export const Subject: React.FC<SubjectProps> = ({ action, distance, showLabel = true }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (action === 'idle') {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      } else if (action === 'pose1') {
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  const getShotLabel = (dist: number) => {
    if (dist < 1.5) return "特写 (Close-up)";
    if (dist < 2.5) return "中近景 (Medium Close-up)";
    if (dist < 5) return "中景 (Medium Shot)";
    return "全景 (Wide Shot)";
  };

  const getShotColor = (dist: number) => {
    if (dist < 1.5) return "#f87171";
    if (dist < 2.5) return "#fbbf24";
    if (dist < 5) return "#34d399";
    return "#60a5fa";
  };

  return (
    <group ref={meshRef}>
      {showLabel && (
        <Billboard position={[0, 2.2, 0]}>
          <Text
            fontSize={0.12}
            color={getShotColor(distance)}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {getShotLabel(distance)}
          </Text>
        </Billboard>
      )}

      {/* Low-Poly Figure */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#fca5a5" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.5, 1, 0.3]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[-0.4, 1.2, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#fca5a5" />
      </mesh>
      <mesh position={[0.4, 1.2, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#fca5a5" />
      </mesh>
      <mesh position={[-0.15, 0.25, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.15, 0.25, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

const CameraVisualizer: React.FC<{ state: SceneState }> = ({ state }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      const targetPos = new THREE.Vector3(0, state.cameraHeight, state.cameraDistance);
      meshRef.current.position.lerp(targetPos, 0.1);
      meshRef.current.lookAt(0, 1, 0);
    }
  });

  return (
    <group ref={meshRef}>
      {/* 简单的 3D 摄像机模型 */}
      <mesh>
        <boxGeometry args={[0.4, 0.3, 0.5]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* 顶部胶片盒 */}
      <mesh position={[0, 0.25, 0.1]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <Billboard position={[0, 0.5, 0]}>
        <Text fontSize={0.1} color="#60a5fa" outlineWidth={0.01}>摄像机位置</Text>
      </Billboard>
    </group>
  );
};

interface SceneProps {
  state: SceneState;
}

const Scene: React.FC<SceneProps> = ({ state }) => {
  return (
    <div className="w-full h-full bg-slate-900">
      <Canvas shadows camera={{ position: [8, 5, 8], fov: 45 }}>
        <OrbitControls 
          enablePan={true} 
          target={[0, 1, 0]} 
          maxDistance={30} 
          minDistance={2}
        />
        
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.2} />
        
        {state.lights.map((light) => (
          light.enabled && (
            <group key={light.id} position={light.position}>
              {light.type === 'spot' ? (
                <spotLight intensity={light.intensity * 20} color={light.color} castShadow target-position={[0, 1, 0]} />
              ) : (
                <pointLight intensity={light.intensity * 20} color={light.color} castShadow />
              )}
              <mesh>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color={light.color} />
              </mesh>
            </group>
          )
        ))}

        <Subject action={state.subjectAction} distance={state.cameraDistance} />
        <CameraVisualizer state={state} />
        
        <Grid 
          infiniteGrid 
          fadeDistance={30} 
          sectionColor="#1e293b" 
          sectionThickness={1} 
          cellColor="#334155" 
          cellThickness={0.5}
        />
        
        <ContactShadows opacity={0.4} blur={2} />
        <Environment preset="night" />

        <group rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
          <mesh>
            <ringGeometry args={[1.48, 1.52, 64]} />
            <meshBasicMaterial color={state.cameraDistance < 2 ? "#f87171" : "#475569"} transparent opacity={0.3} />
          </mesh>
          <Text position={[1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} fontSize={0.1} color="#94a3b8">1.5m [特写]</Text>

          <mesh>
            <ringGeometry args={[3.98, 4.02, 64]} />
            <meshBasicMaterial color={state.cameraDistance > 3 && state.cameraDistance < 5 ? "#34d399" : "#475569"} transparent opacity={0.3} />
          </mesh>
          <Text position={[4.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} fontSize={0.1} color="#94a3b8">4.0m [中景]</Text>
        </group>
      </Canvas>
    </div>
  );
};

export default Scene;
