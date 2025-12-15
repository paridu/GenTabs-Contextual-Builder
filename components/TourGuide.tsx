import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';

export interface Step {
  targetId: string;
  title: string;
  content: string;
}

interface TourGuideProps {
  steps: Step[];
  isOpen: boolean;
  onClose: () => void;
}

export const TourGuide: React.FC<TourGuideProps> = ({ steps, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updatePosition = useCallback(() => {
    if (!isOpen) return;
    const step = steps[currentStep];
    const element = document.getElementById(step.targetId);
    if (element) {
      setRect(element.getBoundingClientRect());
      // Auto scroll if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    } else {
      setRect(null); // Fallback to center
    }
  }, [isOpen, currentStep, steps]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
      setCurrentStep(0);
    } else {
      setCurrentStep(c => c + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(c => Math.max(0, c - 1));
  };

  // Determine tooltip position relative to highlight
  // Simplified logic: If highlight is on left, put tooltip right. If top, bottom. etc.
  let tooltipStyle: React.CSSProperties = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'fixed'
  };

  if (rect) {
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.right;
    
    // Prefer showing below, then above, then center if strict space constraints
    if (spaceBelow > 200) {
        tooltipStyle = { top: rect.bottom + 12, left: Math.max(10, Math.min(rect.left, window.innerWidth - 320)), position: 'fixed' };
    } else if (spaceAbove > 200) {
        tooltipStyle = { bottom: window.innerHeight - rect.top + 12, left: Math.max(10, Math.min(rect.left, window.innerWidth - 320)), position: 'fixed' };
    } else if (spaceRight > 320) {
        tooltipStyle = { top: rect.top, left: rect.right + 12, position: 'fixed' };
    }
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Background Mask - Using boxShadow trick for "hole" */}
      {rect ? (
        <div 
          className="absolute transition-all duration-300 ease-in-out pointer-events-none"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
            borderRadius: '8px'
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/70" />
      )}

      {/* Tooltip Card */}
      <div 
        className="bg-white p-5 rounded-lg shadow-xl w-[320px] max-w-[90vw] animate-in fade-in zoom-in duration-300 border border-slate-200"
        style={tooltipStyle}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
             <div className="bg-brand-100 text-brand-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {currentStep + 1}
             </div>
             <h3 className="font-bold text-slate-800 text-lg">{step.title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          {step.content}
        </p>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <div className="flex space-x-1">
             {steps.map((_, i) => (
                 <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'w-4 bg-brand-500' : 'w-1.5 bg-slate-200'}`} />
             ))}
          </div>
          <div className="flex space-x-2">
            <button 
                onClick={handlePrev} 
                disabled={currentStep === 0}
                className="p-2 text-slate-500 hover:text-brand-600 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
                onClick={handleNext}
                className="flex items-center space-x-1 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-md hover:bg-brand-700 transition-colors"
            >
                <span>{isLast ? 'เริ่มใช้งาน' : 'ถัดไป'}</span>
                {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};