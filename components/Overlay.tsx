
import React from 'react';
import { CompositionGrid } from '../types';

interface OverlayProps {
  type: CompositionGrid;
}

const Overlay: React.FC<OverlayProps> = ({ type }) => {
  if (type === CompositionGrid.NONE) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {type === CompositionGrid.THIRDS && (
        <svg className="w-full h-full stroke-white/30 stroke-1">
          <line x1="33.33%" y1="0" x2="33.33%" y2="100%" />
          <line x1="66.66%" y1="0" x2="66.66%" y2="100%" />
          <line x1="0" y1="33.33%" x2="100%" y2="33.33%" />
          <line x1="0" y1="66.66%" x2="100%" y2="66.66%" />
        </svg>
      )}
      
      {type === CompositionGrid.CENTER && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-16 h-16 border border-white/40 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      )}

      {type === CompositionGrid.GOLDEN && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full stroke-white/30 fill-none">
          <path d="M 0 0 L 100 0 L 100 100 L 0 100 Z" />
          <path d="M 61.8 0 L 61.8 100" />
          <path d="M 61.8 61.8 L 100 61.8" />
          <path d="M 76.4 61.8 L 76.4 100" />
          {/* Rough approximation of the spiral curve */}
          <path d="M 0 0 C 100 0, 100 100, 61.8 100 C 61.8 61.8, 100 61.8, 100 80" className="stroke-white/40" />
        </svg>
      )}
    </div>
  );
};

export default Overlay;
