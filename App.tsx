
import React, { useState } from 'react';
import Scene from './components/Scene';
import Controls from './components/Controls';
import Overlay from './components/Overlay';
import CameraMonitor from './components/CameraMonitor';
import { SceneState, CompositionGrid, LightConfig } from './types';
import { generateCinematicPrompt } from './services/geminiService';

const DEFAULT_LIGHTS: LightConfig[] = [
  { id: 'key', name: '主光 (Key Light)', enabled: true, color: '#ffffff', intensity: 5, position: [3, 3, 3], type: 'spot' },
  { id: 'fill', name: '补光 (Fill Light)', enabled: true, color: '#4455ff', intensity: 2, position: [-4, 2, 2], type: 'point' },
  { id: 'rim', name: '轮廓光 (Rim Light)', enabled: true, color: '#ff4400', intensity: 8, position: [0, 4, -4], type: 'spot' },
];

const App: React.FC = () => {
  const [sceneState, setSceneState] = useState<SceneState>({
    cameraDistance: 6,
    cameraHeight: 1.5,
    cameraFOV: 45,
    gridType: CompositionGrid.NONE,
    lights: DEFAULT_LIGHTS,
    subjectAction: 'idle'
  });

  const [aiPrompt, setAiPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);

  const handleGeneratePrompt = async () => {
    setLoading(true);
    const result = await generateCinematicPrompt(sceneState);
    setAiPrompt(result);
    setLoading(false);
    setShowPromptModal(true);
  };

  const copyToClipboard = () => {
    if (aiPrompt) {
      navigator.clipboard.writeText(aiPrompt);
      alert("已成功复制到剪贴板！");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 font-sans text-slate-100 select-none">
      {/* 3D Scene Container (Editor View) */}
      <div className="absolute inset-0 z-0">
        <Scene state={sceneState} />
        <Overlay type={sceneState.gridType} />
      </div>

      {/* Real-time Camera Monitor Overlay */}
      <CameraMonitor state={sceneState} />

      {/* Top Navigation / Branding */}
      <div className="absolute top-6 left-6 z-30 pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg pointer-events-auto">
            <i className="fas fa-film text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">CineMaster</h1>
            <p className="text-[10px] text-blue-400 tracking-[0.2em] font-bold">虚拟摄影实验室</p>
          </div>
        </div>
      </div>

      {/* Interactive Legend / Toast */}
      <div className="absolute bottom-6 left-6 z-30 space-y-2 pointer-events-none">
        <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-xs flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>模式：上帝视角 / 教学模拟</span>
        </div>
      </div>

      {/* UI Controls */}
      <Controls 
        state={sceneState} 
        setState={setSceneState} 
        onGeneratePrompt={handleGeneratePrompt}
        loading={loading}
      />

      {/* Modal for AI Prompt */}
      {showPromptModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <i className="fas fa-sparkles"></i> AI 生成的提示词
              </h3>
              <button onClick={() => setShowPromptModal(false)} className="text-white/60 hover:text-white transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-8">
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-sm text-slate-300 leading-relaxed mb-6 max-h-60 overflow-y-auto italic">
                {aiPrompt}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <i className="fas fa-copy"></i> 复制到剪贴板
                </button>
                <button 
                  onClick={() => setShowPromptModal(false)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold transition-colors"
                >
                  关闭
                </button>
              </div>
              <p className="mt-4 text-[10px] text-slate-500 text-center uppercase tracking-widest">
                已针对 Veo, Midjourney 和 Sora 进行优化
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions / Onboarding Tooltip */}
      <div className="absolute top-6 right-84 z-30 pointer-events-none hidden lg:block">
        <div className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-200 text-[10px] px-3 py-1.5 rounded-md flex items-center gap-2 backdrop-blur-sm">
          <i className="fas fa-mouse-pointer"></i>
          <span>旋转上帝视角：左键拖拽 | 运镜：通过控制台调整</span>
        </div>
      </div>
    </div>
  );
};

export default App;
