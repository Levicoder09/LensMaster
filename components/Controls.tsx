
import React from 'react';
import { SceneState, CompositionGrid, LightConfig } from '../types';

interface ControlsProps {
  state: SceneState;
  setState: React.Dispatch<React.SetStateAction<SceneState>>;
  onGeneratePrompt: () => void;
  loading: boolean;
}

const Controls: React.FC<ControlsProps> = ({ state, setState, onGeneratePrompt, loading }) => {
  
  const updateLight = (id: string, updates: Partial<LightConfig>) => {
    setState(prev => ({
      ...prev,
      lights: prev.lights.map(l => l.id === id ? { ...l, ...updates } : l)
    }));
  };

  const handleDollyZoom = () => {
    const duration = 2000;
    const start = performance.now();
    const startDist = state.cameraDistance;
    const startFOV = state.cameraFOV;
    
    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const targetDist = startDist - (startDist - 2) * progress;
      const constant = startDist * Math.tan((startFOV * Math.PI) / 360);
      const targetFOV = (Math.atan(constant / targetDist) * 360) / Math.PI;

      setState(prev => ({
        ...prev,
        cameraDistance: targetDist,
        cameraFOV: targetFOV
      }));

      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const cameraLabel = () => {
    if (state.cameraDistance < 1.5) return "特写 (Extreme Close-up)";
    if (state.cameraDistance < 2.5) return "中近景 (Medium Close-up)";
    if (state.cameraDistance < 5) return "中景 (Medium Shot)";
    return "全景 (Wide Shot)";
  };

  return (
    <div className="absolute right-0 top-0 w-80 h-full bg-slate-900/90 backdrop-blur-md p-6 border-l border-slate-700 overflow-y-auto z-20 shadow-2xl">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <i className="fas fa-video text-blue-400"></i> 导演控制台
      </h2>

      {/* Camera Section */}
      <section className="mb-8">
        <h3 className="text-sm font-semibold uppercase text-slate-400 mb-4 border-b border-slate-700 pb-1">🎥 运镜模拟 (The Mover)</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>推拉距离 (Dolly)</span>
              <span>{state.cameraDistance.toFixed(1)}m</span>
            </div>
            <input 
              type="range" min="1" max="10" step="0.1" 
              value={state.cameraDistance} 
              onChange={(e) => setState(s => ({ ...s, cameraDistance: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>视场角 (Zoom)</span>
              <span>{state.cameraFOV.toFixed(0)}°</span>
            </div>
            <input 
              type="range" min="10" max="100" step="1" 
              value={state.cameraFOV} 
              onChange={(e) => setState(s => ({ ...s, cameraFOV: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>摄影机高度</span>
              <span>{state.cameraHeight.toFixed(1)}m</span>
            </div>
            <input 
              type="range" min="0.2" max="4" step="0.1" 
              value={state.cameraHeight} 
              onChange={(e) => setState(s => ({ ...s, cameraHeight: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <button 
            onClick={handleDollyZoom}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-medium transition-colors"
          >
            希区柯克变焦 (一键特效)
          </button>
        </div>
      </section>

      {/* Composition Section */}
      <section className="mb-8">
        <h3 className="text-sm font-semibold uppercase text-slate-400 mb-4 border-b border-slate-700 pb-1">📐 构图辅助 (The Framer)</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(CompositionGrid).map((grid) => (
            <button
              key={grid}
              onClick={() => setState(s => ({ ...s, gridType: grid }))}
              className={`py-2 text-xs rounded border transition-all ${
                state.gridType === grid 
                  ? 'bg-blue-600 border-blue-400 text-white' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {grid}
            </button>
          ))}
        </div>
      </section>

      {/* Lighting Section */}
      <section className="mb-8">
        <h3 className="text-sm font-semibold uppercase text-slate-400 mb-4 border-b border-slate-700 pb-1">💡 光影实验 (The Lighter)</h3>
        <div className="space-y-4">
          {state.lights.map((light) => (
            <div key={light.id} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{light.name}</span>
                <input 
                  type="checkbox" 
                  checked={light.enabled} 
                  onChange={(e) => updateLight(light.id, { enabled: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                />
              </div>
              {light.enabled && (
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-slate-400 uppercase w-12">颜色</span>
                    <input 
                      type="color" 
                      value={light.color} 
                      onChange={(e) => updateLight(light.id, { color: e.target.value })}
                      className="w-full h-6 bg-transparent rounded cursor-pointer border-none"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-slate-400 uppercase w-12">亮度</span>
                    <input 
                      type="range" min="0" max="10" step="0.5" 
                      value={light.intensity} 
                      onChange={(e) => updateLight(light.id, { intensity: parseFloat(e.target.value) })}
                      className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* AI Prompter */}
      <section className="mt-10">
        <button 
          onClick={onGeneratePrompt}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 ${
            loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
          }`}
        >
          {loading ? (
            <i className="fas fa-circle-notch fa-spin"></i>
          ) : (
            <i className="fas fa-magic"></i>
          )}
          生成 AI 视频提示词 (PROMPTER)
        </button>
      </section>

      {/* Real-time Status */}
      <div className="mt-8 p-3 bg-blue-900/20 border border-blue-800/50 rounded-lg text-xs text-blue-300">
        <div className="flex items-center gap-2 mb-1">
          <i className="fas fa-info-circle"></i>
          <span className="font-bold">实时状态 (LIVE)</span>
        </div>
        <p>当前景别: <span className="text-white">{cameraLabel()}</span></p>
        <p>激活灯光: <span className="text-white">{state.lights.filter(l => l.enabled).length} 个</span></p>
      </div>
    </div>
  );
};

export default Controls;
