import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  furthestStepReached: number;
}

const STEP_LABELS = [
  'معلومات صاحب الفكرة',
  'تفاصيل الفكرة',
  'تفاصيل التنفيذ',
  'المشاركة في الفريق',
  'المراجعة والإرسال',
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
  furthestStepReached,
}) => {
  return (
    <div className="w-full py-4 mb-8">
      {/* Mobile step progress text */}
      <div className="flex md:hidden items-center justify-between mb-3 text-xs font-semibold px-1">
        <span className="text-cyan-400">
          الخطوة {currentStep} من {totalSteps}
        </span>
        <span className="text-slate-300">{STEP_LABELS[currentStep - 1]}</span>
      </div>

      {/* Progress Bar & Dots */}
      <div className="relative">
        {/* Background track line */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-slate-800 rounded-full z-0 hidden md:block" />
        
        {/* Active progress fill */}
        <div
          className="absolute top-5 right-6 h-1 bg-gradient-to-l from-cyan-400 to-sky-500 rounded-full z-0 transition-all duration-500 hidden md:block"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />

        <div className="flex justify-between items-start relative z-10">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            const isClickable = stepNum <= furthestStepReached;

            return (
              <button
                key={stepNum}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(stepNum)}
                className={`flex flex-col items-center group transition-all duration-300 focus:outline-none ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                    isCompleted
                      ? 'bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 shadow-cyan-500/30'
                      : isCurrent
                      ? 'bg-slate-900 border-2 border-cyan-400 text-cyan-300 shadow-glow-cyan ring-4 ring-cyan-500/20'
                      : 'bg-slate-900 border border-slate-700 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : stepNum}
                </div>

                {/* Step Text Label (Desktop) */}
                <span
                  className={`mt-2.5 text-xs font-medium text-center hidden md:block max-w-[110px] leading-snug transition-colors duration-200 ${
                    isCurrent
                      ? 'text-cyan-300 font-bold'
                      : isCompleted
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  {STEP_LABELS[i]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
