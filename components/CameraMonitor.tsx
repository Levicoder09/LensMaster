
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import { SceneState } from '../types';
import { Subject } from './Scene';

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

interface CameraMonitorProps {
  state: SceneState;
}

const CameraMonitor: React.FC<CameraMonitorProps> = ({ state }) => {
  const getShotLabel = (dist: number) => {
    if (dist < 1.5) return "特写 (CLOSE-UP)";
    if (dist < 2.5) return "中近景 (MCU)";
    if (dist < 5) return "中景 (MEDIUM SHOT)";
    return "全景 (WIDE SHOT)";
  };

  return (
    <div className="absolute top-24 left-6 z-40 w-64 h-40 bg-black border-2 border-slate-700 rounded-lg overflow-hidden shadow-2xl group transition-all hover:w-80 hover:h-52">
      {/* 渲染摄像机视角 */}
      <div className="w-full h-full relative">
        <Canvas shadows gl={{ antialias: true }}>
          <PerspectiveCamera
            makeDefault
            position={[0, state.cameraHeight, state.cameraDistance]}
            fov={state.cameraFOV}
            onUpdate={(c) => c.lookAt(0, 1, 0)}
          />
          <ambientLight intensity={0.4} />
          {state.lights.map((light) => (
            light.enabled && (
              <group key={light.id} position={light.position}>
                {light.type === 'spot' ? (
                  <spotLight intensity={light.intensity * 20} color={light.color} castShadow target-position={[0, 1, 0]} />
                ) : (
                  <pointLight intensity={light.intensity * 20} color={light.color} castShadow />
                )}
              </group>
            )
          ))}
          <Subject action={state.subjectAction} distance={state.cameraDistance} showLabel={false} />
          <Environment preset="night" />
          <ContactShadows opacity={0.4} blur={2} />
          <color attach="background" args={['#050505']} />
        </Canvas>

        {/* 监视器 UI 覆盖层 */}
        <div className="absolute inset-0 pointer-events-none p-2 flex flex-col justify-between border-[1px] border-white/10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5 bg-red-600/80 px-1.5 py-0.5 rounded text-[8px] font-bold text-white animate-pulse">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              REC
            </div>
            <div className="text-[10px] text-white/70 font-mono">00:12:44:02</div>
          </div>

          <div className="flex flex-col items-center">
             <div className="w-6 h-6 border-2 border-white/20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white/40"></div>
             </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="bg-blue-600/90 px-2 py-0.5 rounded text-[10px] font-black text-white italic">
              {getShotLabel(state.cameraDistance)}
            </div>
            <div className="text-[10px] text-white/70 font-mono">4K 60FPS</div>
          </div>
        </div>
        
        {/* 边角线条 */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/40"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-right-2 border-white/40"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/40"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/40"></div>
      </div>
      <div className="bg-slate-800 px-3 py-1 text-[10px] text-slate-400 font-bold border-t border-slate-700">
        监视器: 实时摄像机预览
      </div>
    </div>
  );
};

export default CameraMonitor;
