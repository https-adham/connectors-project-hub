import React, { useState } from 'react';
import { ProjectIdea } from '../../types/database';
import { CheckCircle, Copy, Check, RotateCcw, Sparkles } from 'lucide-react';

interface SubmissionSuccessProps {
  idea: ProjectIdea;
  onReset: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ idea, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(idea.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="card-futuristic p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Glowing Check Icon */}
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border-2 border-emerald-400/60 flex items-center justify-center text-emerald-400 shadow-glow-teal animate-bounce">
        <CheckCircle className="w-10 h-10 stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>تم الحفظ بنجاح في قاعدة البيانات</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          شكراً لمشاركتك فكرتك مع Connectors Team!
        </h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          تم استلام فكرتك وحفظها في قاعدة بيانات المشاريع الرسمية. سيقوم فريق مراجعة الأفكار بدراستها والتواصل معك حال ملاءمتها للتنفيذ.
        </p>
      </div>

      {/* Submitted Summary Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-right space-y-3">
        <div>
          <span className="text-[11px] text-slate-400 block mb-0.5">عنوان الفكرة:</span>
          <span className="text-base font-bold text-cyan-300 block">{idea.project_title}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">نوع التقديم:</span>
            <span className="font-semibold text-slate-200">
              {idea.submission_type === 'anonymous' ? 'بدون هوية (Anonymous)' : idea.submitter_name}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">وقت التقديم:</span>
            <span className="font-semibold text-slate-200">
              {new Date(idea.created_at).toLocaleString('ar-EG')}
            </span>
          </div>
        </div>

        {/* Reference ID */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">الرقم المرجعي للفكرة (UUID):</span>
            <span className="text-xs font-mono text-slate-300">{idea.id}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyId}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-all"
            title="نسخ الرقم المرجعي"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm shadow-glow-sm flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>تقديم فكرة أخرى</span>
        </button>
      </div>
    </div>
  );
};
